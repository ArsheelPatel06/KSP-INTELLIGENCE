import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '@core/exceptions/app-error';
import { ok } from '@core/response/api-response';
import type { DashboardService } from '../services/dashboard.service';

export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  getOverview = async (_req: Request, res: Response): Promise<Response> => {
    const result = await this.dashboardService.getOverview();

    return ok(res, {
      item: result.data,
      warnings: result.warnings ?? [],
      meta: result.meta ?? null,
    });
  };

  getOfficerDashboard = async (req: Request, res: Response): Promise<Response> => {
    const employeeId = this.parseRequiredBigInt(req.params.employeeId, 'employeeId');
    const result = await this.dashboardService.getOfficerDashboard(employeeId);

    return ok(res, {
      item: result.data,
      warnings: result.warnings ?? [],
      meta: result.meta ?? null,
    });
  };

  private parseRequiredBigInt(value: unknown, field: string): bigint {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new AppError(`${field} is required`, {
        statusCode: StatusCodes.BAD_REQUEST,
        code: 'VALIDATION_ERROR',
        field,
      });
    }

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
}
