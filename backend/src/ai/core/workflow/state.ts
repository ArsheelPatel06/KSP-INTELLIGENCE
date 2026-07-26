import { BaseMessage } from '@langchain/core/messages';
import { Annotation } from '@langchain/langgraph';
import type { AiRequestContext } from '../../shared/ai-request.types';
import type { AiAgentOutputEnvelope } from '../../shared/ai-output-contract.types';

export interface AgentTaskPlan {
  agentsToRun: ('investigation' | 'legal' | 'graph' | 'analytics' | 'recommendation')[];
  primaryIntent: string;
  isSensitive: boolean;
}

export interface RetrievedEvidence {
  sourceAgent: string;
  facts: string[];
  citations: string[];
}

export const AiGraphState = Annotation.Root({
  // Chat history / current user query
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),

  // Passed in from the API request
  context: Annotation<AiRequestContext>({
    reducer: (x, y) => y ?? x,
  }),

  // Output from the Planner Node
  taskPlan: Annotation<AgentTaskPlan | null>({
    reducer: (x, y) => y ?? x,
  }),

  // Appended by each executed Agent in parallel
  evidence: Annotation<RetrievedEvidence[]>({
    reducer: (x, y) => x.concat(y),
  }),

  // Output from the Generator Node
  finalOutput: Annotation<AiAgentOutputEnvelope | null>({
    reducer: (x, y) => y ?? x,
  }),

  // Phase 13 Reasoning Engine Fields
  detectedIntent: Annotation<string | null>({
    reducer: (x, y) => y ?? x,
  }),

  extractedEntities: Annotation<any | null>({
    reducer: (x, y) => y ?? x,
  }),

  permissions: Annotation<any>({
    reducer: (x, y) => ({ ...x, ...y }),
    default: () => ({}),
  }),

  resolvedConflicts: Annotation<string[]>({
    reducer: (x, y) => x.concat(y),
  }),

  overallConfidence: Annotation<number>({
    reducer: (x, y) => y,
    default: () => 0,
  }),

  // Any execution errors or policy warnings
  warnings: Annotation<string[]>({
    reducer: (x, y) => x.concat(y),
  }),
});

export type typeofAiGraphState = typeof AiGraphState.State;
