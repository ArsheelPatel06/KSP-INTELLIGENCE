import type { AiLangGraphWorkflowDefinition } from './execution-pipeline.interface';
import { AI_WORKFLOW_NODES } from './workflow-nodes';
import { AI_WORKFLOW_TRANSITIONS } from './workflow-transitions';
import { AI_WORKFLOW_RETRY_POLICIES } from './retry-policy.types';

export const AI_LANGGRAPH_WORKFLOW: AiLangGraphWorkflowDefinition = {
  version: 'phase-4-langgraph-design',
  startNode: 'START',
  endNodes: ['END', 'FAILED'],
  nodes: AI_WORKFLOW_NODES,
  transitions: AI_WORKFLOW_TRANSITIONS,
  retryPolicies: AI_WORKFLOW_RETRY_POLICIES,
};
