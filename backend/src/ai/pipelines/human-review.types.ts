import type { Role } from '@core/auth/roles';
import type { AiWorkflowNodeName } from './langgraph.types';

export type AiHumanReviewReasonCode =
  | 'LOW_INTENT_CONFIDENCE'
  | 'MISSING_CRITICAL_ENTITIES'
  | 'SENSITIVE_LEGAL_RECOMMENDATION'
  | 'LOW_EVIDENCE_COVERAGE'
  | 'CONFLICTING_EVIDENCE'
  | 'LOW_CONFIDENCE_SCORE'
  | 'SUPERVISOR_ONLY_QUERY'
  | 'AUDIT_ESCALATION';

export interface AiHumanReviewNodeDefinition {
  name: Extract<AiWorkflowNodeName, 'human_review_gate' | 'human_review_queue' | 'human_review_resolution'>;
  purpose: string;
  allowedReviewerRoles: readonly Role[];
  requiresDisposition: boolean;
}

export interface AiHumanReviewDecision {
  required: boolean;
  reasonCodes: readonly AiHumanReviewReasonCode[];
  reviewerRole?: Role;
  reviewerUserId?: string;
  queueName?: string;
  disposition?: 'pending' | 'approved' | 'rejected' | 'needs_more_information';
  notes?: readonly string[];
}

export const AI_HUMAN_REVIEW_NODES: readonly AiHumanReviewNodeDefinition[] = [
  {
    name: 'human_review_gate',
    purpose: 'Evaluates whether the workflow can continue autonomously or must pause for human oversight.',
    allowedReviewerRoles: [],
    requiresDisposition: false,
  },
  {
    name: 'human_review_queue',
    purpose: 'Routes the request into a structured supervisor, legal, or investigation review queue.',
    allowedReviewerRoles: [],
    requiresDisposition: false,
  },
  {
    name: 'human_review_resolution',
    purpose: 'Captures reviewer outcome and merges human judgment into the workflow result.',
    allowedReviewerRoles: [],
    requiresDisposition: true,
  },
] as const;
