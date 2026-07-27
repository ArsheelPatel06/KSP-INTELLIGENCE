import type { Role } from '@prisma/client';
import type { AuthUser, StoredRefreshToken } from '../types/auth.types';

export interface CreateRefreshTokenInput {
  id: string;
  employeeId: bigint;
  tokenHash: string;
  familyId: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface RotateRefreshTokenInput {
  currentTokenId: string;
  nextToken: CreateRefreshTokenInput;
}

export interface CreateAuditLogInput {
  employeeId?: bigint;
  event: string;
  success: boolean;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  details?: string;
}

export interface AuthRepository {
  findUserByIdentifier(identifier: string): Promise<AuthUser | null>;
  findUserById(employeeId: bigint): Promise<AuthUser | null>;
  findUserByEmail(email: string): Promise<AuthUser | null>;
  findUserByResetToken(token: string): Promise<AuthUser | null>;
  updateLastLogin(employeeId: bigint): Promise<void>;
  findRefreshTokenByHash(tokenHash: string): Promise<StoredRefreshToken | null>;
  createRefreshToken(input: CreateRefreshTokenInput): Promise<void>;
  rotateRefreshToken(input: RotateRefreshTokenInput): Promise<void>;
  revokeTokenFamily(familyId: string): Promise<void>;
  createAuditLog(input: CreateAuditLogInput): Promise<void>;
  roleExists(role: string): boolean;
  createUser(data: any): Promise<AuthUser>;
  saveResetToken(employeeId: bigint, token: string, expiresAt: Date): Promise<void>;
  updatePassword(employeeId: bigint, passwordHash: string): Promise<void>;
}

