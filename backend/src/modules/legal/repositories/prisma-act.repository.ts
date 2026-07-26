import { Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '@core/database/prisma';
import { buildPaginationMeta, normalizePagination } from '@core/pagination/pagination';
import type { ActRepository } from '../interfaces/act-repository.interface';
import {
  actSelect,
  crimeHeadSectionMappingSelect,
  ipcReferenceSelect,
  legalDocumentSelect,
  legalSectionSelect,
  type ActListQuery,
  type ActRecord,
  type IpcReferenceListQuery,
  type LegalDocumentListQuery,
  type SectionListQuery,
} from '../types/legal.types';

export class PrismaActRepository implements ActRepository {
  constructor(private readonly client: PrismaClient = prisma) {}

  async findActByCode(code: string): Promise<ActRecord | null> {
    return this.client.act.findUnique({
      where: { code },
      select: actSelect,
    });
  }

  async listActs(input: ActListQuery) {
    const pagination = normalizePagination(input);
    const where = this.buildActWhere(input);

    const [items, totalRecords] = await this.client.$transaction([
      this.client.act.findMany({
        where,
        select: actSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ active: 'desc' }, { shortName: 'asc' }, { code: 'asc' }],
      }),
      this.client.act.count({ where }),
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

  async findSection(actCode: string, sectionCode: string) {
    return this.client.legalSection.findUnique({
      where: {
        actCode_sectionCode: {
          actCode,
          sectionCode,
        },
      },
      select: legalSectionSelect,
    });
  }

  async listSections(input: SectionListQuery) {
    const pagination = normalizePagination(input);
    const where = this.buildSectionWhere(input);

    const [items, totalRecords] = await this.client.$transaction([
      this.client.legalSection.findMany({
        where,
        select: legalSectionSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ actCode: 'asc' }, { sectionCode: 'asc' }],
      }),
      this.client.legalSection.count({ where }),
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

  async listSectionsByCrimeHead(crimeHeadId: bigint) {
    return this.client.crimeHeadActSection.findMany({
      where: { crimeHeadId },
      select: crimeHeadSectionMappingSelect,
      orderBy: [{ actCode: 'asc' }, { sectionCode: 'asc' }],
    });
  }

  async listLegalDocuments(input: LegalDocumentListQuery) {
    const pagination = normalizePagination(input);
    const where = this.buildLegalDocumentWhere(input);

    const [items, totalRecords] = await this.client.$transaction([
      this.client.legalDocumentSource.findMany({
        where,
        select: legalDocumentSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ title: 'asc' }, { id: 'asc' }],
      }),
      this.client.legalDocumentSource.count({ where }),
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

  async listIpcReferences(input: IpcReferenceListQuery) {
    const pagination = normalizePagination(input);
    const where = this.buildIpcReferenceWhere(input);

    const [items, totalRecords] = await this.client.$transaction([
      this.client.ipcSectionReference.findMany({
        where,
        select: ipcReferenceSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ actCode: 'asc' }, { sectionCode: 'asc' }, { id: 'asc' }],
      }),
      this.client.ipcSectionReference.count({ where }),
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

  private buildActWhere(input: ActListQuery): Prisma.ActWhereInput {
    const where: Prisma.ActWhereInput = {};
    const and: Prisma.ActWhereInput[] = [];

    if (typeof input.active === 'boolean') {
      and.push({ active: input.active });
    }

    if (input.query) {
      and.push({
        OR: [
          {
            code: {
              contains: input.query,
              mode: 'insensitive',
            },
          },
          {
            shortName: {
              contains: input.query,
              mode: 'insensitive',
            },
          },
          {
            description: {
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

  private buildSectionWhere(input: SectionListQuery): Prisma.LegalSectionWhereInput {
    const where: Prisma.LegalSectionWhereInput = {};
    const and: Prisma.LegalSectionWhereInput[] = [];

    if (input.actCode) {
      and.push({ actCode: input.actCode });
    }

    if (typeof input.active === 'boolean') {
      and.push({ active: input.active });
    }

    if (input.query) {
      and.push({
        OR: [
          {
            sectionCode: {
              contains: input.query,
              mode: 'insensitive',
            },
          },
          {
            description: {
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

  private buildLegalDocumentWhere(input: LegalDocumentListQuery): Prisma.LegalDocumentSourceWhereInput {
    const where: Prisma.LegalDocumentSourceWhereInput = {};
    const and: Prisma.LegalDocumentSourceWhereInput[] = [];

    if (input.actCode) {
      and.push({ actCode: input.actCode });
    }

    if (input.query) {
      and.push({
        OR: [
          {
            title: {
              contains: input.query,
              mode: 'insensitive',
            },
          },
          {
            sourceName: {
              contains: input.query,
              mode: 'insensitive',
            },
          },
          {
            jurisdictionPlace: {
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

  private buildIpcReferenceWhere(input: IpcReferenceListQuery): Prisma.IpcSectionReferenceWhereInput {
    const where: Prisma.IpcSectionReferenceWhereInput = {};
    const and: Prisma.IpcSectionReferenceWhereInput[] = [];

    if (input.actCode) {
      and.push({ actCode: input.actCode });
    }

    if (input.sectionCode) {
      and.push({ sectionCode: input.sectionCode });
    }

    if (input.query) {
      and.push({
        OR: [
          {
            rawSectionLabel: {
              contains: input.query,
              mode: 'insensitive',
            },
          },
          {
            descriptionText: {
              contains: input.query,
              mode: 'insensitive',
            },
          },
          {
            offenseText: {
              contains: input.query,
              mode: 'insensitive',
            },
          },
          {
            punishmentText: {
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
