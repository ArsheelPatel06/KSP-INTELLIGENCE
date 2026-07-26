import type { AiAgentName } from '../agents';
import type { RecommendationCapability, RecommendationPriority, ReviewRequirement } from '../recommendation';
import type { AiAgentOutputEnvelope } from '../shared/ai-output-contract.types';
import type { AiSourceReference, AiWarning } from '../shared/ai-result.types';

export type AiEvaluationDimension =
  | 'legal_accuracy'
  | 'retrieval_accuracy'
  | 'evidence_quality'
  | 'hallucination'
  | 'latency'
  | 'recommendation_accuracy'
  | 'graph_accuracy'
  | 'conversation_quality';

export type AiMetricAggregation = 'average' | 'weighted_average' | 'ratio' | 'binary_pass_rate' | 'p95' | 'count';
export type AiEvaluationLabel = 'poor' | 'fair' | 'good' | 'excellent';
export type AiEvaluationFailureSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AiEvaluationMethod =
  | 'exact_match'
  | 'expert_review'
  | 'retrieval_overlap'
  | 'citation_audit'
  | 'latency_percentile'
  | 'graph_validation'
  | 'conversation_review'
  | 'automated_policy_check';

export interface AiEvaluationMetricDefinition {
  key: string;
  dimension: AiEvaluationDimension;
  displayName: string;
  description: string;
  unit: 'score' | 'percentage' | 'milliseconds' | 'count' | 'boolean';
  aggregation: AiMetricAggregation;
  method: AiEvaluationMethod;
  failureSeverity: AiEvaluationFailureSeverity;
  requiresHumanReview: boolean;
  targetRange?: {
    minimum?: number;
    maximum?: number;
    ideal?: number;
  };
}

export interface AiEvaluationDimensionWeight {
  dimension: AiEvaluationDimension;
  weight: number;
}

export interface AiExpectedSourceReference {
  sourceType: string;
  sourceId?: string;
  label?: string;
  required: boolean;
  relevanceReason: string;
}

export interface AiExpectedLegalSection {
  actCode?: string;
  sectionCode?: string;
  title?: string;
  required: boolean;
  rationale: string;
}

export interface AiExpectedRecommendation {
  capability: RecommendationCapability;
  expectedAction: string;
  priority?: RecommendationPriority;
  reviewRequired?: ReviewRequirement;
  evidenceRequired: boolean;
}

export interface AiExpectedGraphAssertion {
  assertionId: string;
  description: string;
  required: boolean;
  nodeIds?: readonly string[];
  edgeTypes?: readonly string[];
  expectedHopCount?: number;
  expectedAlgorithm?: 'shortest_path' | 'community_detection' | 'centrality' | 'connected_components';
}

export interface AiExpectedConversationOutcome {
  requiredTopics: readonly string[];
  forbiddenTopics?: readonly string[];
  expectedFollowUpQuestionThemes?: readonly string[];
  language?: string;
}

export interface AiLatencyBenchmark {
  endToEndMs?: number;
  retrievalMs?: number;
  graphMs?: number;
  modelMs?: number;
  firstTokenMs?: number;
}

export interface AiEvaluationCaseReference {
  benchmarkId: string;
  scenario: string;
  agent?: AiAgentName;
  datasetProfileName?: string;
  tags?: readonly string[];
  expectedOutcomeSummary: string;
  expectedSources?: readonly AiExpectedSourceReference[];
  expectedLegalSections?: readonly AiExpectedLegalSection[];
  expectedRecommendations?: readonly AiExpectedRecommendation[];
  expectedGraphAssertions?: readonly AiExpectedGraphAssertion[];
  expectedConversation?: AiExpectedConversationOutcome;
  latencyTargets?: AiLatencyBenchmark;
  dimensionWeights?: readonly AiEvaluationDimensionWeight[];
}

export interface AiEvaluationMetricResult {
  metricKey: string;
  dimension: AiEvaluationDimension;
  score: number;
  observedValue?: number | boolean;
  targetValue?: number | boolean;
  label?: AiEvaluationLabel;
  explanation: string[];
  evidenceReferences?: AiSourceReference[];
  reviewerNotes?: string[];
  passed?: boolean;
}

export interface AiEvaluationScorecard {
  benchmark: AiEvaluationCaseReference;
  output: AiAgentOutputEnvelope;
  metrics: AiEvaluationMetricResult[];
  dimensions: readonly AiEvaluationDimension[];
  overallScore?: number;
  warnings: AiWarning[];
  overallLabel?: AiEvaluationLabel;
  generatedAt: string;
}

export interface AiEvaluationDatasetProfile {
  name: string;
  description: string;
  supportedDimensions: AiEvaluationDimension[];
  sourceType: 'synthetic' | 'historical' | 'reviewed_case' | 'golden_set';
  expectedOwners: readonly AiAgentName[];
  benchmarkUseCases: readonly string[];
}
