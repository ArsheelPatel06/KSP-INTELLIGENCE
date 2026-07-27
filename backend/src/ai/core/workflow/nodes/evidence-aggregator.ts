import type { typeofAiGraphState } from '../state';
import { aiLogger } from '../../../shared/ai-logger';

/**
 * Aggregates evidence from all agents that ran in parallel.
 * This prepares a unified context string for the final generator.
 */
export async function evidenceAggregatorNode(state: typeofAiGraphState): Promise<Partial<typeofAiGraphState>> {
  aiLogger.info(`Aggregating evidence from ${state.evidence.length} sources`, state.context);
  
  // In a real implementation, this node might deduplicate evidence or check if sufficient facts were found.
  // For now, it simply acts as a synchronization point after parallel execution.
  
  if (state.evidence.length === 0) {
    return {
      warnings: ['No evidence was retrieved by any agent.'],
    };
  }

  return {}; // State mutations handled by reducer in state.ts
}
