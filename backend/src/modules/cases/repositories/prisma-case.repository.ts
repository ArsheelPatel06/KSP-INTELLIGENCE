import { Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '@core/database/prisma';
import { buildPaginationMeta, normalizePagination } from '@core/pagination/pagination';
import type { CaseRepository } from '../interfaces/case-repository.interface';
import {
  caseDetailInclude,
  caseListSelect,
  caseSimilaritySelect,
  type CaseDetailRecord,
  type CaseListQuery,
  type CaseSimilarityItem,
} from '../types/case.types';

export class PrismaCaseRepository implements CaseRepository {
  constructor(private readonly client: PrismaClient = prisma) {}

  async findById(id: bigint): Promise<CaseDetailRecord | null> {
    return this.client.caseMaster.findUnique({
      where: { id },
      include: caseDetailInclude,
    });
  }

  async findByCrimeNo(crimeNo: string): Promise<CaseDetailRecord | null> {
    return this.client.caseMaster.findFirst({
      where: { crimeNo },
      include: caseDetailInclude,
    });
  }

  async findByCaseNo(caseNo: string): Promise<CaseDetailRecord | null> {
    return this.client.caseMaster.findFirst({
      where: { caseNo },
      include: caseDetailInclude,
    });
  }

  async list(input: CaseListQuery) {
    const pagination = normalizePagination(input);
    const where = this.buildWhere(input);

    const [items, totalRecords] = await this.client.$transaction([
      this.client.caseMaster.findMany({
        where,
        select: caseListSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ crimeRegisteredDate: 'desc' }, { id: 'desc' }],
      }),
      this.client.caseMaster.count({ where }),
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

  async listSimilarCases(caseMasterId: bigint, limit = 10): Promise<CaseSimilarityItem[]> {
    const take = Math.max(limit, 1);

    return this.client.caseSimilarity.findMany({
      where: {
        OR: [{ sourceCaseMasterId: caseMasterId }, { matchedCaseMasterId: caseMasterId }],
      },
      select: caseSimilaritySelect,
      take,
      orderBy: [{ similarityScore: 'desc' }, { generatedOn: 'desc' }],
    });
  }

  private buildWhere(input: CaseListQuery): Prisma.CaseMasterWhereInput {
    const where: Prisma.CaseMasterWhereInput = {};
    const and: Prisma.CaseMasterWhereInput[] = [];

    if (input.crimeNo) {
      and.push({ crimeNo: input.crimeNo });
    }

    if (input.caseNo) {
      and.push({ caseNo: input.caseNo });
    }

    if (input.policeStationId) {
      and.push({ policeStationId: input.policeStationId });
    }

    if (input.policePersonId) {
      and.push({ policePersonId: input.policePersonId });
    }

    if (input.caseStatusId) {
      and.push({ caseStatusId: input.caseStatusId });
    }

    if (input.crimeMajorHeadId) {
      and.push({ crimeMajorHeadId: input.crimeMajorHeadId });
    }

    if (input.crimeMinorHeadId) {
      and.push({ crimeMinorHeadId: input.crimeMinorHeadId });
    }

    if (input.districtId) {
      and.push({
        policeStation: {
          is: {
            districtId: input.districtId,
          },
        },
      });
    }

    if (input.fromCrimeRegisteredDate || input.toCrimeRegisteredDate) {
      and.push({
        crimeRegisteredDate: {
          gte: input.fromCrimeRegisteredDate,
          lte: input.toCrimeRegisteredDate,
        },
      });
    }

    if (input.query) {
      and.push({
        OR: [
          {
            crimeNo: {
              contains: input.query,
              mode: 'insensitive',
            },
          },
          {
            caseNo: {
              contains: input.query,
              mode: 'insensitive',
            },
          },
          {
            briefFacts: {
              contains: input.query,
              mode: 'insensitive',
            },
          },
        ],
      });
    }

    if (and.length > 0) {
      where.AND = and;
    }

    return where;
  }
}
