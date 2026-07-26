import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '@core/exceptions/app-error';
import { ok } from '@core/response/api-response';
import type { AnalyticsService } from '../services/analytics.service';

export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  listCrimeStatistics = async (req: Request, res: Response): Promise<Response> => {
    const input = {
      page: this.parseOptionalNumber(req.query.page, 'page'),
      pageSize: this.parseOptionalNumber(req.query.pageSize, 'pageSize'),
      reportYear: this.parseOptionalNumber(req.query.reportYear, 'reportYear'),
      reportMonth: this.parseOptionalNumber(req.query.reportMonth, 'reportMonth'),
      districtId: this.parseOptionalBigInt(req.query.districtId, 'districtId'),
      unitId: this.parseOptionalBigInt(req.query.unitId, 'unitId'),
      crimeHeadId: this.parseOptionalBigInt(req.query.crimeHeadId, 'crimeHeadId'),
      crimeSubHeadId: this.parseOptionalBigInt(req.query.crimeSubHeadId, 'crimeSubHeadId'),
      isProvisional: this.parseOptionalBoolean(req.query.isProvisional, 'isProvisional'),
    };

    const result = await this.analyticsService.listCrimeStatistics(input);

    return ok(res, {
      items: result.data,
      warnings: result.warnings ?? [],
      aggregate: typeof result.meta?.aggregate === 'object' ? result.meta.aggregate : null,
    }, this.extractPagination(result.meta));
  };

  getCrimeStatisticAggregate = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.analyticsService.getCrimeStatisticAggregate({
      reportYear: this.parseOptionalNumber(req.query.reportYear, 'reportYear'),
      reportMonth: this.parseOptionalNumber(req.query.reportMonth, 'reportMonth'),
      districtId: this.parseOptionalBigInt(req.query.districtId, 'districtId'),
      unitId: this.parseOptionalBigInt(req.query.unitId, 'unitId'),
      crimeHeadId: this.parseOptionalBigInt(req.query.crimeHeadId, 'crimeHeadId'),
      crimeSubHeadId: this.parseOptionalBigInt(req.query.crimeSubHeadId, 'crimeSubHeadId'),
      isProvisional: this.parseOptionalBoolean(req.query.isProvisional, 'isProvisional'),
    });

    return ok(res, {
      item: result.data,
      warnings: result.warnings ?? [],
    });
  };

  listCrimeReviewReports = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.analyticsService.listCrimeReviewReports({
      page: this.parseOptionalNumber(req.query.page, 'page'),
      pageSize: this.parseOptionalNumber(req.query.pageSize, 'pageSize'),
      reportYear: this.parseOptionalNumber(req.query.reportYear, 'reportYear'),
      reportMonth: this.parseOptionalNumber(req.query.reportMonth, 'reportMonth'),
      isProvisional: this.parseOptionalBoolean(req.query.isProvisional, 'isProvisional'),
      query: this.parseOptionalString(req.query.query),
    });

    return ok(res, {
      items: result.data,
      warnings: result.warnings ?? [],
    }, this.extractPagination(result.meta));
  };

  listVictimDemographics = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.analyticsService.listVictimDemographics({
      page: this.parseOptionalNumber(req.query.page, 'page'),
      pageSize: this.parseOptionalNumber(req.query.pageSize, 'pageSize'),
      statisticYear: this.parseOptionalNumber(req.query.statisticYear, 'statisticYear'),
      stateId: this.parseOptionalBigInt(req.query.stateId, 'stateId'),
      crimeContext: this.parseOptionalString(req.query.crimeContext),
      purposeLabel: this.parseOptionalString(req.query.purposeLabel),
      genderLabel: this.parseOptionalString(req.query.genderLabel),
      ageBandLabel: this.parseOptionalString(req.query.ageBandLabel),
    });

    return ok(res, {
      items: result.data,
      warnings: result.warnings ?? [],
    }, this.extractPagination(result.meta));
  };

  listCyberSuspectStatistics = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.analyticsService.listCyberSuspectStatistics({
      page: this.parseOptionalNumber(req.query.page, 'page'),
      pageSize: this.parseOptionalNumber(req.query.pageSize, 'pageSize'),
      statisticYear: this.parseOptionalNumber(req.query.statisticYear, 'statisticYear'),
      stateId: this.parseOptionalBigInt(req.query.stateId, 'stateId'),
      crimeHeadLabel: this.parseOptionalString(req.query.crimeHeadLabel),
      suspectCategory: this.parseOptionalString(req.query.suspectCategory),
    });

    return ok(res, {
      items: result.data,
      warnings: result.warnings ?? [],
    }, this.extractPagination(result.meta));
  };

  listHotspots = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.analyticsService.listHotspots({
      page: this.parseOptionalNumber(req.query.page, 'page'),
      pageSize: this.parseOptionalNumber(req.query.pageSize, 'pageSize'),
      districtId: this.parseOptionalBigInt(req.query.districtId, 'districtId'),
      unitId: this.parseOptionalBigInt(req.query.unitId, 'unitId'),
      crimeHeadId: this.parseOptionalBigInt(req.query.crimeHeadId, 'crimeHeadId'),
      crimeSubHeadId: this.parseOptionalBigInt(req.query.crimeSubHeadId, 'crimeSubHeadId'),
      riskLevel: this.parseOptionalString(req.query.riskLevel),
      trendDirection: this.parseOptionalString(req.query.trendDirection),
      minConfidenceScore: this.parseOptionalNumber(req.query.minConfidenceScore, 'minConfidenceScore'),
    });

    return ok(res, {
      items: result.data,
      warnings: result.warnings ?? [],
    }, this.extractPagination(result.meta));
  };

  listRiskScores = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.analyticsService.listRiskScores({
      page: this.parseOptionalNumber(req.query.page, 'page'),
      pageSize: this.parseOptionalNumber(req.query.pageSize, 'pageSize'),
      scoreSubjectType: this.parseOptionalString(req.query.scoreSubjectType),
      scoreType: this.parseOptionalString(req.query.scoreType),
      riskLevel: this.parseOptionalString(req.query.riskLevel),
      reviewStatus: this.parseOptionalString(req.query.reviewStatus),
      caseMasterId: this.parseOptionalBigInt(req.query.caseMasterId, 'caseMasterId'),
      accusedMasterId: this.parseOptionalBigInt(req.query.accusedMasterId, 'accusedMasterId'),
      victimMasterId: this.parseOptionalBigInt(req.query.victimMasterId, 'victimMasterId'),
      hotspotId: this.parseOptionalBigInt(req.query.hotspotId, 'hotspotId'),
    });

    return ok(res, {
      items: result.data,
      warnings: result.warnings ?? [],
    }, this.extractPagination(result.meta));
  };

  listRecommendations = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.analyticsService.listRecommendations({
      page: this.parseOptionalNumber(req.query.page, 'page'),
      pageSize: this.parseOptionalNumber(req.query.pageSize, 'pageSize'),
      recommendationType: this.parseOptionalString(req.query.recommendationType),
      status: this.parseOptionalString(req.query.status),
      priorityLevel: this.parseOptionalString(req.query.priorityLevel),
      caseMasterId: this.parseOptionalBigInt(req.query.caseMasterId, 'caseMasterId'),
      hotspotId: this.parseOptionalBigInt(req.query.hotspotId, 'hotspotId'),
      riskScoreId: this.parseOptionalBigInt(req.query.riskScoreId, 'riskScoreId'),
      minConfidenceScore: this.parseOptionalNumber(req.query.minConfidenceScore, 'minConfidenceScore'),
    });

    return ok(res, {
      items: result.data,
      warnings: result.warnings ?? [],
    }, this.extractPagination(result.meta));
  };

  listRepeatOffenderProfiles = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.analyticsService.listRepeatOffenderProfiles({
      page: this.parseOptionalNumber(req.query.page, 'page'),
      pageSize: this.parseOptionalNumber(req.query.pageSize, 'pageSize'),
      primaryDistrictId: this.parseOptionalBigInt(req.query.primaryDistrictId, 'primaryDistrictId'),
      riskLevel: this.parseOptionalString(req.query.riskLevel),
      profileStatus: this.parseOptionalString(req.query.profileStatus),
      query: this.parseOptionalString(req.query.query),
    });

    return ok(res, {
      items: result.data,
      warnings: result.warnings ?? [],
    }, this.extractPagination(result.meta));
  };

  private parseOptionalString(value: unknown): string | undefined {
    if (typeof value !== 'string') return undefined;
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : undefined;
  }

  private parseOptionalBigInt(value: unknown, field: string): bigint | undefined {
    if (typeof value !== 'string' || value.trim().length === 0) return undefined;

    try {
      return BigInt(value);
    } catch {
      throw new AppError(`${field} must be a valid integer`, {
        statusCode: StatusCodes.BAD_REQUEST,
        code: 'VALIDATION_ERROR',
        field,
      });
    }
  }

  private parseOptionalNumber(value: unknown, field: string): number | undefined {
    if (typeof value !== 'string' || value.trim().length === 0) return undefined;
    const parsed = Number(value);

    if (!Number.isFinite(parsed)) {
      throw new AppError(`${field} must be a valid number`, {
        statusCode: StatusCodes.BAD_REQUEST,
        code: 'VALIDATION_ERROR',
        field,
      });
    }

    return parsed;
  }

  private parseOptionalBoolean(value: unknown, field: string): boolean | undefined {
    if (typeof value !== 'string' || value.trim().length === 0) return undefined;
    if (value === 'true') return true;
    if (value === 'false') return false;

    throw new AppError(`${field} must be either true or false`, {
      statusCode: StatusCodes.BAD_REQUEST,
      code: 'VALIDATION_ERROR',
      field,
    });
  }

  private extractPagination(meta: Record<string, unknown> | undefined): unknown {
    if (!meta) return undefined;

    const page = meta.page;
    const pageSize = meta.pageSize;
    const totalRecords = meta.totalRecords;
    const totalPages = meta.totalPages;

    if (
      typeof page === 'number' &&
      typeof pageSize === 'number' &&
      typeof totalRecords === 'number' &&
      typeof totalPages === 'number'
    ) {
      return { page, pageSize, totalRecords, totalPages };
    }

    return undefined;
  }
}
