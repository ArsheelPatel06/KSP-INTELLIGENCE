import type { AiExecutionResult } from '../shared/ai-result.types';
import type {
  AiLangGraphState,
  AiWorkflowNodeName,
  AiWorkflowResponsePayload,
  AiWorkflowSharedContext,
} from './langgraph.types';
import type { AiWorkflowRetryPolicy } from './retry-policy.types';
import type { AiWorkflowTransition } from './workflow-transitions';
import type { AiWorkflowNodeDefinition } from './workflow-nodes';

export interface AiLangGraphWorkflowDefinition {
  version: string;
  startNode: Extract<AiWorkflowNodeName, 'START'>;
  endNodes: readonly Extract<AiWorkflowNodeName, 'END' | 'FAILED'>[];
  nodes: readonly AiWorkflowNodeDefinition[];
  transitions: readonly AiWorkflowTransition[];
  retryPolicies: readonly AiWorkflowRetryPolicy[];
}

export interface AiLangGraphExecutionPipeline {
  readonly workflow: AiLangGraphWorkflowDefinition;

  initializeSharedContext(state: AiLangGraphState): AiWorkflowSharedContext;
  getNextNodes(node: AiWorkflowNodeName): readonly AiWorkflowTransition[];
  shouldRouteToHumanReview(state: AiLangGraphState): boolean;
  shouldRetry(node: AiWorkflowNodeName, attempt: number, errorCode?: string): boolean;
  getRetryPolicy(node: AiWorkflowNodeName): AiWorkflowRetryPolicy | undefined;
  buildInitialState(input: AiLangGraphState): AiLangGraphState;
  finalizeState(state: AiLangGraphState): AiExecutionResult<AiWorkflowResponsePayload>;
}
