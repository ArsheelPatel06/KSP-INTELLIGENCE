import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import path from 'node:path';
import { env } from '../config/env';
import { logger } from '../core/logger/logger';
import { errorMiddleware } from '../middleware/error.middleware';
import { notFoundMiddleware } from '../middleware/not-found.middleware';
import { requestIdMiddleware } from '../middleware/request-id.middleware';
import { rateLimitMiddleware } from '../middleware/rate-limit.middleware';
import { registerRoutes } from './routes';

export function createApp(): Express {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use(requestIdMiddleware);
  app.use(
    pinoHttp({
      logger,
      customProps: (req) => ({ requestId: req.id }),
    }),
  );
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    }),
  );
  app.use(compression());
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));
  app.use(cookieParser());
  app.use(rateLimitMiddleware);

  registerRoutes(app);

  // Serve frontend static files in production
  if (env.NODE_ENV === 'production') {
    const fs = require('node:fs');
    let frontendDist = path.join(process.cwd(), 'frontend', 'dist');
    if (!fs.existsSync(frontendDist)) {
      frontendDist = path.join(process.cwd(), '..', 'frontend', 'dist');
    }

    console.log('Frontend path:', frontendDist);
    console.log('Exists:', fs.existsSync(frontendDist));

    if (fs.existsSync(frontendDist)) {
      app.use(express.static(frontendDist));

      app.get('*', (req, res, next) => {
        if (req.path.startsWith(env.API_PREFIX)) {
          return next();
        }
        res.sendFile(path.join(frontendDist, 'index.html'));
      });
    } else {
      console.warn('Frontend build not found:', frontendDist);
    }
  }

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}
