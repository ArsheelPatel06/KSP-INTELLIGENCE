import { z } from 'zod';
import { env } from '../../config/env';

export const aiConfigSchema = z.object({
  provider: z.enum(['ollama', 'groq', 'mock']),
  ollama: z.object({
    baseUrl: z.string().url(),
    defaultModel: z.string().min(1),
    timeoutMs: z.number().int().positive().default(60000), // 60 seconds
    maxRetries: z.number().int().min(0).default(3),
  }),
  groq: z.object({
    apiKey: z.string().optional(),
    defaultModel: z.string().default('llama-3.3-70b-versatile'),
    maxRetries: z.number().int().min(0).default(3),
  }),
  generation: z.object({
    defaultTemperature: z.number().min(0).max(2).default(0.1), // Very low for police data precision
    defaultTopP: z.number().min(0).max(1).default(0.9),
    maxOutputTokens: z.number().int().positive().default(2048),
  }),
});

export type AiConfig = z.infer<typeof aiConfigSchema>;

export const aiConfig: AiConfig = aiConfigSchema.parse({
  provider: env.AI_PROVIDER,
  ollama: {
    baseUrl: env.OLLAMA_BASE_URL,
    defaultModel: env.OLLAMA_MODEL_DEFAULT,
    timeoutMs: 60000,
    maxRetries: 3,
  },
  groq: {
    apiKey: env.GROQ_API_KEY,
    defaultModel: 'llama-3.3-70b-versatile',
    maxRetries: 3,
  },
  generation: {
    defaultTemperature: 0.1,
    defaultTopP: 0.9,
    maxOutputTokens: 2048,
  },
});
