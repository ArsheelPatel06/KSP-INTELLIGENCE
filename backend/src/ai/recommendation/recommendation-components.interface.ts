import type {
  GangDetectionRecommendation,
  InvestigationLeadRecommendation,
  LegalRecommendation,
  MissingEvidenceRecommendation,
  OfficerAssignmentRecommendation,
  PriorityRecommendation,
  RecommendationRequestContext,
  RepeatOffenderRecommendation,
  RiskScoreRecommendation,
  SimilarCasesRecommendation,
} from './recommendation.types';

export interface InvestigationLeadRecommender {
  recommend(context: RecommendationRequestContext): Promise<InvestigationLeadRecommendation[]>;
}

export interface LegalRecommender {
  recommend(context: RecommendationRequestContext): Promise<LegalRecommendation[]>;
}

export interface MissingEvidenceDetector {
  recommend(context: RecommendationRequestContext): Promise<MissingEvidenceRecommendation[]>;
}

export interface SimilarCasesRecommender {
  recommend(context: RecommendationRequestContext): Promise<SimilarCasesRecommendation[]>;
}

export interface RepeatOffenderDetector {
  recommend(context: RecommendationRequestContext): Promise<RepeatOffenderRecommendation[]>;
}

export interface GangDetectionRecommender {
  recommend(context: RecommendationRequestContext): Promise<GangDetectionRecommendation[]>;
}

export interface OfficerAssignmentRecommender {
  recommend(context: RecommendationRequestContext): Promise<OfficerAssignmentRecommendation[]>;
}

export interface RiskScoreRecommender {
  recommend(context: RecommendationRequestContext): Promise<RiskScoreRecommendation[]>;
}

export interface PriorityRecommender {
  recommend(context: RecommendationRequestContext): Promise<PriorityRecommendation[]>;
}
