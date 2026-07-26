import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../core/exceptions/app-error';
import { authService } from '../modules/auth/auth.container';

export async function authenticateMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authorization = req.header('authorization');
    if (!authorization?.startsWith('Bearer ')) {
      throw new AppError('Authentication required', {
        statusCode: 401,
        code: 'AUTHENTICATION_REQUIRED',
      });
    }

    req.user = await authService.authenticate(authorization.slice(7));
    next();
  } catch (error) {
    next(error);
  }
}
