import { Router } from 'express';
import { validate } from '../../../core/validation/validate';
import { asyncHandler } from '../../../core/response/async-handler';
import { authController } from '../auth.container';
import { loginBodySchema, refreshTokenBodySchema } from '../validators/auth.validators';

import { authenticateMiddleware } from '../../../middleware/authenticate.middleware';

export const authRouter = Router();

authRouter.post('/login', validate({ body: loginBodySchema }), asyncHandler(authController.login));
authRouter.post(
  '/refresh',
  validate({ body: refreshTokenBodySchema }),
  asyncHandler(authController.refresh),
);
authRouter.get('/me', authenticateMiddleware, asyncHandler(authController.me));
