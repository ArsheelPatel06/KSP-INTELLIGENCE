import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  API_PREFIX: z.string().default('/api/v1'),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1).default('redis://localhost:6379'),
  JWT_ACCESS_SECRET: z.string().min(16).default('development-access-secret-change-me'),
  JWT_REFRESH_SECRET: z.string().min(16).default('development-refresh-secret-change-me'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(10).max(15).default(12),
  AUTH_COOKIE_NAME: z.string().default('ksp_refresh_token'),
  AUTH_COOKIE_SECURE: z.enum(['true', 'false']).default('false'),
  AUTH_COOKIE_SAME_SITE: z.enum(['strict', 'lax', 'none']).default('strict'),
  AUTH_COOKIE_DOMAIN: z.string().optional(),
  CORS_ORIGIN: z.string().default('http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:5173,https://ksp-intelligence.onslate.com'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(300),
  LOG_LEVEL: z.string().default('info'),
  AI_PROVIDER: z.enum(['ollama', 'groq', 'mock']).default('groq'),
  OLLAMA_BASE_URL: z.string().url().default('http://localhost:11434'),
  OLLAMA_MODEL_DEFAULT: z.string().min(1).default('sentinel-ai-8b'),
  GROQ_API_KEY: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment configuration', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = {
  ...parsed.data,
  CORS_ORIGIN: parsed.data.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
  AUTH_COOKIE_SECURE: parsed.data.AUTH_COOKIE_SECURE === 'true',
} as const;

export type Env = typeof env;
