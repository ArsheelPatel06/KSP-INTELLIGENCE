import { logger } from '../../core/logger/logger';
import type { AiRequestContext } from './ai-request.types';
import type { AiProviderUsage } from '../providers/ai-provider.types';

/**
 * Dedicated logger for the AI layer.
 * Standardizes metadata injection (requestId, userId, tokens) across all AI operations.
 */
export const aiLogger = {
  info(message: string, context?: AiRequestContext, extra?: Record<string, unknown>) {
    logger.info(this.buildMeta(context, extra), message);
  },

  warn(message: string, context?: AiRequestContext, extra?: Record<string, unknown>) {
    logger.warn(this.buildMeta(context, extra), message);
  },

  error(message: string, error?: Error, context?: AiRequestContext, extra?: Record<string, unknown>) {
    logger.error({
      ...this.buildMeta(context, extra),
      error: error ? { message: error.message, stack: error.stack, name: error.name } : undefined,
    }, message);
  },

  debug(message: string, context?: AiRequestContext, extra?: Record<string, unknown>) {
    logger.debug(this.buildMeta(context, extra), message);
  },

  logUsage(context: AiRequestContext, usage: AiProviderUsage, durationMs: number) {
    logger.info({
      ai: {
        requestId: context.requestId,
        userId: context.user.userId,
        sessionId: context.sessionId,
        channel: context.channel,
      },
      usage,
      durationMs,
    }, 'AI Generation Completed');
  },

  buildMeta(context?: AiRequestContext, extra?: Record<string, unknown>) {
    const meta: Record<string, unknown> = { ...extra };
    if (context) {
      meta.ai = {
        requestId: context.requestId,
        userId: context.user.userId,
        sessionId: context.sessionId,
      };
    }
    return meta;
  },
};
