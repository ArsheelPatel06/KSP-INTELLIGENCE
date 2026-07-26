import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '@core/exceptions/app-error';
import { ok } from '@core/response/api-response';
import type { GraphService } from '../services/graph.service';

export class GraphController {
  constructor(private readonly graphService: GraphService) {}

  getCaseGraph = async (req: Request, res: Response): Promise<Response> => {
    const caseMasterId = this.parseRequiredBigInt(req.params.caseId, 'caseId');
    const result = await this.graphService.getCaseGraph(caseMasterId, {
      depth: this.parseOptionalNumber(req.query.depth, 'depth'),
      includeEvidence: this.parseOptionalBoolean(req.query.includeEvidence),
      includeInferred: this.parseOptionalBoolean(req.query.includeInferred),
    });

    return ok(res, {
      item: result.data,
      warnings: result.warnings ?? [],
      meta: result.meta ?? null,
    });
  };

  expandNode = async (req: Request, res: Response): Promise<Response> => {
    const nodeId = this.parseRequiredBigInt(req.params.nodeId, 'nodeId');
    const relationshipType =
      typeof req.query.relationshipTypes === 'string'
        ? req.query.relationshipTypes.split(',')[0]?.trim()
        : undefined;
    const result = await this.graphService.expandNode(nodeId, {
      relationshipType: relationshipType || undefined,
      direction: 'both',
      minConfidenceScore: this.parseOptionalNumber(req.query.minConfidence, 'minConfidence'),
      limit: this.parseOptionalNumber(req.query.limit, 'limit'),
    });

    return ok(res, {
      item: result.data,
      warnings: result.warnings ?? [],
      meta: result.meta ?? null,
    });
  };

  findShortestPath = async (_req: Request, _res: Response): Promise<never> => {
    throw this.notImplemented('Graph shortest path');
  };

  runNetworkAnalysis = async (_req: Request, _res: Response): Promise<never> => {
    throw this.notImplemented('Graph network analysis');
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

  private parseOptionalBoolean(value: unknown): boolean | undefined {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  }

  private notImplemented(feature: string): AppError {
    return new AppError(`${feature} is planned for a later intelligence phase`, {
      statusCode: StatusCodes.NOT_IMPLEMENTED,
      code: 'ENDPOINT_NOT_IMPLEMENTED',
    });
  }
}
