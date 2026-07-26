import { Router } from 'express';
import { env } from '../config/env';
import { asyncHandler } from '../core/response/async-handler';
import { ok } from '../core/response/api-response';

export const healthRouter = Router();

healthRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    return ok(res, {
      service: 'ksp-intelligence-os-backend',
      status: 'healthy',
      environment: env.NODE_ENV,
      uptimeSeconds: Math.round(process.uptime()),
    });
  }),
);
