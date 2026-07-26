import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../core/exceptions/app-error';

export function notImplemented(feature: string) {
  return (_req: Request, _res: Response, next: NextFunction): void => {
    next(
      new AppError(`${feature} is not implemented yet`, {
        statusCode: StatusCodes.NOT_IMPLEMENTED,
        code: 'ENDPOINT_NOT_IMPLEMENTED',
      }),
    );
  };
}
