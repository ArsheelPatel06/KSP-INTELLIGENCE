import { createServer } from 'node:http';
import { createApp } from './app/create-app';
import { env } from './config/env';
import { redis } from './core/cache/redis';
import { prisma } from './core/database/prisma';
import { logger } from './core/logger/logger';

async function bootstrap(): Promise<void> {
  const app = createApp();
  const server = createServer(app);

  server.listen(env.PORT, () => {
    logger.info({ port: env.PORT, env: env.NODE_ENV }, 'KSP Intelligence OS backend started');
  });

  const shutdown = async (signal: string): Promise<void> => {
    logger.info({ signal }, 'Shutdown signal received');

    server.close(async () => {
      logger.info('HTTP server closed');
      await prisma.$disconnect();
      redis.disconnect();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
}

void bootstrap().catch((error) => {
  logger.fatal({ error }, 'Failed to start backend');
  process.exit(1);
});
