import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';
import { AppError } from '../exceptions/app-error';

export interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export function validate(schemas: ValidationSchemas) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const targets = [
      { key: 'body', schema: schemas.body, value: req.body },
      { key: 'query', schema: schemas.query, value: req.query },
      { key: 'params', schema: schemas.params, value: req.params },
    ] as const;

    for (const target of targets) {
      if (!target.schema) continue;
      const result = target.schema.safeParse(target.value);
      if (!result.success) {
        const firstIssue = result.error.issues[0];
        return next(
          new AppError(firstIssue?.message ?? 'Validation failed', {
            statusCode: 400,
            code: 'VALIDATION_ERROR',
            field: firstIssue?.path.join('.'),
          }),
        );
      }
      req[target.key] = result.data;
    }

    next();
  };
}
