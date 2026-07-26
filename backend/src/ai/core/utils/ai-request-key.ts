import type { AiRequest } from '../../shared/ai-request.types';

/**
 * Builds a deterministic key that future cache, audit, or rate-limit modules
 * can reuse without depending on HTTP-layer objects.
 */
export function buildAiRequestKey(request: AiRequest): string {
  const casePart = request.caseMasterId ? `case:${request.caseMasterId.toString()}` : 'case:none';
  return [
    `user:${request.context.user.userId}`,
    `channel:${request.context.channel ?? 'api'}`,
    casePart,
    `query:${request.query.trim().toLowerCase()}`,
  ].join('|');
}
