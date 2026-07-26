import { z } from 'zod';

export const loginBodySchema = z.object({
  username: z.string().trim().min(3).max(255),
  password: z.string().min(8).max(128),
  deliveryMode: z.enum(['cookie', 'body']).default('cookie'),
});

export const refreshTokenBodySchema = z.object({
  refreshToken: z.string().min(1).optional(),
  deliveryMode: z.enum(['cookie', 'body']).default('cookie'),
});
