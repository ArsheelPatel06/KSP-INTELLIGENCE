export type AiErrorCode =
  | 'AI_CONFIGURATION_ERROR'
  | 'AI_RATE_LIMITED'
  | 'AI_PROVIDER_UNAVAILABLE'
  | 'AI_PROVIDER_TIMEOUT'
  | 'AI_AUDIT_FAILURE'
  | 'AI_CACHE_FAILURE'
  | 'AI_PROMPT_NOT_FOUND'
  | 'AI_WORKFLOW_VALIDATION_ERROR'
  | 'AI_PERMISSION_DENIED';

/**
 * AI-specific operational error.
 *
 * This error type is meant for failures inside the AI foundation layer.
 * It does not replace HTTP-level errors. Instead, higher layers may map this
 * error into API-safe responses or audit records as appropriate.
 */
export class AiError extends Error {
  constructor(
    message: string,
    public readonly code: AiErrorCode,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'AiError';
    Error.captureStackTrace(this, this.constructor);
  }
}
