import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '@core/exceptions/app-error';
import { ok } from '@core/response/api-response';
import type { VictimService } from '../services/victim.service';

export class VictimController {
  constructor(private readonly victimService: VictimService) {}

  listVictims = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.victimService.listVictims({
      page: this.parseOptionalNumber(req.query.page, 'page'),
      pageSize: this.parseOptionalNumber(req.query.pageSize, 'pageSize'),
      caseMasterId: this.parseOptionalBigInt(req.query.caseMasterId, 'caseMasterId'),
      genderId: this.parseOptionalBigInt(req.query.genderId, 'genderId'),
      victimPolice: this.parseOptionalBoolean(req.query.victimPolice, 'victimPolice'),
      districtId: this.parseOptionalBigInt(req.query.districtId, 'districtId'),
      minAge: this.parseOptionalNumber(req.query.minAge, 'minAge'),
      maxAge: this.parseOptionalNumber(req.query.maxAge, 'maxAge'),
      query: this.parseOptionalString(req.query.query),
    });

    return ok(res, {
      items: result.data,
      warnings: result.warnings ?? [],
    }, this.extractPagination(result.meta));
  };

  getVictimById = async (req: Request, res: Response): Promise<Response> => {
    const victimId = this.parseRequiredBigInt(req.params.victimId, 'victimId');
    const result = await this.victimService.getVictimById(victimId);

    return ok(res, {
      item: result.data,
      warnings: result.warnings ?? [],
    });
  };

  listVictimsByCaseId = async (req: Request, res: Response): Promise<Response> => {
    const caseMasterId = this.parseRequiredBigInt(req.params.caseId, 'caseId');
    const result = await this.victimService.listVictimsByCase(caseMasterId, {
      page: this.parseOptionalNumber(req.query.page, 'page'),
      pageSize: this.parseOptionalNumber(req.query.pageSize, 'pageSize'),
      genderId: this.parseOptionalBigInt(req.query.genderId, 'genderId'),
      victimPolice: this.parseOptionalBoolean(req.query.victimPolice, 'victimPolice'),
      districtId: this.parseOptionalBigInt(req.query.districtId, 'districtId'),
      minAge: this.parseOptionalNumber(req.query.minAge, 'minAge'),
      maxAge: this.parseOptionalNumber(req.query.maxAge, 'maxAge'),
      query: this.parseOptionalString(req.query.query),
    });

    return ok(res, {
      items: result.data,
      warnings: result.warnings ?? [],
      meta: result.meta ?? null,
    }, this.extractPagination(result.meta));
  };

  getVictimRiskScores = async (req: Request, res: Response): Promise<Response> => {
    const victimId = this.parseRequiredBigInt(req.params.victimId, 'victimId');
    const limit = this.parseOptionalNumber(req.query.limit, 'limit') ?? 10;
    const result = await this.victimService.getVictimRiskScores(victimId, limit);

    return ok(res, {
      items: result.data,
      warnings: result.warnings ?? [],
      meta: result.meta ?? null,
    });
  };

  private parseOptionalString(value: unknown): string | undefined {
    if (typeof value !== 'string') return undefined;
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : undefined;
  }

  private parseRequiredBigInt(value: unknown, field: string): bigint {
    const parsed = this.parseOptionalBigInt(value, field);
    if (parsed == null) {
      throw new AppError(`${field} is required`, {
        statusCode: StatusCodes.BAD_REQUEST,
        code: 'VALIDATION_ERROR',
        field,
      });
    }

    return parsed;
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
