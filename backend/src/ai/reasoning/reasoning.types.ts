import type { AiAgentName, AiAgentRoutingIntent } from '../agents';
import type { AiLangGraphState, AiDetectedIntent, AiExtractedEntity } from '../pipelines';
import type { RagCitation, RagContextWindow } from '../rag';
import type { GraphExplanation, GraphPath, GraphSubgraph, GraphSummary } from '../retrieval';
import type { AiRequest } from '../shared/ai-request.types';
import type { AiExecutionResult, AiSourceReference, AiWarning } from '../shared/ai-result.types';

export type AiReasoningStage =
  | 'intent_detection'
  | 'entity_extraction'
  | 'context_collection'
  | 'database_retrieval'
  | 'graph_retrieval'
  | 'legal_retrieval'
  | 'analytics_retrieval'
  | 'evidence_validation'
  | 'recommendation_generation'
  | 'confidence_calculation'
  | 'response_formatting'
  | 'explainability'
  | 'hallucination_detection'
  | 'human_escalation';

export interface AiReasoningContextCollection {
  activeCaseMasterId?: bigint;
  activeDistrictId?: number;
  activeUnitId?: number;
  sessionMemorySummary: string[];
  conversationReferences: string[];
  jurisdictionSummary: string;
  promptKeys: string[];
  requiredPermissions: string[];
}

export interface AiDatabaseEvidenceRecord {
  entityType: string;
  entityId: string;
  label?: string;
  attributes: Record<string, unknown>;
  sourceReferences: AiSourceReference[];
}

export interface AiDatabaseRetrievalResult {
  records: AiDatabaseEvidenceRecord[];
  matchedCaseIds: bigint[];
  warnings: AiWarning[];
}

export interface AiGraphRetrievalResult {
  subgraph?: GraphSubgraph;
  shortestPath?: GraphPath | null;
  graphSummary?: GraphSummary;
  graphExplanation?: GraphExplanation;
  warnings: AiWarning[];
}

export interface AiLegalEvidenceRecord {
  actCode?: string;
  sectionCode?: string;
  title: string;
  explanation?: string;
  punishment?: string;
  sourceReferences: AiSourceReference[];
}

export interface AiLegalRetrievalResult {
  records: AiLegalEvidenceRecord[];
  citations: RagCitation[];
  warnings: AiWarning[];
}

export interface AiAnalyticsEvidenceRecord {
  metric: string;
  dimension?: string;
  value: number | string;
  comparisonValue?: number | string;
  sourceReferences: AiSourceReference[];
}

export interface AiAnalyticsRetrievalResult {
  records: AiAnalyticsEvidenceRecord[];
  contextWindow?: RagContextWindow;
  warnings: AiWarning[];
}

export interface AiEvidenceConflict {
  field: string;
  conflictType: 'missing' | 'contradictory' | 'low_quality' | 'out_of_scope';
  description: string;
  relatedSourceIds: string[];
}

export interface AiEvidenceValidationResult {
  valid: boolean;
  sufficiencyScore: number;
  validatedFacts: Record<string, unknown>[];
  conflicts: AiEvidenceConflict[];
  missingEvidence: string[];
  warnings: AiWarning[];
}

export interface AiRecommendationCandidate {
  category: 'legal' | 'investigation' | 'graph' | 'analytics' | 'supervisory';
  title: string;
  reasoning: string[];
  supportingSources: AiSourceReference[];
  confidence: number;
  requiresHumanReview: boolean;
}

export interface AiRecommendationGenerationResult {
  recommendations: AiRecommendationCandidate[];
  warnings: AiWarning[];
}

export interface AiConfidenceCalculationResult {
  overallScore: number;
  evidenceScore: number;
  retrievalCoverageScore: number;
  consistencyScore: number;
  hallucinationRiskScore: number;
  explanation: string[];
}

export interface AiExplainabilityResult {
  reasoningTrace: string[];
  evidenceMapping: Array<{
    claim: string;
    sourceIds: string[];
  }>;
  agentContributionSummary: Array<{
    agent: AiAgentName;
    contribution: string;
  }>;
  caveats: string[];
}

export interface AiHallucinationDetectionResult {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  unsupportedClaims: string[];
  missingSourceClaims: string[];
  conflictingClaims: string[];
  blockAutonomousResponse: boolean;
}

export interface AiHumanEscalationDecision {
  required: boolean;
  reasonCodes: string[];
  recommendedReviewerRole?: string;
  escalationQueue?: string;
  notes?: string[];
}

export interface AiReasoningResponse {
  intent: AiAgentRoutingIntent;
  summary: string;
  evidence: {
    structuredFacts: Record<string, unknown>[];
    sources: AiSourceReference[];
    citations: RagCitation[];
  };
  recommendations: AiRecommendationCandidate[];
  confidence: AiConfidenceCalculationResult;
  explainability: AiExplainabilityResult;
  hallucinationAssessment: AiHallucinationDetectionResult;
  humanEscalation: AiHumanEscalationDecision;
  warnings: AiWarning[];
}

export interface AiReasoningState extends Omit<AiLangGraphState, 'response'> {
  request: AiRequest;
  reasoningStage: AiReasoningStage;
  detectedIntent?: AiDetectedIntent;
  extractedEntities?: AiExtractedEntity[];
  collectedContext?: AiReasoningContextCollection;
  databaseRetrieval?: AiDatabaseRetrievalResult;
  graphRetrieval?: AiGraphRetrievalResult;
  legalRetrieval?: AiLegalRetrievalResult;
  analyticsRetrieval?: AiAnalyticsRetrievalResult;
  evidenceValidation?: AiEvidenceValidationResult;
  recommendationGeneration?: AiRecommendationGenerationResult;
  confidenceCalculation?: AiConfidenceCalculationResult;
  explainabilityResult?: AiExplainabilityResult;
  hallucinationDetection?: AiHallucinationDetectionResult;
  humanEscalationDecision?: AiHumanEscalationDecision;
  formattedResponse?: AiReasoningResponse;
}

export interface AiReasoningExecutionResult extends AiExecutionResult<AiReasoningResponse> {
  state: AiReasoningState;
}
