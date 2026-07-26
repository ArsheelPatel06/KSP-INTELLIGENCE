import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '@core/exceptions/app-error';
import { ok } from '@core/response/api-response';
import type { ChatService } from '../services/chat.service';

export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  createSession = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.chatService.createSession({
      employeeId: req.user?.employeeId ? BigInt(req.user.employeeId) : undefined,
      caseMasterId: this.parseOptionalBigInt(req.body.caseMasterId, 'caseMasterId'),
      sessionPurpose: this.parseRequiredString(req.body.sessionPurpose, 'sessionPurpose'),
      securityClassification: this.parseOptionalString(req.body.securityClassification),
      modelVersion: 'phase-7.5-composed-response',
    });

    return ok(res, { item: result.data, warnings: result.warnings ?? [] });
  };

  sendMessage = async (req: Request, res: Response): Promise<Response> => {
    const chatSessionId = this.parseRequiredBigInt(req.params.chatSessionId, 'chatSessionId');
    const result = await this.chatService.sendMessage(chatSessionId, {
      messageText: this.parseRequiredString(req.body.messageText, 'messageText'),
      includeEvidence: this.parseOptionalBoolean(req.body.includeEvidence),
      includeGraph: this.parseOptionalBoolean(req.body.includeGraph),
      includeLegal: this.parseOptionalBoolean(req.body.includeLegal),
      includeAnalytics: this.parseOptionalBoolean(req.body.includeAnalytics),
    });

    return ok(res, { item: result.data, warnings: result.warnings ?? [] });
  };

  listSessions = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.chatService.listSessions({
      page: this.parseOptionalNumber(req.query.page, 'page'),
      pageSize: this.parseOptionalNumber(req.query.pageSize, 'pageSize'),
      caseMasterId: this.parseOptionalBigInt(req.query.caseMasterId, 'caseMasterId'),
      employeeId: this.parseOptionalBigInt(req.query.employeeId, 'employeeId'),
      fromDate: this.parseOptionalDate(req.query.fromDate, 'fromDate'),
      toDate: this.parseOptionalDate(req.query.toDate, 'toDate'),
    });

    return ok(
      res,
      { items: result.data, warnings: result.warnings ?? [] },
      this.extractPagination(result.meta),
    );
  };

  getSessionMessages = async (req: Request, res: Response): Promise<Response> => {
    const chatSessionId = this.parseRequiredBigInt(req.params.chatSessionId, 'chatSessionId');
    const result = await this.chatService.getSessionMessages(chatSessionId);

    return ok(res, { item: result.data, warnings: result.warnings ?? [] });
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
    if (parsed == null)
      throw new AppError(`${field} is required`, {
        statusCode: StatusCodes.BAD_REQUEST,
        code: 'VALIDATION_ERROR',
        field,
      });
    return parsed;
  }

  private parseOptionalBigInt(value: unknown, field: string): bigint | undefined {
    if (typeof value === 'number') return BigInt(value);
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

  private parseOptionalBoolean(value: unknown): boolean | undefined {
    return typeof value === 'boolean' ? value : undefined;
  }

  private parseOptionalNumber(value: unknown, field: string): number | undefined {
    if (typeof value !== 'string' || value.trim().length === 0) return undefined;
    const parsed = Number(value);
    if (!Number.isFinite(parsed))
      throw new AppError(`${field} must be a valid number`, {
        statusCode: StatusCodes.BAD_REQUEST,
        code: 'VALIDATION_ERROR',
        field,
      });
    return parsed;
  }

  private parseOptionalDate(value: unknown, field: string): Date | undefined {
    if (typeof value !== 'string' || value.trim().length === 0) return undefined;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime()))
      throw new AppError(`${field} must be a valid date`, {
        statusCode: StatusCodes.BAD_REQUEST,
        code: 'VALIDATION_ERROR',
        field,
      });
    return parsed;
  }

  private extractPagination(meta: Record<string, unknown> | undefined): unknown {
    if (!meta) return undefined;
    const { page, pageSize, totalRecords, totalPages } = meta;
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
