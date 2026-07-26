import type { AiAgentName } from '../agents';
import type {
  AiEvaluationDimension,
  AiEvaluationScorecard,
} from './evaluation.types';

/**
 * Governance and audit trail types for evaluation results.
 *
 * These types define who reviewed an evaluation, approval workflows,
 * escalation triggers, retention policies, and audit trail metadata.
 *
 * Architecture only — no runtime implementation.
 */

// ---------------------------------------------------------------------------
// Evaluation Review
// ---------------------------------------------------------------------------

export type AiEvaluationReviewStatus = 'pending' | 'in_review' | 'approved' | 'rejected' | 'escalated';

export interface AiEvaluationReviewer {
  reviewerId: string;
  name: string;
  role: string;
  assignedAt: string;
}

export interface AiEvaluationReviewDecision {
  reviewId: string;
  runId: string;
  scorecardBenchmarkId?: string;
  reviewer: AiEvaluationReviewer;
  status: AiEvaluationReviewStatus;
  decision: 'accept' | 'reject' | 'escalate' | 'request_rerun';
  comments: string[];
  decidedAt: string;
}

// ---------------------------------------------------------------------------
// Escalation
// ---------------------------------------------------------------------------

export type AiEvaluationEscalationTrigger =
  | 'critical_regression'
  | 'hallucination_threshold_exceeded'
  | 'legal_accuracy_below_minimum'
  | 'graph_accuracy_below_minimum'
  | 'pass_rate_below_threshold'
  | 'manual_escalation';

export interface AiEvaluationEscalationRule {
  trigger: AiEvaluationEscalationTrigger;
  dimension?: AiEvaluationDimension;
  threshold?: number;
  escalateTo: string;
  description: string;
  autoBlock: boolean;
}

export const AI_EVALUATION_ESCALATION_RULES: readonly AiEvaluationEscalationRule[] = [
  {
    trigger: 'critical_regression',
    threshold: -0.15,
    escalateTo: 'ai_lead',
    description: 'Escalate when any critical metric regresses beyond 15% of its baseline.',
    autoBlock: true,
  },
  {
    trigger: 'hallucination_threshold_exceeded',
    dimension: 'hallucination',
    threshold: 0.1,
    escalateTo: 'ai_lead',
    description: 'Escalate when unsupported claim rate or contradiction rate exceeds 10%.',
    autoBlock: true,
  },
  {
    trigger: 'legal_accuracy_below_minimum',
    dimension: 'legal_accuracy',
    threshold: 0.7,
    escalateTo: 'legal_review_officer',
    description: 'Escalate when legal section match rate falls below 70%.',
    autoBlock: true,
  },
  {
    trigger: 'graph_accuracy_below_minimum',
    dimension: 'graph_accuracy',
    threshold: 0.8,
    escalateTo: 'ai_lead',
    description: 'Escalate when graph link validation or path correctness falls below 80%.',
    autoBlock: false,
  },
  {
    trigger: 'pass_rate_below_threshold',
    threshold: 0.7,
    escalateTo: 'ai_lead',
    description: 'Escalate when overall benchmark pass rate falls below 70%.',
    autoBlock: false,
  },
  {
    trigger: 'manual_escalation',
    escalateTo: 'ai_lead',
    description: 'Manual escalation initiated by a reviewer.',
    autoBlock: false,
  },
] as const;

// ---------------------------------------------------------------------------
// Audit Trail
// ---------------------------------------------------------------------------

export type AiEvaluationAuditAction =
  | 'run_started'
  | 'run_completed'
  | 'run_failed'
  | 'run_cancelled'
  | 'scorecard_generated'
  | 'review_assigned'
  | 'review_decision'
  | 'escalation_triggered'
  | 'threshold_breached'
  | 'comparison_generated'
  | 'suite_created'
  | 'suite_updated';

export interface AiEvaluationAuditEntry {
  auditId: string;
  action: AiEvaluationAuditAction;
  runId?: string;
  suiteId?: string;
  agent?: AiAgentName;
  dimension?: AiEvaluationDimension;
  actorId: string;
  actorRole: string;
  timestamp: string;
  details: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Retention Policy
// ---------------------------------------------------------------------------

export interface AiEvaluationRetentionPolicy {
  scorecardRetentionDays: number;
  runResultRetentionDays: number;
  auditLogRetentionDays: number;
  comparisonRetentionDays: number;
  archiveAfterDays: number;
}

export const AI_EVALUATION_DEFAULT_RETENTION: AiEvaluationRetentionPolicy = {
  scorecardRetentionDays: 365,
  runResultRetentionDays: 365,
  auditLogRetentionDays: 730,
  comparisonRetentionDays: 365,
  archiveAfterDays: 180,
};

// ---------------------------------------------------------------------------
// Governance Configuration
// ---------------------------------------------------------------------------

export interface AiEvaluationGovernanceConfig {
  requireReviewForCriticalFailures: boolean;
  requireReviewForLegalDimension: boolean;
  autoBlockOnCriticalRegression: boolean;
  escalationRules: readonly AiEvaluationEscalationRule[];
  retentionPolicy: AiEvaluationRetentionPolicy;
  minimumReviewersForApproval: number;
}

export const AI_EVALUATION_DEFAULT_GOVERNANCE: AiEvaluationGovernanceConfig = {
  requireReviewForCriticalFailures: true,
  requireReviewForLegalDimension: true,
  autoBlockOnCriticalRegression: true,
  escalationRules: AI_EVALUATION_ESCALATION_RULES,
  retentionPolicy: AI_EVALUATION_DEFAULT_RETENTION,
  minimumReviewersForApproval: 1,
};

// ---------------------------------------------------------------------------
// Governance Interface
// ---------------------------------------------------------------------------

/**
 * Interface for evaluation governance operations.
 * Architecture only — implementations are deferred to runtime phases.
 */
export interface AiEvaluationGovernance {
  assignReviewer(runId: string, reviewer: AiEvaluationReviewer): Promise<void>;
  submitReviewDecision(decision: AiEvaluationReviewDecision): Promise<void>;
  checkEscalationTriggers(
    scorecard: AiEvaluationScorecard,
    rules: readonly AiEvaluationEscalationRule[],
  ): Promise<readonly AiEvaluationEscalationTrigger[]>;
  getAuditTrail(runId: string): Promise<readonly AiEvaluationAuditEntry[]>;
  recordAuditEntry(entry: AiEvaluationAuditEntry): Promise<void>;
}
