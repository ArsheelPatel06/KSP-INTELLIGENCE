import { Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '../../../core/database/prisma';
import type {
  AuthRepository,
  CreateAuditLogInput,
  CreateRefreshTokenInput,
  RotateRefreshTokenInput,
} from '../interfaces/auth-repository.interface';
import type { AuthUser, StoredRefreshToken } from '../types/auth.types';
import { ROLE_VALUES } from '../../../core/auth/roles';

const employeeSelect = {
  id: true,
  kgid: true,
  firstName: true,
  passwordHash: true,
  role: true,
  active: true,
  tokenVersion: true,
  lastLoginAt: true,
} satisfies Prisma.EmployeeSelect;

export class PrismaAuthRepository implements AuthRepository {
  constructor(private readonly client: PrismaClient = prisma) {}

  async findUserByIdentifier(identifier: string): Promise<AuthUser | null> {
    const emp = await this.client.employee.findFirst({
      where: { kgid: identifier },
      select: employeeSelect,
    });
    if (!emp) return null;
    return this.mapToAuthUser(emp);
  }

  async findUserById(employeeId: bigint): Promise<AuthUser | null> {
    const emp = await this.client.employee.findUnique({
      where: { id: employeeId },
      select: employeeSelect,
    });
    if (!emp) return null;
    return this.mapToAuthUser(emp);
  }

  async updateLastLogin(employeeId: bigint): Promise<void> {
    await this.client.employee.update({
      where: { id: employeeId },
      data: { lastLoginAt: new Date() },
    });
  }

  async findRefreshTokenByHash(tokenHash: string): Promise<StoredRefreshToken | null> {
    const token = await this.client.refreshToken.findUnique({
      where: { tokenHash },
      select: {
        id: true,
        employeeId: true,
        tokenHash: true,
        familyId: true,
        expiresAt: true,
        revokedAt: true,
      },
    });
    return token;
  }

  async createRefreshToken(input: CreateRefreshTokenInput): Promise<void> {
    const { ipAddress, userAgent, ...rest } = input;
    await this.client.refreshToken.create({ 
      data: {
        ...rest,
        createdByIp: ipAddress,
      } 
    });
  }

  async rotateRefreshToken(input: RotateRefreshTokenInput): Promise<void> {
    await this.client.$transaction(async (transaction) => {
      const current = await transaction.refreshToken.findUnique({
        where: { id: input.currentTokenId },
      });

      if (!current || current.revokedAt) {
        throw new Error('Refresh token is no longer active');
      }

      const { ipAddress, userAgent, ...nextTokenRest } = input.nextToken;
      await transaction.refreshToken.create({ 
        data: {
          ...nextTokenRest,
          createdByIp: ipAddress,
        }
      });
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
    const { employeeId, event, ipAddress, userAgent, ...metadata } = input;
    await this.client.authAuditLog.create({
      data: {
        employeeId,
        event,
        ipAddress,
        userAgent,
        metadata: metadata as unknown as Prisma.InputJsonValue,
      },
    });
  }

  roleExists(role: string): boolean {
    return (ROLE_VALUES as readonly string[]).includes(role);
  }

  async findUserByEmail(email: string): Promise<AuthUser | null> {
    const emp = await this.client.employee.findUnique({
      where: { email },
      select: employeeSelect,
    });
    if (!emp) return null;
    return this.mapToAuthUser(emp);
  }

  async findUserByResetToken(token: string): Promise<AuthUser | null> {
    const emp = await this.client.employee.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiresAt: {
          gt: new Date()
        }
      },
      select: employeeSelect,
    });
    if (!emp) return null;
    return this.mapToAuthUser(emp);
  }

  async createUser(data: any): Promise<AuthUser> {
    const emp = await this.client.employee.create({
      data,
      select: employeeSelect,
    });
    return this.mapToAuthUser(emp);
  }

  async saveResetToken(employeeId: bigint, token: string, expiresAt: Date): Promise<void> {
    await this.client.employee.update({
      where: { id: employeeId },
      data: {
        resetToken: token,
        resetTokenExpiresAt: expiresAt,
      }
    });
  }

  async updatePassword(employeeId: bigint, passwordHash: string): Promise<void> {
    await this.client.employee.update({
      where: { id: employeeId },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiresAt: null,
      }
    });
  }

  private mapToAuthUser(emp: any): AuthUser {
    return {
      id: emp.id,
      kgid: emp.kgid,
      firstName: emp.firstName,
      passwordHash: emp.passwordHash,
      role: emp.role,
      tokenVersion: emp.tokenVersion,
      lastLoginAt: emp.lastLoginAt,
      isActive: emp.active,
    };
  }
}
