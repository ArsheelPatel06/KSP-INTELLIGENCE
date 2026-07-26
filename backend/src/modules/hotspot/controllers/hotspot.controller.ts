import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '@core/exceptions/app-error';
import { ok } from '@core/response/api-response';
import type { HotspotService } from '../services/hotspot.service';

export class HotspotController {
  constructor(private readonly hotspotService: HotspotService) {}

  listHotspots = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.hotspotService.listHotspots({
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

    return ok(res, { items: result.data, warnings: result.warnings ?? [] }, this.extractPagination(result.meta));
  };

  getHotspotById = async (req: Request, res: Response): Promise<Response> => {
    const hotspotId = this.parseRequiredBigInt(req.params.hotspotId, 'hotspotId');
    const result = await this.hotspotService.getHotspotById(hotspotId);
    return ok(res, { item: result.data, warnings: result.warnings ?? [] });
  };

  generateRecommendation = async (req: Request, res: Response): Promise<Response> => {
    const hotspotId = this.parseRequiredBigInt(req.params.hotspotId, 'hotspotId');
    const result = await this.hotspotService.generateRecommendation(hotspotId, req.body as { recommendationType?: string; includeContributingCases?: boolean });
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
