import type { AiRequestContext } from '../shared/ai-request.types';
import type { AiSourceReference, AiWarning } from '../shared/ai-result.types';

export type RagCollectionName =
  | 'legal'
  | 'fir'
  | 'crime_reports'
  | 'police_sop'
  | 'acts'
  | 'ipc'
  | 'victim_statistics'
  | 'crime_analytics';

export type RagSensitivityLevel = 'public' | 'restricted' | 'confidential' | 'highly_confidential';
export type RagReviewStatus = 'draft' | 'reviewed' | 'approved' | 'deprecated';
export type RagChunkingStrategy =
  | 'by_act'
  | 'by_section'
  | 'by_case'
  | 'by_narrative_segment'
  | 'by_report_section'
  | 'by_topic'
  | 'by_table_row'
  | 'by_metric_block';

export type RagEmbeddingPurpose =
  | 'legal_reasoning'
  | 'case_similarity'
  | 'analytics_explanation'
  | 'procedural_guidance'
  | 'demographic_analysis';

export type RagRetrievalMode = 'hybrid' | 'semantic' | 'lexical' | 'metadata_only';

export interface RagDocumentMetadata {
  documentId: string;
  collection: RagCollectionName;
  sourceTitle: string;
  sourceDataset?: string;
  sourceType: 'csv' | 'pdf' | 'database_record' | 'generated_report' | 'manual';
  caseMasterId?: bigint;
  districtId?: number;
  unitId?: number;
  actCode?: string;
  sectionCode?: string;
  reportingPeriod?: string;
  sensitivityLevel: RagSensitivityLevel;
  reviewStatus: RagReviewStatus;
  checksum?: string;
  version?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RagChunkMetadata extends RagDocumentMetadata {
  chunkId: string;
  chunkIndex: number;
  chunkingStrategy: RagChunkingStrategy;
  tokenCount?: number;
  parentHeading?: string;
  subsection?: string;
  keywords?: string[];
}

export interface RagChunk {
  metadata: RagChunkMetadata;
  text: string;
}

export interface RagQueryFilter {
  collections?: readonly RagCollectionName[];
  districtIds?: readonly number[];
  unitIds?: readonly number[];
  caseMasterIds?: readonly bigint[];
  actCodes?: readonly string[];
  sectionCodes?: readonly string[];
  sensitivityLevels?: readonly RagSensitivityLevel[];
  reviewStatuses?: readonly RagReviewStatus[];
  reportingPeriods?: readonly string[];
}

export interface RagQuery {
  query: string;
  context: AiRequestContext;
  intent?: string;
  filters?: RagQueryFilter;
  topK?: number;
  retrievalMode?: RagRetrievalMode;
}

export interface RagRetrievedChunk {
  chunk: RagChunk;
  lexicalScore?: number;
  semanticScore?: number;
  metadataScore?: number;
  rerankScore?: number;
  finalScore: number;
  reasons: string[];
}

export interface RagCitation {
  citationId: string;
  source: AiSourceReference;
  chunkId: string;
  excerpt: string;
  relevanceScore: number;
}

export interface RagContextWindow {
  collectionOrder: RagCollectionName[];
  querySummary: string;
  chunks: RagRetrievedChunk[];
  citations: RagCitation[];
  warnings: AiWarning[];
  totalEstimatedTokens: number;
}

export interface RagPromptContext {
  systemInstructionsKey: string;
  userQuery: string;
  collectionHints: RagCollectionName[];
  evidenceSummary: string[];
  citations: RagCitation[];
  contextWindow: RagContextWindow;
}
