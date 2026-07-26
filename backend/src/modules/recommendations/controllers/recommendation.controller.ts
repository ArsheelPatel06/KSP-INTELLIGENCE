import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '@core/exceptions/app-error';
import { ok } from '@core/response/api-response';
import type { RecommendationService } from '../services/recommendation.service';

export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  listRecommendations = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.recommendationService.listRecommendations({
      page: this.parseOptionalNumber(req.query.page, 'page'),
      pageSize: this.parseOptionalNumber(req.query.pageSize, 'pageSize'),
      recommendationType: this.parseOptionalString(req.query.recommendationType ?? req.query.type),
      status: this.parseOptionalString(req.query.status),
      priorityLevel: this.parseOptionalString(req.query.priorityLevel),
      caseMasterId: this.parseOptionalBigInt(req.query.caseMasterId, 'caseMasterId'),
      hotspotId: this.parseOptionalBigInt(req.query.hotspotId, 'hotspotId'),
      riskScoreId: this.parseOptionalBigInt(req.query.riskScoreId, 'riskScoreId'),
      minConfidenceScore: this.parseOptionalNumber(req.query.minConfidenceScore, 'minConfidenceScore'),
    });

    return ok(res, { items: result.data, warnings: result.warnings ?? [] }, this.extractPagination(result.meta));
  };

  getRecommendationById = async (req: Request, res: Response): Promise<Response> => {
    const recommendationId = this.parseRequiredBigInt(req.params.recommendationId, 'recommendationId');
    const result = await this.recommendationService.getRecommendationById(recommendationId);
    return ok(res, { item: result.data, warnings: result.warnings ?? [] });
  };

  private parseOptionalString(value: unknown): string | undefined {
    if (typeof value !== 'string') return undefined;
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : undefined;
  }

  private parseRequiredBigInt(value: unknown, field: string): bigint {
    const parsed = this.parseOptionalBigInt(value, field);
    if (parsed == null) throw new AppError(`${field} is required`, { statusCode: StatusCodes.BAD_REQUEST, code: 'VALIDATION_ERROR', field });
    return parsed;
  }

  private parseOptionalBigInt(value: unknown, field: string): bigint | undefined {
    if (typeof value !== 'string' || value.trim().length === 0) return undefined;
    try {
      return BigInt(value);
    } catch {
      throw new AppError(`${field} must be a valid integer`, { statusCode: StatusCodes.BAD_REQUEST, code: 'VALIDATION_ERROR', field });
    }
  }

  private parseOptionalNumber(value: unknown, field: string): number | undefined {
    if (typeof value !== 'string' || value.trim().length === 0) return undefined;
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) throw new AppError(`${field} must be a valid number`, { statusCode: StatusCodes.BAD_REQUEST, code: 'VALIDATION_ERROR', field });
    return parsed;
  }

  private extractPagination(meta: Record<string, unknown> | undefined): unknown {
    if (!meta) return undefined;
    const { page, pageSize, totalRecords, totalPages } = meta;
    if (typeof page === 'number' && typeof pageSize === 'number' && typeof totalRecords === 'number' && typeof totalPages === 'number') {
      return { page, pageSize, totalRecords, totalPages };
    }
    return undefined;
  }
}
