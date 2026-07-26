import type { AiAgentName, AiAgentRoutingIntent } from '../agents';
import type { RecommendationResult, ReviewRequirement } from '../recommendation';
import type { RagCitation } from '../rag';
import type { GraphCommunity, GraphEdge, GraphNode, GraphPath, GraphSummary } from '../retrieval';
import type { AiRequestContext } from './ai-request.types';
import type { AiSourceReference, AiWarning } from './ai-result.types';

export interface AiOutputConfidence {
  label: 'low' | 'medium' | 'high';
  score: number;
  reason: string;
  breakdown?: {
    evidenceScore?: number;
    coverageScore?: number;
    consistencyScore?: number;
    hallucinationRiskScore?: number;
  };
}

export interface AiOutputReasoning {
  steps: string[];
  assumptions?: string[];
  caveats?: string[];
  explainability?: string[];
}

export interface AiOutputEvidenceItem {
  type: string;
  sourceId: string;
  label: string;
  detail?: string;
  confidence?: number;
  reviewStatus?: string;
  attributes?: Record<string, unknown>;
}

export interface AiOutputRelatedCase {
  caseMasterId: bigint;
  crimeNo?: string;
  relationType: 'similar' | 'linked' | 'historical' | 'supporting';
  reason: string;
  confidence?: number;
}

export interface AiOutputRelatedPerson {
  entityType: 'ACCUSED' | 'VICTIM' | 'COMPLAINANT' | 'WITNESS' | 'OFFICER' | 'UNKNOWN';
  entityId: string;
  name?: string;
  relationType: string;
  reason: string;
  confidence?: number;
}

export interface AiOutputGraph {
  summary?: string;
  nodes?: GraphNode[];
  edges?: GraphEdge[];
  paths?: GraphPath[];
  communities?: GraphCommunity[];
  graphSummary?: GraphSummary;
}

export interface AiOutputAnalyticsItem {
  metric: string;
  dimension?: string;
  value: number | string;
  comparisonValue?: number | string;
  interpretation?: string;
}

export interface AiOutputLegalSection {
  actCode?: string;
  sectionCode?: string;
  title: string;
  reason: string;
  confidence?: number;
  reviewRequired?: boolean;
}

export interface AiOutputMetadata {
  requestId: string;
  sessionId?: string;
  correlationId?: string;
  intent?: AiAgentRoutingIntent;
  agentsUsed?: AiAgentName[];
  toolsUsed?: string[];
  outputMode?: 'chat' | 'case_panel' | 'dashboard' | 'report' | 'voice' | 'api';
  role?: string;
  caseMasterId?: bigint;
  districtId?: number;
  unitId?: number;
  generatedAt: string;
  modelVersion?: string;
  promptVersion?: string;
}

export interface AiStandardOutputContract {
  summary: string;
  reasoning: string[];
  evidence: string[];
  confidence: number;
  citations: string[];
  recommendations: string[];
  relatedCases: string[];
  legalSections: string[];
  graph: Record<string, unknown>;
  analytics: Record<string, unknown>;
  warnings: string[];
  metadata: Record<string, unknown>;
}

export interface AiAgentOutputEnvelope {
  agent: AiAgentName;
  intent?: AiAgentRoutingIntent;
  context: Pick<AiRequestContext, 'requestId' | 'sessionId' | 'correlationId' | 'user' | 'screen' | 'channel'>;
  payload: AiStandardOutputContract;
  sources: AiSourceReference[];
}
