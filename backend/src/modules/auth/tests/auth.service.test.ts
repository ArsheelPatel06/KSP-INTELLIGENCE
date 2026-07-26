import { AuthAuditEvent, Role } from '@prisma/client';
import { beforeEach, describe, expect, it } from 'vitest';
import type {
  AuthRepository,
  CreateAuditLogInput,
  CreateRefreshTokenInput,
  RotateRefreshTokenInput,
} from '../interfaces/auth-repository.interface';
import { AuthService } from '../services/auth.service';
import type { AuthUser, StoredRefreshToken } from '../types/auth.types';
import { hashPassword } from '../utils/password';

class InMemoryAuthRepository implements AuthRepository {
  user: AuthUser | null = null;
  tokens = new Map<string, StoredRefreshToken>();
  audits: CreateAuditLogInput[] = [];
  revokedFamilies: string[] = [];

  async findUserByIdentifier(identifier: string): Promise<AuthUser | null> {
    if (!this.user) return null;
    return this.user.username === identifier || this.user.email === identifier ? this.user : null;
  }

  async findUserById(userId: string): Promise<AuthUser | null> {
    return this.user?.id === userId ? this.user : null;
  }

  async updateLastLogin(_userId: string): Promise<void> {}

  async findRefreshTokenByHash(tokenHash: string): Promise<StoredRefreshToken | null> {
    return [...this.tokens.values()].find((token) => token.tokenHash === tokenHash) ?? null;
  }

  async createRefreshToken(input: CreateRefreshTokenInput): Promise<void> {
    this.tokens.set(input.id, { ...input, revokedAt: null });
  }

  async rotateRefreshToken(input: RotateRefreshTokenInput): Promise<void> {
    const current = this.tokens.get(input.currentTokenId);
    if (!current || current.revokedAt) throw new Error('Refresh token is no longer active');
    current.revokedAt = new Date();
    this.tokens.set(input.nextToken.id, { ...input.nextToken, revokedAt: null });
  }

  async revokeTokenFamily(familyId: string): Promise<void> {
    this.revokedFamilies.push(familyId);
    for (const token of this.tokens.values()) {
      if (token.familyId === familyId && !token.revokedAt) token.revokedAt = new Date();
    }
  }

  async createAuditLog(input: CreateAuditLogInput): Promise<void> {
    this.audits.push(input);
  }

  roleExists(role: Role): boolean {
    return Object.values(Role).includes(role);
  }
}

describe('AuthService', () => {
  let repository: InMemoryAuthRepository;
  let service: AuthService;

  beforeEach(async () => {
    repository = new InMemoryAuthRepository();
    repository.user = {
      id: 'user-1',
      username: 'officer01',
      email: 'officer@ksp.gov.in',
      passwordHash: await hashPassword('SecurePass123!'),
      role: Role.SI,
      employeeId: 101n,
      isActive: true,
      tokenVersion: 0,
      lastLoginAt: null,
    };
    service = new AuthService(repository);
  });

  it('logs in with valid credentials and records an audit event', async () => {
    const result = await service.login(
      { username: 'officer01', password: 'SecurePass123!', deliveryMode: 'body' },
      { requestId: 'req-1' },
    );

    expect(result.tokens.accessToken).toBeTruthy();
    expect(result.tokens.refreshToken).toBeTruthy();
    expect(result.user.role).toBe(Role.SI);
    expect(repository.tokens.size).toBe(1);
    expect(repository.audits.at(-1)?.event).toBe(AuthAuditEvent.LOGIN_SUCCESS);
  });

  it('rejects invalid credentials without exposing which field failed', async () => {
    await expect(
      service.login(
        { username: 'officer01', password: 'WrongPassword!', deliveryMode: 'body' },
        { requestId: 'req-2' },
      ),
    ).rejects.toMatchObject({ code: 'INVALID_CREDENTIALS' });

    expect(repository.audits.at(-1)?.event).toBe(AuthAuditEvent.LOGIN_FAILURE);
  });

  it('rotates a refresh token and revokes the previous token', async () => {
    const login = await service.login(
      { username: 'officer01', password: 'SecurePass123!', deliveryMode: 'body' },
      {},
    );
    const firstStoredToken = [...repository.tokens.values()][0];

    const refreshed = await service.refresh(login.tokens.refreshToken, {});

    expect(refreshed.tokens.refreshToken).not.toBe(login.tokens.refreshToken);
    expect(firstStoredToken?.revokedAt).toBeInstanceOf(Date);
    expect(repository.tokens.size).toBe(2);
    expect(repository.audits.at(-1)?.event).toBe(AuthAuditEvent.TOKEN_REFRESH);
  });

  it('detects reuse of a rotated refresh token and revokes the token family', async () => {
    const login = await service.login(
      { username: 'officer01', password: 'SecurePass123!', deliveryMode: 'body' },
      {},
    );
    await service.refresh(login.tokens.refreshToken, {});

    await expect(service.refresh(login.tokens.refreshToken, {})).rejects.toMatchObject({
      code: 'REFRESH_TOKEN_REUSE_DETECTED',
    });

    expect(repository.revokedFamilies.length).toBe(1);
    expect(repository.audits.at(-1)?.event).toBe(AuthAuditEvent.TOKEN_REUSE_DETECTED);
  });
});
