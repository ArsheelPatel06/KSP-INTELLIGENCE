import Redis from 'ioredis';
import { env } from '../../config/env';
import { logger } from '../logger/logger';

export const redis = new Redis(env.REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: 3,
});

redis.on('connect', () => logger.info('Redis connected'));
redis.on('error', (error) => logger.warn({ error }, 'Redis connection error'));
