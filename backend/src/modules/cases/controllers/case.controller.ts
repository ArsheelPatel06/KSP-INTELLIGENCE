import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '@core/exceptions/app-error';
import { ok } from '@core/response/api-response';
import type { CaseService } from '../services/case.service';

export class CaseController {
  constructor(private readonly caseService: CaseService) {}

  listCases = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.caseService.listCases({
      page: this.parseOptionalNumber(req.query.page, 'page'),
      pageSize: this.parseOptionalNumber(req.query.pageSize, 'pageSize'),
      crimeNo: this.parseOptionalString(req.query.crimeNo),
      caseNo: this.parseOptionalString(req.query.caseNo),
      policeStationId: this.parseOptionalBigInt(req.query.policeStationId, 'policeStationId'),
      policePersonId: this.parseOptionalBigInt(req.query.policePersonId, 'policePersonId'),
      caseStatusId: this.parseOptionalBigInt(req.query.caseStatusId, 'caseStatusId'),
      crimeMajorHeadId: this.parseOptionalBigInt(req.query.crimeMajorHeadId, 'crimeMajorHeadId'),
      crimeMinorHeadId: this.parseOptionalBigInt(req.query.crimeMinorHeadId, 'crimeMinorHeadId'),
      districtId: this.parseOptionalBigInt(req.query.districtId, 'districtId'),
      fromCrimeRegisteredDate: this.parseOptionalDate(req.query.fromCrimeRegisteredDate, 'fromCrimeRegisteredDate'),
      toCrimeRegisteredDate: this.parseOptionalDate(req.query.toCrimeRegisteredDate, 'toCrimeRegisteredDate'),
      query: this.parseOptionalString(req.query.query),
    });

    return ok(res, {
      items: result.data,
      warnings: result.warnings ?? [],
    }, this.extractPagination(result.meta));
  };

  getCaseById = async (req: Request, res: Response): Promise<Response> => {
    const caseMasterId = this.parseRequiredBigInt(req.params.caseId, 'caseId');
    const result = await this.caseService.getCaseById(caseMasterId);

    return ok(res, {
      item: result.data,
      warnings: result.warnings ?? [],
    });
  };

  getCaseByCrimeNo = async (req: Request, res: Response): Promise<Response> => {
    const crimeNo = this.parseRequiredString(req.params.crimeNo, 'crimeNo');
    const result = await this.caseService.getCaseByCrimeNo(crimeNo);

    return ok(res, {
      item: result.data,
      warnings: result.warnings ?? [],
    });
  };

  getCaseByCaseNo = async (req: Request, res: Response): Promise<Response> => {
    const caseNo = this.parseRequiredString(req.params.caseNo, 'caseNo');
    const result = await this.caseService.getCaseByCaseNo(caseNo);

    return ok(res, {
      item: result.data,
      warnings: result.warnings ?? [],
    });
  };

  getSimilarCases = async (req: Request, res: Response): Promise<Response> => {
    const caseMasterId = this.parseRequiredBigInt(req.params.caseId, 'caseId');
    const limit = this.parseOptionalNumber(req.query.limit, 'limit') ?? 10;
    const result = await this.caseService.getSimilarCases(caseMasterId, limit);

    return ok(res, {
      items: result.data,
      warnings: result.warnings ?? [],
      meta: result.meta ?? null,
    });
  };

  private parseRequiredString(value: unknown, field: string): string {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new AppError(`${field} is required`, {
        statusCode: StatusCodes.BAD_REQUEST,
        code: 'VALIDATION_ERROR',
        field,
      });
    }

    return value.trim();
  }

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

  private parseOptionalDate(value: unknown, field: string): Date | undefined {
    if (typeof value !== 'string' || value.trim().length === 0) return undefined;
    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      throw new AppError(`${field} must be a valid ISO date`, {
        statusCode: StatusCodes.BAD_REQUEST,
        code: 'VALIDATION_ERROR',
        field,
      });
    }

    return parsed;
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
