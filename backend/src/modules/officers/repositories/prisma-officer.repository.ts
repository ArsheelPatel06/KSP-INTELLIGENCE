import { Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '@core/database/prisma';
import { buildPaginationMeta, normalizePagination } from '@core/pagination/pagination';
import type { OfficerRepository } from '../interfaces/officer-repository.interface';
import {
  officerAssignedCaseSelect,
  officerDetailInclude,
  officerListSelect,
  type OfficerDetailRecord,
  type OfficerListQuery,
} from '../types/officer.types';

export class PrismaOfficerRepository implements OfficerRepository {
  constructor(private readonly client: PrismaClient = prisma) {}

  async findById(id: bigint): Promise<OfficerDetailRecord | null> {
    return this.client.employee.findUnique({
      where: { id },
      include: officerDetailInclude,
    });
  }

  async findByKgid(kgid: string): Promise<OfficerDetailRecord | null> {
    return this.client.employee.findUnique({
      where: { kgid },
      include: officerDetailInclude,
    });
  }

  async list(input: OfficerListQuery) {
    const pagination = normalizePagination(input);
    const where = this.buildWhere(input);

    const [items, totalRecords] = await this.client.$transaction([
      this.client.employee.findMany({
        where,
        select: officerListSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ active: 'desc' }, { firstName: 'asc' }, { id: 'asc' }],
      }),
      this.client.employee.count({ where }),
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

  async listAssignedCases(employeeId: bigint, input: Pick<OfficerListQuery, 'page' | 'pageSize'> = {}) {
    const pagination = normalizePagination(input);
    const where: Prisma.CaseMasterWhereInput = {
      policePersonId: employeeId,
    };

    const [items, totalRecords] = await this.client.$transaction([
      this.client.caseMaster.findMany({
        where,
        select: officerAssignedCaseSelect,
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

  private buildWhere(input: OfficerListQuery): Prisma.EmployeeWhereInput {
    const where: Prisma.EmployeeWhereInput = {};
    const and: Prisma.EmployeeWhereInput[] = [];

    if (input.districtId) {
      and.push({ districtId: input.districtId });
    }

    if (input.unitId) {
      and.push({ unitId: input.unitId });
    }

    if (input.rankId) {
      and.push({ rankId: input.rankId });
    }

    if (input.designationId) {
      and.push({ designationId: input.designationId });
    }

    if (typeof input.active === 'boolean') {
      and.push({ active: input.active });
    }

    if (input.query) {
      and.push({
        OR: [
          {
            kgid: {
              contains: input.query,
              mode: 'insensitive',
            },
          },
          {
            firstName: {
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
