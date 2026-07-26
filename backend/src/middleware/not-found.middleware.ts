import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../core/exceptions/app-error';

export function notFoundMiddleware(req: Request, _res: Response, next: NextFunction): void {
  next(
    new AppError(`Route not found: ${req.method} ${req.originalUrl}`, {
      statusCode: 404,
      code: 'ROUTE_NOT_FOUND',
    }),
  );
}
