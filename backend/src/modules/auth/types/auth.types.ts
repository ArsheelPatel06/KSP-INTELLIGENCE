import type { Permission } from '../../../core/auth/permissions';
import type { Role } from '../../../core/auth/roles';

export interface AuthUser {
  id: bigint;
  kgid: string | null;
  firstName: string | null;
  passwordHash: string | null;
  role: string;
  tokenVersion: number;
  lastLoginAt: Date | null;
  isActive: boolean;
}

export interface StoredRefreshToken {
  id: string;
  employeeId: bigint;
  tokenHash: string;
  familyId: string;
  expiresAt: Date;
  revokedAt: Date | null;
}

export interface AuthRequestMetadata {
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
}

export interface AuthenticatedUser {
  id: string;
  kgid: string | null;
  firstName: string | null;
  role: string;
  permissions: Permission[];
  lastLoginAt: string | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
}

export interface LoginResult {
  user: AuthenticatedUser;
  tokens: AuthTokens;
}

export interface RefreshResult {
  user: AuthenticatedUser;
  tokens: AuthTokens;
}
