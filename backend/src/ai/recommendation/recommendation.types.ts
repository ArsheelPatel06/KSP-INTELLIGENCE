import type { GraphCommunity, GraphSummary } from '../retrieval';
import type {
  AiAnalyticsEvidenceRecord,
  AiDatabaseEvidenceRecord,
  AiGraphRetrievalResult,
  AiLegalEvidenceRecord,
} from '../reasoning';
import type { AiSourceReference, AiWarning } from '../shared/ai-result.types';

export type RecommendationCapability =
  | 'investigation_leads'
  | 'legal_recommendation'
  | 'missing_evidence'
  | 'similar_cases'
  | 'repeat_offender'
  | 'gang_detection'
  | 'officer_assignment'
  | 'risk_score'
  | 'priority';

export type RecommendationCategory =
  | 'investigation'
  | 'legal'
  | 'evidence'
  | 'similarity'
  | 'offender'
  | 'network'
  | 'assignment'
  | 'risk'
  | 'priority';

export type RecommendationPriority = 'low' | 'medium' | 'high' | 'critical';
export type ReviewRequirement = 'not_required' | 'recommended' | 'mandatory';

export interface RecommendationEvidenceBundle {
  databaseRecords: AiDatabaseEvidenceRecord[];
  graphResult?: AiGraphRetrievalResult;
  legalRecords: AiLegalEvidenceRecord[];
  analyticsRecords: AiAnalyticsEvidenceRecord[];
  supportingSources: AiSourceReference[];
}

export interface RecommendationReasoningTrace {
  summary: string;
  steps: string[];
  assumptions?: string[];
  caveats?: string[];
}

export interface RecommendationConfidence {
  score: number;
  label: 'low' | 'medium' | 'high';
  rationale: string[];
}

export interface RecommendationBase {
  capability: RecommendationCapability;
  category: RecommendationCategory;
  title: string;
  summary: string;
  reason: RecommendationReasoningTrace;
  evidence: RecommendationEvidenceBundle;
  confidence: RecommendationConfidence;
  reviewRequired: ReviewRequirement;
  priority: RecommendationPriority;
  warnings: AiWarning[];
}

export interface InvestigationLeadRecommendation extends RecommendationBase {
  capability: 'investigation_leads';
  leadType: 'person' | 'device' | 'vehicle' | 'location' | 'financial' | 'timeline';
  suggestedActions: string[];
}

export interface LegalRecommendation extends RecommendationBase {
  capability: 'legal_recommendation';
  suggestedSections: Array<{
    actCode?: string;
    sectionCode?: string;
    title: string;
    reason: string;
  }>;
}

export interface MissingEvidenceRecommendation extends RecommendationBase {
  capability: 'missing_evidence';
  missingItems: string[];
  impact: string[];
}

export interface SimilarCasesRecommendation extends RecommendationBase {
  capability: 'similar_cases';
  similarCases: Array<{
    caseMasterId: bigint;
    similarityScore: number;
    reason: string;
  }>;
}

export interface RepeatOffenderRecommendation extends RecommendationBase {
  capability: 'repeat_offender';
  offenderProfiles: Array<{
    profileId: string;
    accusedIds: string[];
    repeatRiskScore: number;
  }>;
}

export interface GangDetectionRecommendation extends RecommendationBase {
  capability: 'gang_detection';
  communities: GraphCommunity[];
  networkSummary?: GraphSummary;
}

export interface OfficerAssignmentRecommendation extends RecommendationBase {
  capability: 'officer_assignment';
  suggestedOfficerIds: bigint[];
  assignmentReason: string[];
}

export interface RiskScoreRecommendation extends RecommendationBase {
  capability: 'risk_score';
  targetType: 'case' | 'accused' | 'victim' | 'hotspot' | 'unit';
  targetId: string;
  riskScore: number;
  contributingFactors: string[];
}

export interface PriorityRecommendation extends RecommendationBase {
  capability: 'priority';
  targetType: 'case' | 'alert' | 'task';
  targetId: string;
  escalationTriggers: string[];
}

export type RecommendationResult =
  | InvestigationLeadRecommendation
  | LegalRecommendation
  | MissingEvidenceRecommendation
  | SimilarCasesRecommendation
  | RepeatOffenderRecommendation
  | GangDetectionRecommendation
  | OfficerAssignmentRecommendation
  | RiskScoreRecommendation
  | PriorityRecommendation;

export interface RecommendationRequestContext {
  caseMasterId?: bigint;
  districtId?: number;
  unitId?: number;
  officerId?: bigint;
  query?: string;
  capabilities: RecommendationCapability[];
}
