import type { CookieOptions, Response } from 'express';
import { env } from '../../../config/env';

function durationToMilliseconds(value: string): number {
  const match = /^(\d+)(s|m|h|d)$/.exec(value);
  if (!match) return 7 * 86_400_000;
  const amount = Number(match[1]);
  const multiplier = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[match[2] as 's'];
  return amount * multiplier;
}

export function refreshCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.AUTH_COOKIE_SECURE,
    sameSite: env.AUTH_COOKIE_SAME_SITE,
    domain: env.AUTH_COOKIE_DOMAIN || undefined,
    path: '/api/v1/auth',
    maxAge: durationToMilliseconds(env.JWT_REFRESH_EXPIRES_IN),
  };
}

export function setRefreshCookie(res: Response, refreshToken: string): void {
  res.cookie(env.AUTH_COOKIE_NAME, refreshToken, refreshCookieOptions());
}

export function clearRefreshCookie(res: Response): void {
  res.clearCookie(env.AUTH_COOKIE_NAME, refreshCookieOptions());
}
