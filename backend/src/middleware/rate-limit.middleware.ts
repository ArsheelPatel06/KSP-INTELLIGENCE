import rateLimit from 'express-rate-limit';
import { env } from '../config/env';
import { errorResponse } from '../core/response/api-response';

export const rateLimitMiddleware = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    return errorResponse(res, 429, [
      {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please try again later.',
      },
    ]);
  },
});
