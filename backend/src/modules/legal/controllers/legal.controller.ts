import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '@core/exceptions/app-error';
import { ok } from '@core/response/api-response';
import type { LegalService } from '../services/legal.service';

export class LegalController {
  constructor(private readonly legalService: LegalService) {}

  getActByCode = async (req: Request, res: Response): Promise<Response> => {
    const actCode = this.parseRequiredString(req.params.actCode, 'actCode');
    const result = await this.legalService.getActByCode(actCode);

    return ok(res, {
      item: result.data,
      warnings: result.warnings ?? [],
    });
  };

  listActs = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.legalService.listActs({
      page: this.parseOptionalNumber(req.query.page, 'page'),
      pageSize: this.parseOptionalNumber(req.query.pageSize, 'pageSize'),
      active: this.parseOptionalBoolean(req.query.active, 'active'),
      query: this.parseOptionalString(req.query.query),
    });

    return ok(res, {
      items: result.data,
      warnings: result.warnings ?? [],
    }, this.extractPagination(result.meta));
  };

  getSection = async (req: Request, res: Response): Promise<Response> => {
    const actCode = this.parseRequiredString(req.params.actCode, 'actCode');
    const sectionCode = this.parseRequiredString(req.params.sectionCode, 'sectionCode');
    const result = await this.legalService.getSection(actCode, sectionCode);

    return ok(res, {
      item: result.data,
      warnings: result.warnings ?? [],
    });
  };

  listSections = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.legalService.listSections({
      page: this.parseOptionalNumber(req.query.page, 'page'),
      pageSize: this.parseOptionalNumber(req.query.pageSize, 'pageSize'),
      actCode: this.parseOptionalString(req.query.actCode),
      active: this.parseOptionalBoolean(req.query.active, 'active'),
      query: this.parseOptionalString(req.query.query),
    });

    return ok(res, {
      items: result.data,
      warnings: result.warnings ?? [],
    }, this.extractPagination(result.meta));
  };

  listSectionsByCrimeHead = async (req: Request, res: Response): Promise<Response> => {
    const crimeHeadId = this.parseRequiredBigInt(req.params.crimeHeadId, 'crimeHeadId');
    const result = await this.legalService.listSectionsByCrimeHead(crimeHeadId);

    return ok(res, {
      items: result.data,
      warnings: result.warnings ?? [],
      meta: result.meta ?? null,
    });
  };

  listLegalDocuments = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.legalService.listLegalDocuments({
      page: this.parseOptionalNumber(req.query.page, 'page'),
      pageSize: this.parseOptionalNumber(req.query.pageSize, 'pageSize'),
      actCode: this.parseOptionalString(req.query.actCode),
      query: this.parseOptionalString(req.query.query),
    });

    return ok(res, {
      items: result.data,
      warnings: result.warnings ?? [],
    }, this.extractPagination(result.meta));
  };

  listIpcReferences = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.legalService.listIpcReferences({
      page: this.parseOptionalNumber(req.query.page, 'page'),
      pageSize: this.parseOptionalNumber(req.query.pageSize, 'pageSize'),
      actCode: this.parseOptionalString(req.query.actCode),
      sectionCode: this.parseOptionalString(req.query.sectionCode),
      query: this.parseOptionalString(req.query.query),
    });

    return ok(res, {
      items: result.data,
      warnings: result.warnings ?? [],
    }, this.extractPagination(result.meta));
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
