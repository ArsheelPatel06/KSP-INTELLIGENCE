import type { AiAgentName, AiAgentExecutionOutput } from '../agents';
import type { AiAgentRoutingIntent, AiAgentRoutingRule } from '../agents';
import type { AiExecutionState } from '../orchestrator/ai-state.types';
import type { AiRequestContext } from '../shared/ai-request.types';
import type { AiExecutionResult, AiSourceReference, AiWarning } from '../shared/ai-result.types';

export type AiWorkflowNodeName =
  | 'START'
  | 'intent_detection'
  | 'entity_extraction'
  | 'permission_check'
  | 'task_planner'
  | 'agent_router'
  | 'parallel_agent_execution'
  | 'evidence_aggregator'
  | 'confidence_calculator'
  | 'explainability'
  | 'response_generator'
  | 'human_review_gate'
  | 'human_review_queue'
  | 'human_review_resolution'
  | 'audit_logger'
  | 'END'
  | 'FAILED';

export type AiWorkflowTerminalStatus = 'completed' | 'failed' | 'human_review_required';

export interface AiWorkflowSharedContext {
  request: AiRequestContext;
  locale?: string;
  currentCaseMasterId?: bigint;
  activeDistrictId?: number;
  activeUnitId?: number;
  officerRole: string;
  jurisdictionScope: 'all' | 'district' | 'unit' | 'none';
  sessionMemoryKeys: readonly string[];
  promptKeys: readonly string[];
  requiredPermissions: readonly string[];
  traceId?: string;
}

export interface AiDetectedIntent {
  intent: AiAgentRoutingIntent;
  confidence: number;
  alternateIntents?: Array<{
    intent: AiAgentRoutingIntent;
    confidence: number;
  }>;
}

export interface AiExtractedEntity {
  entityType: string;
  entityId?: string;
  label: string;
  confidence?: number;
  metadata?: Record<string, unknown>;
}

export interface AiWorkflowTaskPlan {
  intent: AiAgentRoutingIntent;
  primaryAgent: AiAgentName;
  supportingAgents: readonly AiAgentName[];
  routingRule: AiAgentRoutingRule;
  executionMode: 'sequential' | 'parallel' | 'hybrid';
  requiresHumanReview: boolean;
  notes?: readonly string[];
}

export interface AiWorkflowAgentBatch {
  batchId: string;
  agents: readonly AiAgentName[];
  mode: 'parallel' | 'sequential';
  dependsOnBatchIds?: readonly string[];
}

export interface AiWorkflowEvidenceBundle {
  facts: Record<string, unknown>[];
  citations: AiSourceReference[];
  warnings: AiWarning[];
  conflicts?: Array<{
    field: string;
    message: string;
    conflictingSourceIds: string[];
  }>;
}

export interface AiWorkflowConfidenceBreakdown {
  overallScore: number;
  evidenceScore: number;
  coverageScore: number;
  consistencyScore: number;
  explanation: string[];
}

export interface AiWorkflowExplainabilityPayload {
  reasoningSteps: string[];
  toolUsageSummary: string[];
  agentContributionSummary: Array<{
    agent: AiAgentName;
    contribution: string;
  }>;
  citationSummary: string[];
}

export interface AiWorkflowResponsePayload {
  summary: string;
  evidence: AiWorkflowEvidenceBundle;
  confidence: AiWorkflowConfidenceBreakdown;
  explainability: AiWorkflowExplainabilityPayload;
  requiresHumanReview: boolean;
}

export interface AiWorkflowAuditEvent {
  node: AiWorkflowNodeName;
  status: 'started' | 'completed' | 'failed' | 'skipped';
  timestamp: string;
  detail?: string;
}

export interface AiWorkflowHumanReviewState {
  required: boolean;
  reasonCodes: readonly string[];
  reviewQueue?: string;
  assignedRole?: string;
  assignedUserId?: string;
  disposition?: 'pending' | 'approved' | 'rejected' | 'needs_more_information';
  notes?: readonly string[];
}

export interface AiLangGraphState extends Omit<AiExecutionState, 'taskPlan'> {
  currentNode: AiWorkflowNodeName;
  visitedNodes: AiWorkflowNodeName[];
  sharedContext: AiWorkflowSharedContext;
  detectedIntent?: AiDetectedIntent;
  extractedEntities?: AiExtractedEntity[];
  taskPlan?: AiWorkflowTaskPlan;
  executionBatches?: AiWorkflowAgentBatch[];
  agentOutputs?: Partial<Record<AiAgentName, AiExecutionResult<AiAgentExecutionOutput>>>;
  evidenceBundle?: AiWorkflowEvidenceBundle;
  confidenceBreakdown?: AiWorkflowConfidenceBreakdown;
  explainability?: AiWorkflowExplainabilityPayload;
  response?: AiWorkflowResponsePayload;
  auditTrail?: AiWorkflowAuditEvent[];
  humanReview?: AiWorkflowHumanReviewState;
  terminalStatus?: AiWorkflowTerminalStatus;
}
