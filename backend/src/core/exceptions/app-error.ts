import { StatusCodes } from 'http-status-codes';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly field?: string;
  public readonly isOperational: boolean;

  constructor(message: string, options?: { statusCode?: number; code?: string; field?: string }) {
    super(message);
    this.name = 'AppError';
    this.statusCode = options?.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;
    this.code = options?.code ?? 'INTERNAL_SERVER_ERROR';
    this.field = options?.field;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
