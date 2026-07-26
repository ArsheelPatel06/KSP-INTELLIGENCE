export interface AiRateLimitDescriptor {
  key: string;
  limit: number;
  windowMs: number;
}

export interface AiRateLimitDecision {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

/**
 * AI-specific rate limiter contract.
 *
 * This is intentionally separated from global HTTP rate limiting because AI
 * workloads often need tighter controls based on user, case, session, or
 * provider cost profile.
 */
export interface AiRateLimiter {
  evaluate(descriptor: AiRateLimitDescriptor): Promise<AiRateLimitDecision>;
}
