import type { RecommendationEngineCapabilities } from './recommendation-engine.interface';

export const RECOMMENDATION_ENGINE_CAPABILITIES: RecommendationEngineCapabilities = {
  supportedCapabilities: [
    'investigation_leads',
    'legal_recommendation',
    'missing_evidence',
    'similar_cases',
    'repeat_offender',
    'gang_detection',
    'officer_assignment',
    'risk_score',
    'priority',
  ],
  requiresEvidenceForAllRecommendations: true,
  requiresConfidenceForAllRecommendations: true,
  requiresReasonForAllRecommendations: true,
  requiresReviewFlagForAllRecommendations: true,
};

export const RECOMMENDATION_REVIEW_POLICIES = {
  legal_recommendation: 'mandatory',
  repeat_offender: 'mandatory',
  gang_detection: 'mandatory',
  risk_score: 'recommended',
  officer_assignment: 'recommended',
  priority: 'recommended',
  investigation_leads: 'recommended',
  missing_evidence: 'recommended',
  similar_cases: 'recommended',
} as const;

export const RECOMMENDATION_PRIORITY_HINTS = {
  investigation_leads: 'high',
  legal_recommendation: 'high',
  missing_evidence: 'high',
  similar_cases: 'medium',
  repeat_offender: 'critical',
  gang_detection: 'critical',
  officer_assignment: 'medium',
  risk_score: 'high',
  priority: 'critical',
} as const;
