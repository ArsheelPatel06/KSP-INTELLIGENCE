import type { NextFunction, Request, Response } from 'express';
import type { Permission } from '../core/auth/permissions';
import type { Role } from '../core/auth/roles';
import { AppError } from '../core/exceptions/app-error';

export function requireRoles(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', {
          statusCode: 403,
          code: 'ACCESS_DENIED',
        }),
      );
    }
    next();
  };
}

export function requirePermissions(...permissions: Permission[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const granted = req.user?.permissions ?? [];
    if (!req.user || !permissions.every((permission) => granted.includes(permission))) {
      return next(
        new AppError('You do not have permission to perform this action', {
          statusCode: 403,
          code: 'ACCESS_DENIED',
        }),
      );
    }
    next();
  };
}

export function requireAnyPermission(...permissions: Permission[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const granted = req.user?.permissions ?? [];
    if (!req.user || !permissions.some((permission) => granted.includes(permission))) {
      return next(
        new AppError('You do not have permission to perform this action', {
          statusCode: 403,
          code: 'ACCESS_DENIED',
        }),
      );
    }
    next();
  };
}
