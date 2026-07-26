import type {
  GangDetectionRecommender,
  InvestigationLeadRecommender,
  LegalRecommender,
  MissingEvidenceDetector,
  OfficerAssignmentRecommender,
  PriorityRecommender,
  RepeatOffenderDetector,
  RiskScoreRecommender,
  SimilarCasesRecommender,
} from './recommendation-components.interface';
import type { RecommendationCapability, RecommendationRequestContext, RecommendationResult } from './recommendation.types';

export interface RecommendationEngineCapabilities {
  supportedCapabilities: readonly RecommendationCapability[];
  requiresEvidenceForAllRecommendations: boolean;
  requiresConfidenceForAllRecommendations: boolean;
  requiresReasonForAllRecommendations: boolean;
  requiresReviewFlagForAllRecommendations: boolean;
}

export interface RecommendationEngineDependencies {
  investigationLeadRecommender: InvestigationLeadRecommender;
  legalRecommender: LegalRecommender;
  missingEvidenceDetector: MissingEvidenceDetector;
  similarCasesRecommender: SimilarCasesRecommender;
  repeatOffenderDetector: RepeatOffenderDetector;
  gangDetectionRecommender: GangDetectionRecommender;
  officerAssignmentRecommender: OfficerAssignmentRecommender;
  riskScoreRecommender: RiskScoreRecommender;
  priorityRecommender: PriorityRecommender;
}

export interface RecommendationEngine {
  readonly capabilities: RecommendationEngineCapabilities;
  readonly dependencies: RecommendationEngineDependencies;

  recommend(context: RecommendationRequestContext): Promise<RecommendationResult[]>;
}
