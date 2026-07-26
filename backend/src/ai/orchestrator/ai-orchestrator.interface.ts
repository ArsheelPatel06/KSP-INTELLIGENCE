import type { AiRequest } from '../shared/ai-request.types';
import type { AiExecutionResult } from '../shared/ai-result.types';
import type { AiExecutionState } from './ai-state.types';

/**
 * Top-level orchestration boundary for the AI Operating System.
 *
 * The orchestrator is responsible for turning a normalized AI request into a
 * structured result while coordinating later-stage agents, retrieval modules,
 * evidence assembly, and provider synthesis.
 */
export interface AiOrchestrator {
  initializeState(request: AiRequest): AiExecutionState;
  execute(request: AiRequest): Promise<AiExecutionResult>;
}
