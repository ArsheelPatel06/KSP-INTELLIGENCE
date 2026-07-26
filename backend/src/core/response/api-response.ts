import type { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export interface ApiErrorDetail {
  code: string;
  message: string;
  field?: string;
}

export interface ApiMeta {
  requestId?: string;
  timestamp: string;
  source: 'ksp-intelligence-os';
  pagination?: unknown;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  meta: ApiMeta;
  errors: ApiErrorDetail[];
}

function buildMeta(res: Response, pagination?: unknown): ApiMeta {
  return {
    requestId: res.req.id ? String(res.req.id) : undefined,
    timestamp: new Date().toISOString(),
    source: 'ksp-intelligence-os',
    ...(pagination ? { pagination } : {}),
  };
}

export function ok<T>(res: Response, data: T, pagination?: unknown): Response<ApiResponse<T>> {
  return res.status(StatusCodes.OK).json({
    success: true,
    data,
    meta: buildMeta(res, pagination),
    errors: [],
  });
}

export function created<T>(res: Response, data: T): Response<ApiResponse<T>> {
  return res.status(StatusCodes.CREATED).json({
    success: true,
    data,
    meta: buildMeta(res),
    errors: [],
  });
}

export function errorResponse(
  res: Response,
  statusCode: number,
  errors: ApiErrorDetail[],
): Response<ApiResponse<null>> {
  return res.status(statusCode).json({
    success: false,
    data: null,
    meta: buildMeta(res),
    errors,
  });
}
