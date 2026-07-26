import { Router } from 'express';
import { ok } from '@core/response/api-response';

export const docsRouter = Router();

docsRouter.get('/', (_req, res) =>
  ok(res, {
    title: 'KSP Intelligence OS API',
    version: 'v1',
    status: 'placeholder',
    message: 'OpenAPI/Swagger generation is planned; route groups are mounted and ready for documentation binding.',
  }),
);
