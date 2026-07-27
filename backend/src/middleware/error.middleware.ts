import type { ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../core/exceptions/app-error';
import { logger } from '../core/logger/logger';
import { errorResponse } from '../core/response/api-response';

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    logger.warn({ error }, error.message);
    return errorResponse(res, error.statusCode, [
      {
        code: error.code,
        message: error.message,
        field: error.field,
      },
    ]);
  }

  console.error('[Unhandled Error]', error);
  logger.error({ error }, 'Unhandled application error');

  return errorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, [
    {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred.',
    },
  ]);
};
