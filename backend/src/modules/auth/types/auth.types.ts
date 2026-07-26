import type { Permission } from '../../../core/auth/permissions';
import type { Role } from '../../../core/auth/roles';

export interface AuthUser {
  id: string;
  username: string;
  email: string | null;
  passwordHash: string;
  role: Role;
  employeeId: bigint | null;
  isActive: boolean;
  tokenVersion: number;
  lastLoginAt: Date | null;
}

export interface StoredRefreshToken {
  id: string;
  userId: string;
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
  username: string;
  email: string | null;
  role: Role;
  employeeId: string | null;
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
