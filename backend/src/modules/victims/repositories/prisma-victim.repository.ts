import { Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '@core/database/prisma';
import { buildPaginationMeta, normalizePagination } from '@core/pagination/pagination';
import type { VictimRepository } from '../interfaces/victim-repository.interface';
import {
  riskScoreSelect,
  victimDetailInclude,
  victimListSelect,
  type VictimDetailRecord,
  type VictimListQuery,
  type VictimRiskScoreItem,
} from '../types/victim.types';

export class PrismaVictimRepository implements VictimRepository {
  constructor(private readonly client: PrismaClient = prisma) {}

  async findById(id: bigint): Promise<VictimDetailRecord | null> {
    return this.client.victim.findUnique({
      where: { id },
      include: victimDetailInclude,
    });
  }

  async list(input: VictimListQuery) {
    const pagination = normalizePagination(input);
    const where = this.buildWhere(input);

    const [items, totalRecords] = await this.client.$transaction([
      this.client.victim.findMany({
        where,
        select: victimListSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ caseMasterId: 'desc' }, { id: 'desc' }],
      }),
      this.client.victim.count({ where }),
    ]);

    return {
      items,
      meta: buildPaginationMeta({
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalRecords,
      }),
    };
  }

  async listByCaseId(caseMasterId: bigint, input: Omit<VictimListQuery, 'caseMasterId'> = {}) {
    return this.list({ ...input, caseMasterId });
  }

  async listRiskScores(victimId: bigint, limit = 10): Promise<VictimRiskScoreItem[]> {
    const take = Math.max(limit, 1);

    return this.client.riskScore.findMany({
      where: { victimMasterId: victimId },
      select: riskScoreSelect,
      take,
      orderBy: [{ generatedOn: 'desc' }, { id: 'desc' }],
    });
  }

  private buildWhere(input: VictimListQuery): Prisma.VictimWhereInput {
    const where: Prisma.VictimWhereInput = {};
    const and: Prisma.VictimWhereInput[] = [];

    if (input.caseMasterId) {
      and.push({ caseMasterId: input.caseMasterId });
    }

    if (input.genderId) {
      and.push({ genderId: input.genderId });
    }

    if (typeof input.victimPolice === 'boolean') {
      and.push({ victimPolice: input.victimPolice });
    }

    if (typeof input.minAge === 'number' || typeof input.maxAge === 'number') {
      and.push({
        ageYear: {
          gte: input.minAge,
          lte: input.maxAge,
        },
      });
    }

    if (input.districtId) {
      and.push({
        case: {
          is: {
            policeStation: {
              is: {
                districtId: input.districtId,
              },
            },
          },
        },
      });
    }

    if (input.query) {
      and.push({
        victimNameHash: {
          contains: input.query,
          mode: 'insensitive',
        },
      });
    }

    if (and.length > 0) {
      where.AND = and;
    }

    return where;
  }
}
