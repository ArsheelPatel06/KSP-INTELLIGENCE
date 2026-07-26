import type { AiRequest } from '../../shared/ai-request.types';
import type { AiExecutionResult } from '../../shared/ai-result.types';

/**
 * Shared component contract for future AI modules.
 *
 * This stays intentionally generic so orchestrators, planners, validators,
 * explainability modules, and other cross-cutting AI components can share a
 * common execution signature without implying an agent implementation.
 */
export interface AiComponent<TOutput = unknown> {
  readonly name: string;
  execute(request: AiRequest): Promise<AiExecutionResult<TOutput>>;
}
