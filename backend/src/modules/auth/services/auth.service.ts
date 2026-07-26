import { AuthAuditEvent } from '@prisma/client';
import { permissionsForRole } from '../../../core/auth/permissions';
import type { AuthContext } from '../../../core/auth/auth-context.interface';
import { AppError } from '../../../core/exceptions/app-error';
import { env } from '../../../config/env';
import type { LoginRequestDto } from '../dto/auth.dto';
import type { AuthRepository } from '../interfaces/auth-repository.interface';
import { toAuthenticatedUser } from '../mappers/auth.mapper';
import type {
  AuthRequestMetadata,
  LoginResult,
  RefreshResult,
} from '../types/auth.types';
import { performDummyPasswordCheck, verifyPassword } from '../utils/password';
import {
  hashRefreshToken,
  issueTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
} from '../utils/token';

export class AuthService {
  constructor(private readonly repository: AuthRepository) {}

  async login(input: LoginRequestDto, metadata: AuthRequestMetadata): Promise<LoginResult> {
    const identifier = input.username.trim();
    const user = await this.repository.findUserByIdentifier(identifier);

    if (!user) {
      await performDummyPasswordCheck(input.password);
      await this.audit(undefined, AuthAuditEvent.LOGIN_FAILURE, false, metadata, 'Invalid credentials');
      throw this.invalidCredentialsError();
    }

    const passwordMatches = await verifyPassword(input.password, user.passwordHash);
    if (!passwordMatches || !user.isActive) {
      await this.audit(user.id, AuthAuditEvent.LOGIN_FAILURE, false, metadata, 'Invalid credentials');
      throw this.invalidCredentialsError();
    }

    const issued = issueTokenPair(user);
    await this.repository.createRefreshToken({
      id: issued.refreshTokenId,
      userId: user.id,
      tokenHash: hashRefreshToken(issued.refreshToken),
      familyId: issued.familyId,
      expiresAt: issued.refreshExpiresAt,
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
    });
    await this.repository.updateLastLogin(user.id);
    await this.audit(user.id, AuthAuditEvent.LOGIN_SUCCESS, true, metadata);

    return {
      user: toAuthenticatedUser({ ...user, lastLoginAt: new Date() }),
      tokens: {
        accessToken: issued.accessToken,
        refreshToken: issued.refreshToken,
        accessTokenExpiresIn: env.JWT_ACCESS_EXPIRES_IN,
        refreshTokenExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
      },
    };
  }

  async refresh(refreshToken: string, metadata: AuthRequestMetadata): Promise<RefreshResult> {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (error) {
      await this.audit(
        undefined,
        AuthAuditEvent.TOKEN_REFRESH_FAILURE,
        false,
        metadata,
        'Refresh token verification failed',
      );
      throw error;
    }

    const tokenHash = hashRefreshToken(refreshToken);
    const storedToken = await this.repository.findRefreshTokenByHash(tokenHash);

    if (!storedToken) {
      await this.audit(
        payload.sub,
        AuthAuditEvent.TOKEN_REFRESH_FAILURE,
        false,
        metadata,
        'Refresh token not found',
      );
      throw this.invalidRefreshTokenError();
    }

    if (storedToken.revokedAt) {
      await this.repository.revokeTokenFamily(storedToken.familyId);
      await this.audit(
        payload.sub,
        AuthAuditEvent.TOKEN_REUSE_DETECTED,
        false,
        metadata,
        'Revoked refresh token reuse detected; token family revoked',
      );
      throw new AppError('Refresh token reuse detected', {
        statusCode: 401,
        code: 'REFRESH_TOKEN_REUSE_DETECTED',
      });
    }

    if (storedToken.expiresAt <= new Date() || storedToken.userId !== payload.sub) {
      await this.audit(
        payload.sub,
        AuthAuditEvent.TOKEN_REFRESH_FAILURE,
        false,
        metadata,
        'Refresh token expired or subject mismatch',
      );
      throw this.invalidRefreshTokenError();
    }

    const user = await this.repository.findUserById(payload.sub);
    if (!user || !user.isActive || user.tokenVersion !== payload.tokenVersion) {
      await this.repository.revokeTokenFamily(storedToken.familyId);
      await this.audit(
        payload.sub,
        AuthAuditEvent.TOKEN_REFRESH_FAILURE,
        false,
        metadata,
        'User disabled or token version changed',
      );
      throw this.invalidRefreshTokenError();
    }

    const issued = issueTokenPair(user, storedToken.familyId);
    await this.repository.rotateRefreshToken({
      currentTokenId: storedToken.id,
      nextToken: {
        id: issued.refreshTokenId,
        userId: user.id,
        tokenHash: hashRefreshToken(issued.refreshToken),
        familyId: issued.familyId,
        expiresAt: issued.refreshExpiresAt,
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
      },
    });
    await this.audit(user.id, AuthAuditEvent.TOKEN_REFRESH, true, metadata);

    return {
      user: toAuthenticatedUser(user),
      tokens: {
        accessToken: issued.accessToken,
        refreshToken: issued.refreshToken,
        accessTokenExpiresIn: env.JWT_ACCESS_EXPIRES_IN,
        refreshTokenExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
      },
    };
  }

  async authenticate(accessToken: string): Promise<AuthContext> {
    const payload = verifyAccessToken(accessToken);
    const user = await this.repository.findUserById(payload.sub);

    if (!user || !user.isActive || user.tokenVersion !== payload.tokenVersion) {
      throw new AppError('Authentication required', {
        statusCode: 401,
        code: 'AUTHENTICATION_REQUIRED',
      });
    }

    return {
      userId: user.id,
      employeeId: user.employeeId?.toString(),
      role: user.role,
      permissions: permissionsForRole(user.role),
      tokenVersion: user.tokenVersion,
    };
  }

  private invalidCredentialsError(): AppError {
    return new AppError('Invalid username or password', {
      statusCode: 401,
      code: 'INVALID_CREDENTIALS',
    });
  }

  private invalidRefreshTokenError(): AppError {
    return new AppError('Invalid or expired refresh token', {
      statusCode: 401,
      code: 'INVALID_REFRESH_TOKEN',
    });
  }

  private async audit(
    userId: string | undefined,
    event: AuthAuditEvent,
    success: boolean,
    metadata: AuthRequestMetadata,
    details?: string,
  ): Promise<void> {
    await this.repository.createAuditLog({
      userId,
      event,
      success,
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
      requestId: metadata.requestId,
      details,
    });
  }
}
