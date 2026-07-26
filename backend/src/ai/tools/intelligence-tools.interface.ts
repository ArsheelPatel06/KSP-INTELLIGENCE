import type { AiTool, AiToolContract } from './tool.types';

export interface SearchAnalyticsToolInput {
  metric: string;
  districtId?: number;
  unitId?: number;
  crimeHeadId?: number;
  fromDate?: string;
  toDate?: string;
  granularity?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
}

export interface AnalyticsSeriesPoint {
  label: string;
  value: number;
  comparisonValue?: number;
}

export interface SearchAnalyticsToolOutput {
  metric: string;
  series: AnalyticsSeriesPoint[];
  generatedAt: string;
}

export interface SearchAnalyticsToolContract extends AiToolContract<SearchAnalyticsToolInput, SearchAnalyticsToolOutput> {
  readonly name: 'searchAnalytics';
  readonly category: 'analytics';
}

export interface SearchAnalyticsTool extends AiTool<SearchAnalyticsToolInput, SearchAnalyticsToolOutput> {
  readonly contract: SearchAnalyticsToolContract;
}

export interface SearchGraphToolInput {
  rootEntityType: 'CASE' | 'PERSON' | 'PHONE' | 'VEHICLE' | 'OFFICER' | 'LOCATION';
  rootEntityId: string;
  depth?: number;
  relationshipTypes?: string[];
  maxNodes?: number;
}

export interface GraphNodeMatch {
  entityType: string;
  entityId: string;
  label: string;
  score?: number;
}

export interface GraphEdgeMatch {
  fromEntityType: string;
  fromEntityId: string;
  relationship: string;
  toEntityType: string;
  toEntityId: string;
  confidence?: number;
}

export interface SearchGraphToolOutput {
  nodes: GraphNodeMatch[];
  edges: GraphEdgeMatch[];
  expansionDepth: number;
}

export interface SearchGraphToolContract extends AiToolContract<SearchGraphToolInput, SearchGraphToolOutput> {
  readonly name: 'searchGraph';
  readonly category: 'graph';
}

export interface SearchGraphTool extends AiTool<SearchGraphToolInput, SearchGraphToolOutput> {
  readonly contract: SearchGraphToolContract;
}

export interface SearchHotspotsToolInput {
  districtId?: number;
  policeStationId?: number;
  crimeCategory?: string;
  fromDate?: string;
  toDate?: string;
  minimumRiskScore?: number;
  limit?: number;
}

export interface HotspotMatch {
  hotspotId: string;
  districtName?: string;
  policeStationName?: string;
  latitude?: number;
  longitude?: number;
  crimeCategory?: string;
  riskScore: number;
  trend?: string;
}

export interface SearchHotspotsToolOutput {
  matches: HotspotMatch[];
  totalCount: number;
}

export interface SearchHotspotsToolContract extends AiToolContract<SearchHotspotsToolInput, SearchHotspotsToolOutput> {
  readonly name: 'searchHotspots';
  readonly category: 'analytics';
}

export interface SearchHotspotsTool extends AiTool<SearchHotspotsToolInput, SearchHotspotsToolOutput> {
  readonly contract: SearchHotspotsToolContract;
}

export interface SearchRecommendationsToolInput {
  caseMasterId?: bigint;
  recommendationType?: string;
  minimumConfidence?: number;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface RecommendationMatch {
  recommendationId: string;
  caseMasterId?: bigint;
  recommendationType: string;
  confidence: number;
  priority?: string;
  summary: string;
  reviewStatus?: string;
}

export interface SearchRecommendationsToolOutput {
  matches: RecommendationMatch[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface SearchRecommendationsToolContract extends AiToolContract<SearchRecommendationsToolInput, SearchRecommendationsToolOutput> {
  readonly name: 'searchRecommendations';
  readonly category: 'recommendation';
}

export interface SearchRecommendationsTool extends AiTool<SearchRecommendationsToolInput, SearchRecommendationsToolOutput> {
  readonly contract: SearchRecommendationsToolContract;
}
