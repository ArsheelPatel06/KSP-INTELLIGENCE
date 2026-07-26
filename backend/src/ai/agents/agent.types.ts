import type { AiExecutionState } from '../orchestrator/ai-state.types';
import type { AiToolName } from '../tools';
import type { AiExecutionResult, AiSourceReference, AiWarning } from '../shared/ai-result.types';

export type AiAgentName =
  'investigation' | 'legal' | 'analytics' | 'graph' | 'recommendation' | 'report' | 'supervisor';

export type AiAgentResponsibility =
  | 'case_summary'
  | 'case_timeline'
  | 'similar_case_search'
  | 'investigation_lead_generation'
  | 'victim_pattern_analysis'
  | 'legal_section_lookup'
  | 'legal_recommendation'
  | 'crime_trend_analysis'
  | 'crime_forecasting'
  | 'hotspot_analysis'
  | 'relationship_expansion'
  | 'network_analysis'
  | 'supervisor_review'
  | 'recommendation_generation'
  | 'report_generation';

export type AiMemoryScope = 'none' | 'request' | 'session' | 'case' | 'investigation';
export type AiPromptMode = 'required' | 'optional' | 'system-generated';
export type AiEvidenceMode = 'required' | 'preferred' | 'optional';
export type AiConfidenceMode = 'required' | 'derived' | 'optional';
export type AiFailureMode = 'fail_fast' | 'degrade_gracefully' | 'fallback_to_supervisor_review';

export interface AiAgentInputContract {
  description: string;
  requiredFields: readonly string[];
  optionalFields?: readonly string[];
  acceptsCaseContext: boolean;
  acceptsConversationContext: boolean;
  acceptsStructuredEntities: boolean;
  acceptsUserQuery: boolean;
}

export interface AiAgentOutputContract {
  description: string;
  primaryPayload: string;
  includesEvidence: boolean;
  includesConfidence: boolean;
  includesWarnings: boolean;
  includesHumanReviewFlag: boolean;
}

export interface AiAgentMemoryPolicy {
  scope: AiMemoryScope;
  description: string;
  retainedFields: readonly string[];
  redactedFields?: readonly string[];
  ttlSeconds?: number;
}

export interface AiAgentPromptPolicy {
  mode: AiPromptMode;
  promptKey: string;
  promptVersionRequired: boolean;
  allowRuntimeOverride: boolean;
  notes?: readonly string[];
}

export interface AiAgentFailurePolicy {
  mode: AiFailureMode;
  retryableErrorCodes: readonly string[];
  fallbackActions: readonly string[];
  escalateToHumanReview: boolean;
  suppressUnsupportedClaims: boolean;
}

export interface AiAgentConfidencePolicy {
  mode: AiConfidenceMode;
  minimumEvidenceCount?: number;
  requiresSourceAttribution: boolean;
  requiresScoreBreakdown: boolean;
  downgradeOnMissingEvidence: boolean;
}

export interface AiAgentEvidencePolicy {
  mode: AiEvidenceMode;
  minimumCitationCount?: number;
  requireStructuredSources: boolean;
  requireConflictingEvidenceWarnings: boolean;
  allowedSourceTypes?: readonly string[];
}

export interface AiAgentExecutionInput<TPayload = Record<string, unknown>> {
  query: string;
  payload?: TPayload;
  state: AiExecutionState;
}

export interface AiAgentExecutionOutput<TData = Record<string, unknown>> {
  agent: AiAgentName;
  summary: string;
  data: TData;
  evidence: {
    citations: AiSourceReference[];
    facts: Record<string, unknown>[];
  };
  confidence?: {
    score: number;
    rationale: string[];
  };
  warnings: AiWarning[];
  requiresHumanReview: boolean;
}

export interface AiAgentContract<
  TInput = Record<string, unknown>,
  TOutput = Record<string, unknown>,
> {
  readonly name: AiAgentName;
  readonly displayName: string;
  readonly description: string;
  readonly responsibilities: readonly AiAgentResponsibility[];
  readonly input: AiAgentInputContract & { readonly shape: Partial<TInput> };
  readonly output: AiAgentOutputContract & { readonly shape: Partial<TOutput> };
  readonly tools: readonly AiToolName[];
  readonly memory: AiAgentMemoryPolicy;
  readonly prompt: AiAgentPromptPolicy;
  readonly failureHandling: AiAgentFailurePolicy;
  readonly confidence: AiAgentConfidencePolicy;
  readonly evidence: AiAgentEvidencePolicy;
}

export interface AiAgent<TInput = Record<string, unknown>, TOutput = Record<string, unknown>> {
  readonly contract: AiAgentContract<TInput, TOutput>;
  execute(
    input: AiAgentExecutionInput<TInput>,
  ): Promise<AiExecutionResult<AiAgentExecutionOutput<TOutput>>>;
}
