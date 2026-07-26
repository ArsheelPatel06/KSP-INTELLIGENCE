import type { Express } from 'express';
import { Router } from 'express';
import { env } from '../config/env';
import { healthRouter } from './health.routes';
import { docsRouter } from './docs.routes';
import { authRouter } from '../modules/auth/routes/auth.routes';
import { casesRouter } from '../modules/cases/routes/cases.routes';
import { victimsRouter } from '../modules/victims/routes/victims.routes';
import { actsRouter, ipcRouter, legalRouter } from '../modules/legal/routes/legal.routes';
import { analyticsRouter } from '../modules/analytics/routes/analytics.routes';
import { dashboardRouter } from '../modules/dashboard/routes/dashboard.routes';
import { hotspotRouter } from '../modules/hotspot/routes/hotspot.routes';
import { recommendationsRouter } from '../modules/recommendations/routes/recommendations.routes';
import { graphRouter } from '../modules/graph/routes/graph.routes';
import { chatRouter } from '../modules/chat/routes/chat.routes';
import { aiRouter } from '../modules/ai/routes/ai.routes';

export function registerRoutes(app: Express): void {
  app.use('/health', healthRouter);
  app.use(`${env.API_PREFIX}/health`, healthRouter);
  app.use(`${env.API_PREFIX}/docs`, docsRouter);
  app.use(`${env.API_PREFIX}/auth`, authRouter);
  app.use(`${env.API_PREFIX}/cases`, casesRouter);
  app.use(`${env.API_PREFIX}/victims`, victimsRouter);
  app.use(`${env.API_PREFIX}/legal`, legalRouter);
  app.use(`${env.API_PREFIX}/acts`, actsRouter);
  app.use(`${env.API_PREFIX}/ipc`, ipcRouter);
  app.use(`${env.API_PREFIX}/analytics`, analyticsRouter);
  app.use(`${env.API_PREFIX}/dashboard`, dashboardRouter);
  app.use(`${env.API_PREFIX}/hotspots`, hotspotRouter);
  app.use(`${env.API_PREFIX}/recommendations`, recommendationsRouter);
  app.use(`${env.API_PREFIX}/graph`, graphRouter);
  app.use(`${env.API_PREFIX}/chat`, chatRouter);
  app.use(`${env.API_PREFIX}/copilot`, aiRouter);
}

export function createModuleRouter(): Router {
  return Router();
}
