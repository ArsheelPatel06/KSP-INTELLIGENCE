import type { AiWorkflowNodeName } from './langgraph.types';

export interface AiWorkflowTransition {
  from: AiWorkflowNodeName;
  to: AiWorkflowNodeName;
  condition: string;
  transitionType: 'default' | 'conditional' | 'failure' | 'human_review';
}

export const AI_WORKFLOW_TRANSITIONS: readonly AiWorkflowTransition[] = [
  {
    from: 'START',
    to: 'intent_detection',
    condition: 'Workflow initialized successfully.',
    transitionType: 'default',
  },
  {
    from: 'intent_detection',
    to: 'entity_extraction',
    condition: 'Intent detected with sufficient confidence.',
    transitionType: 'default',
  },
  {
    from: 'intent_detection',
    to: 'human_review_gate',
    condition: 'Intent confidence is too low or ambiguous.',
    transitionType: 'human_review',
  },
  {
    from: 'entity_extraction',
    to: 'permission_check',
    condition: 'Required entities were extracted or safely inferred.',
    transitionType: 'default',
  },
  {
    from: 'entity_extraction',
    to: 'human_review_gate',
    condition: 'Missing critical entities for safe execution.',
    transitionType: 'human_review',
  },
  {
    from: 'permission_check',
    to: 'task_planner',
    condition: 'Permissions and scope are valid.',
    transitionType: 'default',
  },
  {
    from: 'permission_check',
    to: 'FAILED',
    condition: 'Permission denied or jurisdiction violation.',
    transitionType: 'failure',
  },
  {
    from: 'task_planner',
    to: 'agent_router',
    condition: 'Execution plan was created successfully.',
    transitionType: 'default',
  },
  {
    from: 'task_planner',
    to: 'human_review_gate',
    condition: 'Task planning indicates sensitive or uncertain workflow.',
    transitionType: 'human_review',
  },
  {
    from: 'agent_router',
    to: 'parallel_agent_execution',
    condition: 'Primary and supporting agents were mapped into execution batches.',
    transitionType: 'default',
  },
  {
    from: 'parallel_agent_execution',
    to: 'evidence_aggregator',
    condition: 'At least one agent completed with usable evidence.',
    transitionType: 'default',
  },
  {
    from: 'parallel_agent_execution',
    to: 'human_review_gate',
    condition: 'Critical agent failures require manual review.',
    transitionType: 'human_review',
  },
  {
    from: 'parallel_agent_execution',
    to: 'FAILED',
    condition: 'No usable agent outputs remain after retries.',
    transitionType: 'failure',
  },
  {
    from: 'evidence_aggregator',
    to: 'confidence_calculator',
    condition: 'Evidence bundle assembled successfully.',
    transitionType: 'default',
  },
  {
    from: 'evidence_aggregator',
    to: 'human_review_gate',
    condition: 'Evidence is conflicting or materially incomplete.',
    transitionType: 'human_review',
  },
  {
    from: 'confidence_calculator',
    to: 'explainability',
    condition: 'Confidence breakdown computed successfully.',
    transitionType: 'default',
  },
  {
    from: 'confidence_calculator',
    to: 'human_review_gate',
    condition: 'Confidence falls below threshold for autonomous response.',
    transitionType: 'human_review',
  },
  {
    from: 'explainability',
    to: 'response_generator',
    condition: 'Explainability payload generated successfully.',
    transitionType: 'default',
  },
  {
    from: 'response_generator',
    to: 'human_review_gate',
    condition: 'Generated response is sensitive, low-confidence, or policy-gated.',
    transitionType: 'human_review',
  },
  {
    from: 'response_generator',
    to: 'audit_logger',
    condition: 'Response is ready for audit and release.',
    transitionType: 'default',
  },
  {
    from: 'human_review_gate',
    to: 'human_review_queue',
    condition: 'Human review is required.',
    transitionType: 'human_review',
  },
  {
    from: 'human_review_gate',
    to: 'audit_logger',
    condition: 'Human review is not required.',
    transitionType: 'default',
  },
  {
    from: 'human_review_queue',
    to: 'human_review_resolution',
    condition: 'Reviewer accepts the task and returns a disposition.',
    transitionType: 'human_review',
  },
  {
    from: 'human_review_resolution',
    to: 'audit_logger',
    condition: 'Reviewer disposition finalized.',
    transitionType: 'default',
  },
  {
    from: 'audit_logger',
    to: 'END',
    condition: 'Audit recorded successfully.',
    transitionType: 'default',
  },
  {
    from: 'audit_logger',
    to: 'FAILED',
    condition: 'Audit write failed in a non-recoverable manner.',
    transitionType: 'failure',
  },
] as const;
