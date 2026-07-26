import { createHash, randomUUID } from 'node:crypto';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../../../config/env';
import { permissionsForRole } from '../../../core/auth/permissions';
import type { AccessTokenPayload, RefreshTokenPayload } from '../../../core/auth/jwt.types';
import { AppError } from '../../../core/exceptions/app-error';
import type { AuthUser } from '../types/auth.types';

export interface IssuedTokenPair {
  accessToken: string;
  refreshToken: string;
  refreshTokenId: string;
  familyId: string;
  refreshExpiresAt: Date;
}

function durationToMilliseconds(value: string): number {
  const match = /^(\d+)(s|m|h|d)$/.exec(value);
  if (!match) throw new Error(`Unsupported token duration: ${value}`);

  const amount = Number(match[1]);
  const unit = match[2];
  const multiplier = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[unit as 's'];
  return amount * multiplier;
}

export function issueTokenPair(user: AuthUser, existingFamilyId?: string): IssuedTokenPair {
  const refreshTokenId = randomUUID();
  const familyId = existingFamilyId ?? randomUUID();

  const accessPayload: AccessTokenPayload = {
    sub: user.id,
    role: user.role,
    permissions: permissionsForRole(user.role),
    employeeId: user.employeeId?.toString(),
    tokenVersion: user.tokenVersion,
    type: 'access',
  };

  const refreshPayload: RefreshTokenPayload = {
    sub: user.id,
    jti: refreshTokenId,
    familyId,
    tokenVersion: user.tokenVersion,
    type: 'refresh',
  };

  const accessToken = jwt.sign(accessPayload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn'],
    issuer: 'ksp-intelligence-os',
    audience: 'ksp-api',
  });

  const refreshToken = jwt.sign(refreshPayload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
    issuer: 'ksp-intelligence-os',
    audience: 'ksp-auth',
  });

  return {
    accessToken,
    refreshToken,
    refreshTokenId,
    familyId,
    refreshExpiresAt: new Date(Date.now() + durationToMilliseconds(env.JWT_REFRESH_EXPIRES_IN)),
  };
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET, {
      issuer: 'ksp-intelligence-os',
      audience: 'ksp-api',
    });

    if (typeof payload === 'string' || payload.type !== 'access')
      throw new Error('Invalid token type');
    return payload as unknown as AccessTokenPayload;
  } catch {
    throw new AppError('Invalid or expired access token', {
      statusCode: 401,
      code: 'INVALID_ACCESS_TOKEN',
    });
  }
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  try {
    const payload = jwt.verify(token, env.JWT_REFRESH_SECRET, {
      issuer: 'ksp-intelligence-os',
      audience: 'ksp-auth',
    });

    if (typeof payload === 'string' || payload.type !== 'refresh')
      throw new Error('Invalid token type');
    return payload as unknown as RefreshTokenPayload;
  } catch {
    throw new AppError('Invalid or expired refresh token', {
      statusCode: 401,
      code: 'INVALID_REFRESH_TOKEN',
    });
  }
}

export function hashRefreshToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
