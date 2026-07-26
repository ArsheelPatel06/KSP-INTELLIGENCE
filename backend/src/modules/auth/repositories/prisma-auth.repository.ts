import { AuthAuditEvent, Prisma, PrismaClient, Role } from '@prisma/client';
import { prisma } from '../../../core/database/prisma';
import type {
  AuthRepository,
  CreateAuditLogInput,
  CreateRefreshTokenInput,
  RotateRefreshTokenInput,
} from '../interfaces/auth-repository.interface';
import type { AuthUser, StoredRefreshToken } from '../types/auth.types';

const userSelect = {
  id: true,
  username: true,
  email: true,
  passwordHash: true,
  role: true,
  employeeId: true,
  isActive: true,
  tokenVersion: true,
  lastLoginAt: true,
} satisfies Prisma.UserSelect;

export class PrismaAuthRepository implements AuthRepository {
  constructor(private readonly client: PrismaClient = prisma) {}

  async findUserByIdentifier(identifier: string): Promise<AuthUser | null> {
    return this.client.user.findFirst({
      where: {
        OR: [{ username: identifier }, { email: identifier.toLowerCase() }],
      },
      select: userSelect,
    });
  }

  async findUserById(userId: string): Promise<AuthUser | null> {
    return this.client.user.findUnique({ where: { id: userId }, select: userSelect });
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.client.user.update({ where: { id: userId }, data: { lastLoginAt: new Date() } });
  }

  async findRefreshTokenByHash(tokenHash: string): Promise<StoredRefreshToken | null> {
    return this.client.refreshToken.findUnique({
      where: { tokenHash },
      select: {
        id: true,
        userId: true,
        tokenHash: true,
        familyId: true,
        expiresAt: true,
        revokedAt: true,
      },
    });
  }

  async createRefreshToken(input: CreateRefreshTokenInput): Promise<void> {
    await this.client.refreshToken.create({ data: input });
  }

  async rotateRefreshToken(input: RotateRefreshTokenInput): Promise<void> {
    await this.client.$transaction(async (transaction) => {
      const current = await transaction.refreshToken.findUnique({
        where: { id: input.currentTokenId },
      });

      if (!current || current.revokedAt) {
        throw new Error('Refresh token is no longer active');
      }

      await transaction.refreshToken.create({ data: input.nextToken });
      await transaction.refreshToken.update({
        where: { id: input.currentTokenId },
        data: {
          revokedAt: new Date(),
          replacedByTokenId: input.nextToken.id,
        },
      });
    });
  }

  async revokeTokenFamily(familyId: string): Promise<void> {
    await this.client.refreshToken.updateMany({
      where: { familyId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async createAuditLog(input: CreateAuditLogInput): Promise<void> {
    await this.client.authAuditLog.create({ data: input });
  }

  roleExists(role: Role): boolean {
    return Object.values(Role).includes(role);
  }
}

export { AuthAuditEvent };
