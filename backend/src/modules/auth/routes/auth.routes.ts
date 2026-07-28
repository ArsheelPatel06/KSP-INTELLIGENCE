import { Router } from 'express';
import { validate } from '../../../core/validation/validate';
import { asyncHandler } from '../../../core/response/async-handler';
import { authController } from '../auth.container';
import { loginBodySchema, refreshTokenBodySchema, signupBodySchema, forgotPasswordBodySchema, resetPasswordBodySchema } from '../validators/auth.validators';

import { authenticateMiddleware } from '../../../middleware/authenticate.middleware';

export const authRouter = Router();

authRouter.post('/signup', validate({ body: signupBodySchema }), asyncHandler(authController.signup));
authRouter.post('/forgot-password', validate({ body: forgotPasswordBodySchema }), asyncHandler(authController.forgotPassword));
authRouter.post('/reset-password', validate({ body: resetPasswordBodySchema }), asyncHandler(authController.resetPassword));
authRouter.post('/catalyst-token', authenticateMiddleware, asyncHandler(authController.catalystToken));

authRouter.post('/login', validate({ body: loginBodySchema }), asyncHandler(authController.login));
authRouter.post(
  '/refresh',
  validate({ body: refreshTokenBodySchema }),
  asyncHandler(authController.refresh),
);
authRouter.get('/me', authenticateMiddleware, asyncHandler(authController.me));
authRouter.post('/logout', asyncHandler(authController.logout));
