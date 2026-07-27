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

export const signupBodySchema = z.object({
  kgid: z.string().trim().min(3).max(255),
  firstName: z.string().trim().min(1).max(255),
  lastName: z.string().trim().max(255).optional(),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  role: z.string().optional().default('Investigator'),
});

export const forgotPasswordBodySchema = z.object({
  email: z.string().email(),
});

export const resetPasswordBodySchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).max(128),
});
