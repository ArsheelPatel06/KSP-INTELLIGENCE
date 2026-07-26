import { AppError } from '../../core/exceptions/app-error';

/**
 * Base error for all AI-related failures.
 * Maps to HTTP 500 or 502 depending on the underlying cause.
 */
export class AiProviderError extends AppError {
  public readonly details?: Record<string, unknown>;

  constructor(message: string, details?: Record<string, unknown>) {
    super(message, {
      statusCode: 502,
      code: 'AI_PROVIDER_ERROR',
    });
    this.details = details;
  }
}

/**
 * Thrown when the Ollama server is unreachable or requests time out.
 */
export class AiTimeoutError extends AiProviderError {
  public readonly isRetryable: boolean;
  
  constructor(message: string = 'AI provider request timed out', details?: Record<string, unknown>) {
    super(message, details);
    this.isRetryable = true;
  }
}

/**
 * Thrown when the AI output cannot be parsed into the required structured JSON contract.
 */
export class AiParsingError extends AppError {
  public readonly rawOutput?: string;
  public readonly details?: Record<string, unknown>;

  constructor(message: string, rawOutput?: string, details?: Record<string, unknown>) {
    super(message, {
      statusCode: 422,
      code: 'AI_PARSING_ERROR',
    });
    this.rawOutput = rawOutput;
    this.details = details;
  }
}

/**
 * Thrown when an AI generation is stopped due to context length limits.
 */
export class AiContextLengthError extends AiProviderError {
  public readonly isRetryable: boolean;
  
  constructor(message: string = 'Maximum context length exceeded') {
    super(message);
    this.isRetryable = false;
  }
}
