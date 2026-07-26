import type { AiAgent, AiAgentContract } from './agent.types';

export interface InvestigationAgentInput {
  caseMasterId?: bigint;
  crimeNo?: string;
  victimName?: string;
  accusedName?: string;
  officerQuestion?: string;
  requestedView?: 'summary' | 'timeline' | 'similar_cases' | 'victim_analysis';
}

export interface InvestigationAgentOutput {
  caseSummary?: string;
  timelineHighlights?: string[];
  similarCases?: Array<{
    caseMasterId: bigint;
    similarityScore: number;
    reason: string;
  }>;
  investigationLeads?: string[];
}

export interface InvestigationAgentContract extends AiAgentContract<InvestigationAgentInput, InvestigationAgentOutput> {
  readonly name: 'investigation';
}

export interface InvestigationAgent extends AiAgent<InvestigationAgentInput, InvestigationAgentOutput> {
  readonly contract: InvestigationAgentContract;
}

export interface LegalAgentInput {
  caseMasterId?: bigint;
  narrative?: string;
  actCode?: string;
  sectionCode?: string;
  requestedView?: 'section_search' | 'act_search' | 'recommendation' | 'explanation';
}

export interface LegalAgentOutput {
  suggestedSections?: Array<{
    sectionCode: string;
    title: string;
    reason: string;
    confidence: number;
  }>;
  matchedActs?: Array<{
    actCode?: string;
    actName: string;
  }>;
  legalExplanation?: string;
  legalWarnings?: string[];
}

export interface LegalAgentContract extends AiAgentContract<LegalAgentInput, LegalAgentOutput> {
  readonly name: 'legal';
}

export interface LegalAgent extends AiAgent<LegalAgentInput, LegalAgentOutput> {
  readonly contract: LegalAgentContract;
}

export interface AnalyticsAgentInput {
  districtId?: number;
  unitId?: number;
  metric?: string;
  crimeCategory?: string;
  fromDate?: string;
  toDate?: string;
  requestedView?: 'trend' | 'forecast' | 'victim_statistics' | 'hotspot';
}

export interface AnalyticsAgentOutput {
  metric?: string;
  insights?: string[];
  trendSummary?: string;
  forecastSummary?: string;
  hotspotSummary?: string;
}

export interface AnalyticsAgentContract extends AiAgentContract<AnalyticsAgentInput, AnalyticsAgentOutput> {
  readonly name: 'analytics';
}

export interface AnalyticsAgent extends AiAgent<AnalyticsAgentInput, AnalyticsAgentOutput> {
  readonly contract: AnalyticsAgentContract;
}

export interface GraphAgentInput {
  rootEntityType: 'CASE' | 'PERSON' | 'PHONE' | 'VEHICLE' | 'OFFICER' | 'LOCATION';
  rootEntityId: string;
  depth?: number;
  requestedView?: 'neighbors' | 'path' | 'network' | 'community';
}

export interface GraphAgentOutput {
  connectionSummary?: string;
  keyEntities?: Array<{
    entityType: string;
    entityId: string;
    label: string;
  }>;
  suspiciousPatterns?: string[];
}

export interface GraphAgentContract extends AiAgentContract<GraphAgentInput, GraphAgentOutput> {
  readonly name: 'graph';
}

export interface GraphAgent extends AiAgent<GraphAgentInput, GraphAgentOutput> {
  readonly contract: GraphAgentContract;
}

export interface RecommendationAgentInput {
  caseMasterId?: bigint;
  narrative?: string;
  districtId?: number;
  recommendationType?: 'ipc' | 'evidence' | 'lead' | 'priority' | 'all';
}

export interface RecommendationAgentOutput {
  recommendations: Array<{
    type: string;
    title: string;
    reason: string;
    confidence: number;
  }>;
  missingEvidence?: string[];
  priorityScore?: number;
}

export interface RecommendationAgentContract extends AiAgentContract<RecommendationAgentInput, RecommendationAgentOutput> {
  readonly name: 'recommendation';
}

export interface RecommendationAgent extends AiAgent<RecommendationAgentInput, RecommendationAgentOutput> {
  readonly contract: RecommendationAgentContract;
}

export interface ReportAgentInput {
  entityType: 'CASE' | 'DISTRICT' | 'STATION' | 'OFFICER';
  entityId: string;
  reportType: 'case_summary' | 'crime_review' | 'station_report' | 'briefing_note';
  language?: string;
}

export interface ReportAgentOutput {
  title: string;
  sections: Array<{
    heading: string;
    content: string;
  }>;
  executiveSummary?: string;
}

export interface ReportAgentContract extends AiAgentContract<ReportAgentInput, ReportAgentOutput> {
  readonly name: 'report';
}

export interface ReportAgent extends AiAgent<ReportAgentInput, ReportAgentOutput> {
  readonly contract: ReportAgentContract;
}

export interface SupervisorAgentInput {
  districtId?: number;
  unitId?: number;
  officerId?: bigint;
  caseMasterId?: bigint;
  requestedView?: 'pending_cases' | 'high_risk_cases' | 'workload' | 'attention_dashboard';
}

export interface SupervisorAgentOutput {
  attentionItems?: string[];
  workloadAlerts?: string[];
  riskFlags?: string[];
  recommendedActions?: string[];
}

export interface SupervisorAgentContract extends AiAgentContract<SupervisorAgentInput, SupervisorAgentOutput> {
  readonly name: 'supervisor';
}

export interface SupervisorAgent extends AiAgent<SupervisorAgentInput, SupervisorAgentOutput> {
  readonly contract: SupervisorAgentContract;
}
