import type { AiWorkflowNodeName } from './langgraph.types';

export interface AiWorkflowRetryPolicy {
  node: AiWorkflowNodeName;
  enabled: boolean;
  maxAttempts: number;
  backoffStrategy: 'none' | 'fixed' | 'exponential';
  initialDelayMs?: number;
  maxDelayMs?: number;
  retryOnErrorCodes: readonly string[];
  fallbackNode?: AiWorkflowNodeName;
}

export const AI_WORKFLOW_RETRY_POLICIES: readonly AiWorkflowRetryPolicy[] = [
  {
    node: 'intent_detection',
    enabled: true,
    maxAttempts: 2,
    backoffStrategy: 'fixed',
    initialDelayMs: 250,
    retryOnErrorCodes: ['AI_PROVIDER_TIMEOUT', 'AI_TOOL_TIMEOUT'],
    fallbackNode: 'human_review_gate',
  },
  {
    node: 'entity_extraction',
    enabled: true,
    maxAttempts: 2,
    backoffStrategy: 'fixed',
    initialDelayMs: 250,
    retryOnErrorCodes: ['AI_PROVIDER_TIMEOUT', 'AI_TOOL_TIMEOUT'],
    fallbackNode: 'human_review_gate',
  },
  {
    node: 'task_planner',
    enabled: true,
    maxAttempts: 2,
    backoffStrategy: 'fixed',
    initialDelayMs: 300,
    retryOnErrorCodes: ['AI_WORKFLOW_VALIDATION_ERROR'],
    fallbackNode: 'human_review_gate',
  },
  {
    node: 'parallel_agent_execution',
    enabled: true,
    maxAttempts: 2,
    backoffStrategy: 'exponential',
    initialDelayMs: 500,
    maxDelayMs: 2000,
    retryOnErrorCodes: ['AI_TOOL_TIMEOUT', 'AI_PROVIDER_TIMEOUT', 'AI_TOOL_DEPENDENCY_UNAVAILABLE'],
    fallbackNode: 'human_review_gate',
  },
  {
    node: 'evidence_aggregator',
    enabled: true,
    maxAttempts: 2,
    backoffStrategy: 'fixed',
    initialDelayMs: 250,
    retryOnErrorCodes: ['AI_WORKFLOW_VALIDATION_ERROR'],
    fallbackNode: 'human_review_gate',
  },
  {
    node: 'confidence_calculator',
    enabled: true,
    maxAttempts: 2,
    backoffStrategy: 'fixed',
    initialDelayMs: 250,
    retryOnErrorCodes: ['AI_WORKFLOW_VALIDATION_ERROR'],
    fallbackNode: 'human_review_gate',
  },
  {
    node: 'explainability',
    enabled: true,
    maxAttempts: 2,
    backoffStrategy: 'fixed',
    initialDelayMs: 250,
    retryOnErrorCodes: ['AI_WORKFLOW_VALIDATION_ERROR'],
    fallbackNode: 'human_review_gate',
  },
  {
    node: 'response_generator',
    enabled: true,
    maxAttempts: 2,
    backoffStrategy: 'fixed',
    initialDelayMs: 250,
    retryOnErrorCodes: ['AI_PROVIDER_TIMEOUT'],
    fallbackNode: 'human_review_gate',
  },
  {
    node: 'audit_logger',
    enabled: true,
    maxAttempts: 2,
    backoffStrategy: 'fixed',
    initialDelayMs: 200,
    retryOnErrorCodes: ['AI_AUDIT_FAILURE'],
    fallbackNode: 'FAILED',
  },
] as const;
