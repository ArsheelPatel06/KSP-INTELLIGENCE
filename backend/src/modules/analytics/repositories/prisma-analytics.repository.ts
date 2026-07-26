import { Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '@core/database/prisma';
import { buildPaginationMeta, normalizePagination } from '@core/pagination/pagination';
import type { AnalyticsRepository } from '../interfaces/analytics-repository.interface';
import {
  crimeReviewReportSelect,
  crimeStatisticSelect,
  cyberSuspectStatisticSelect,
  hotspotDetailSelect,
  hotspotSelect,
  recommendationSelect,
  repeatOffenderProfileSelect,
  riskScoreSelect,
  victimDemographicSelect,
  type CrimeReviewReportListQuery,
  type CrimeStatisticAggregate,
  type CrimeStatisticListQuery,
  type CyberSuspectStatisticListQuery,
  type HotspotListQuery,
  type RecommendationListQuery,
  type RepeatOffenderProfileListQuery,
  type RiskScoreListQuery,
  type VictimDemographicListQuery,
} from '../types/analytics.types';

export class PrismaAnalyticsRepository implements AnalyticsRepository {
  constructor(private readonly client: PrismaClient = prisma) {}

  async listCrimeStatistics(input: CrimeStatisticListQuery) {
    const pagination = normalizePagination(input);
    const where = this.buildCrimeStatisticWhere(input);

    const [items, totalRecords] = await this.client.$transaction([
      this.client.crimeStatistic.findMany({
        where,
        select: crimeStatisticSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ reportYear: 'desc' }, { reportMonth: 'desc' }, { id: 'desc' }],
      }),
      this.client.crimeStatistic.count({ where }),
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

  async aggregateCrimeStatistics(input: CrimeStatisticListQuery): Promise<CrimeStatisticAggregate> {
    const where = this.buildCrimeStatisticWhere(input);
    const aggregate = await this.client.crimeStatistic.aggregate({
      where,
      _count: {
        _all: true,
      },
      _sum: {
        currentMonthCount: true,
        yearToDateCount: true,
        previousMonthCount: true,
        correspondingPreviousYearCount: true,
      },
    });

    return {
      totalRecords: aggregate._count._all,
      totalCurrentMonthCount: aggregate._sum.currentMonthCount,
      totalYearToDateCount: aggregate._sum.yearToDateCount,
      totalPreviousMonthCount: aggregate._sum.previousMonthCount,
      totalCorrespondingPreviousYearCount: aggregate._sum.correspondingPreviousYearCount,
    };
  }

  async listCrimeReviewReports(input: CrimeReviewReportListQuery) {
    const pagination = normalizePagination(input);
    const where = this.buildCrimeReviewReportWhere(input);

    const [items, totalRecords] = await this.client.$transaction([
      this.client.crimeReviewReport.findMany({
        where,
        select: crimeReviewReportSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ reportYear: 'desc' }, { reportMonth: 'desc' }, { id: 'desc' }],
      }),
      this.client.crimeReviewReport.count({ where }),
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

  async listVictimDemographics(input: VictimDemographicListQuery) {
    const pagination = normalizePagination(input);
    const where = this.buildVictimDemographicWhere(input);

    const [items, totalRecords] = await this.client.$transaction([
      this.client.victimDemographicStatistic.findMany({
        where,
        select: victimDemographicSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ statisticYear: 'desc' }, { id: 'desc' }],
      }),
      this.client.victimDemographicStatistic.count({ where }),
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

  async listCyberSuspectStatistics(input: CyberSuspectStatisticListQuery) {
    const pagination = normalizePagination(input);
    const where = this.buildCyberSuspectWhere(input);

    const [items, totalRecords] = await this.client.$transaction([
      this.client.cyberSuspectStatistic.findMany({
        where,
        select: cyberSuspectStatisticSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ statisticYear: 'desc' }, { id: 'desc' }],
      }),
      this.client.cyberSuspectStatistic.count({ where }),
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

  async listHotspots(input: HotspotListQuery) {
    const pagination = normalizePagination(input);
    const where = this.buildHotspotWhere(input);

    const [items, totalRecords] = await this.client.$transaction([
      this.client.hotspot.findMany({
        where,
        select: hotspotSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ generatedOn: 'desc' }, { id: 'desc' }],
      }),
      this.client.hotspot.count({ where }),
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

  async findHotspotById(hotspotId: bigint) {
    return this.client.hotspot.findUnique({
      where: { id: hotspotId },
      select: hotspotDetailSelect,
    });
  }

  async listRiskScores(input: RiskScoreListQuery) {
    const pagination = normalizePagination(input);
    const where = this.buildRiskScoreWhere(input);

    const [items, totalRecords] = await this.client.$transaction([
      this.client.riskScore.findMany({
        where,
        select: riskScoreSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ generatedOn: 'desc' }, { id: 'desc' }],
      }),
      this.client.riskScore.count({ where }),
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

  async listRecommendations(input: RecommendationListQuery) {
    const pagination = normalizePagination(input);
    const where = this.buildRecommendationWhere(input);

    const [items, totalRecords] = await this.client.$transaction([
      this.client.recommendation.findMany({
        where,
        select: recommendationSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ generatedOn: 'desc' }, { id: 'desc' }],
      }),
      this.client.recommendation.count({ where }),
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

  async findRecommendationById(recommendationId: bigint) {
    return this.client.recommendation.findUnique({
      where: { id: recommendationId },
      select: recommendationSelect,
    });
  }

  async listRepeatOffenderProfiles(input: RepeatOffenderProfileListQuery) {
    const pagination = normalizePagination(input);
    const where = this.buildRepeatOffenderWhere(input);

    const [items, totalRecords] = await this.client.$transaction([
      this.client.repeatOffenderProfile.findMany({
        where,
        select: repeatOffenderProfileSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ lastKnownCaseDate: 'desc' }, { id: 'desc' }],
      }),
      this.client.repeatOffenderProfile.count({ where }),
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

  private buildCrimeStatisticWhere(
    input: CrimeStatisticListQuery,
  ): Prisma.CrimeStatisticWhereInput {
    const where: Prisma.CrimeStatisticWhereInput = {};
    const and: Prisma.CrimeStatisticWhereInput[] = [];

    if (typeof input.reportYear === 'number') {
      and.push({ reportYear: input.reportYear });
    }

    if (typeof input.reportMonth === 'number') {
      and.push({ reportMonth: input.reportMonth });
    }

    if (input.districtId) {
      and.push({ districtId: input.districtId });
    }

    if (input.unitId) {
      and.push({ unitId: input.unitId });
    }

    if (input.crimeHeadId) {
      and.push({ crimeHeadId: input.crimeHeadId });
    }

    if (input.crimeSubHeadId) {
      and.push({ crimeSubHeadId: input.crimeSubHeadId });
    }

    if (typeof input.isProvisional === 'boolean') {
      and.push({ isProvisional: input.isProvisional });
    }

    if (and.length > 0) {
      where.AND = and;
    }

    return where;
  }

  private buildCrimeReviewReportWhere(
    input: CrimeReviewReportListQuery,
  ): Prisma.CrimeReviewReportWhereInput {
    const where: Prisma.CrimeReviewReportWhereInput = {};
    const and: Prisma.CrimeReviewReportWhereInput[] = [];

    if (typeof input.reportYear === 'number') {
      and.push({ reportYear: input.reportYear });
    }

    if (typeof input.reportMonth === 'number') {
      and.push({ reportMonth: input.reportMonth });
    }

    if (typeof input.isProvisional === 'boolean') {
      and.push({ isProvisional: input.isProvisional });
    }

    if (input.query) {
      and.push({
        OR: [
          {
            reportTitle: {
              contains: input.query,
              mode: 'insensitive',
            },
          },
          {
            summaryText: {
              contains: input.query,
              mode: 'insensitive',
            },
          },
          {
            publishedBy: {
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

  private buildVictimDemographicWhere(
    input: VictimDemographicListQuery,
  ): Prisma.VictimDemographicStatisticWhereInput {
    const where: Prisma.VictimDemographicStatisticWhereInput = {};
    const and: Prisma.VictimDemographicStatisticWhereInput[] = [];

    if (typeof input.statisticYear === 'number') {
      and.push({ statisticYear: input.statisticYear });
    }

    if (input.stateId) {
      and.push({ stateId: input.stateId });
    }

    if (input.crimeContext) {
      and.push({ crimeContext: input.crimeContext });
    }

    if (input.purposeLabel) {
      and.push({ purposeLabel: input.purposeLabel });
    }

    if (input.genderLabel) {
      and.push({ genderLabel: input.genderLabel });
    }

    if (input.ageBandLabel) {
      and.push({ ageBandLabel: input.ageBandLabel });
    }

    if (and.length > 0) {
      where.AND = and;
    }

    return where;
  }

  private buildCyberSuspectWhere(
    input: CyberSuspectStatisticListQuery,
  ): Prisma.CyberSuspectStatisticWhereInput {
    const where: Prisma.CyberSuspectStatisticWhereInput = {};
    const and: Prisma.CyberSuspectStatisticWhereInput[] = [];

    if (typeof input.statisticYear === 'number') {
      and.push({ statisticYear: input.statisticYear });
    }

    if (input.stateId) {
      and.push({ stateId: input.stateId });
    }

    if (input.crimeHeadLabel) {
      and.push({ crimeHeadLabel: input.crimeHeadLabel });
    }

    if (input.suspectCategory) {
      and.push({ suspectCategory: input.suspectCategory });
    }

    if (and.length > 0) {
      where.AND = and;
    }

    return where;
  }

  private buildHotspotWhere(input: HotspotListQuery): Prisma.HotspotWhereInput {
    const where: Prisma.HotspotWhereInput = {};
    const and: Prisma.HotspotWhereInput[] = [];

    if (input.districtId) {
      and.push({ districtId: input.districtId });
    }

    if (input.unitId) {
      and.push({ unitId: input.unitId });
    }

    if (input.crimeHeadId) {
      and.push({ crimeHeadId: input.crimeHeadId });
    }

    if (input.crimeSubHeadId) {
      and.push({ crimeSubHeadId: input.crimeSubHeadId });
    }

    if (input.riskLevel) {
      and.push({ riskLevel: input.riskLevel });
    }

    if (input.trendDirection) {
      and.push({ trendDirection: input.trendDirection });
    }

    if (typeof input.minConfidenceScore === 'number') {
      and.push({
        confidenceScore: {
          gte: input.minConfidenceScore,
        },
      });
    }

    if (and.length > 0) {
      where.AND = and;
    }

    return where;
  }

  private buildRiskScoreWhere(input: RiskScoreListQuery): Prisma.RiskScoreWhereInput {
    const where: Prisma.RiskScoreWhereInput = {};
    const and: Prisma.RiskScoreWhereInput[] = [];

    if (input.scoreSubjectType) {
      and.push({ scoreSubjectType: input.scoreSubjectType });
    }

    if (input.scoreType) {
      and.push({ scoreType: input.scoreType });
    }

    if (input.riskLevel) {
      and.push({ riskLevel: input.riskLevel });
    }

    if (input.reviewStatus) {
      and.push({ reviewStatus: input.reviewStatus });
    }

    if (input.caseMasterId) {
      and.push({ caseMasterId: input.caseMasterId });
    }

    if (input.accusedMasterId) {
      and.push({ accusedMasterId: input.accusedMasterId });
    }

    if (input.victimMasterId) {
      and.push({ victimMasterId: input.victimMasterId });
    }

    if (input.hotspotId) {
      and.push({ hotspotId: input.hotspotId });
    }

    if (and.length > 0) {
      where.AND = and;
    }

    return where;
  }

  private buildRecommendationWhere(
    input: RecommendationListQuery,
  ): Prisma.RecommendationWhereInput {
    const where: Prisma.RecommendationWhereInput = {};
    const and: Prisma.RecommendationWhereInput[] = [];

    if (input.recommendationType) {
      and.push({ recommendationType: input.recommendationType });
    }

    if (input.status) {
      and.push({ status: input.status });
    }

    if (input.priorityLevel) {
      and.push({ priorityLevel: input.priorityLevel });
    }

    if (input.caseMasterId) {
      and.push({ caseMasterId: input.caseMasterId });
    }

    if (input.hotspotId) {
      and.push({ hotspotId: input.hotspotId });
    }

    if (input.riskScoreId) {
      and.push({ riskScoreId: input.riskScoreId });
    }

    if (typeof input.minConfidenceScore === 'number') {
      and.push({
        confidenceScore: {
          gte: input.minConfidenceScore,
        },
      });
    }

    if (and.length > 0) {
      where.AND = and;
    }

    return where;
  }

  private buildRepeatOffenderWhere(
    input: RepeatOffenderProfileListQuery,
  ): Prisma.RepeatOffenderProfileWhereInput {
    const where: Prisma.RepeatOffenderProfileWhereInput = {};
    const and: Prisma.RepeatOffenderProfileWhereInput[] = [];

    if (input.primaryDistrictId) {
      and.push({ primaryDistrictId: input.primaryDistrictId });
    }

    if (input.riskLevel) {
      and.push({ riskLevel: input.riskLevel });
    }

    if (input.profileStatus) {
      and.push({ profileStatus: input.profileStatus });
    }

    if (input.query) {
      and.push({
        OR: [
          {
            profileNameHash: {
              contains: input.query,
              mode: 'insensitive',
            },
          },
          {
            knownAliasText: {
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
