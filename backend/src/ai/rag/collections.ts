import type { RagChunkingStrategy, RagCollectionName, RagEmbeddingPurpose, RagSensitivityLevel } from './rag.types';

export interface RagCollectionDefinition {
  name: RagCollectionName;
  displayName: string;
  purpose: string;
  primarySources: readonly string[];
  chunkingStrategy: readonly RagChunkingStrategy[];
  embeddingPurpose: RagEmbeddingPurpose;
  defaultSensitivity: RagSensitivityLevel;
  supportsCaseScopedRetrieval: boolean;
  supportsDistrictScopedRetrieval: boolean;
  supportsLegalSearch: boolean;
  notes?: readonly string[];
}

export const RAG_COLLECTIONS: readonly RagCollectionDefinition[] = [
  {
    name: 'legal',
    displayName: 'Legal Knowledge',
    purpose: 'Cross-legal reasoning support for acts, sections, punishments, and legal interpretation.',
    primarySources: ['laws.csv', 'legal manuals', 'legal reference documents'],
    chunkingStrategy: ['by_act', 'by_section', 'by_topic'],
    embeddingPurpose: 'legal_reasoning',
    defaultSensitivity: 'restricted',
    supportsCaseScopedRetrieval: false,
    supportsDistrictScopedRetrieval: false,
    supportsLegalSearch: true,
  },
  {
    name: 'fir',
    displayName: 'FIR Narratives',
    purpose: 'Case similarity, incident understanding, and investigation context retrieval.',
    primarySources: ['FIR_Details_Data.csv', 'FIR briefs', 'case narratives'],
    chunkingStrategy: ['by_case', 'by_narrative_segment'],
    embeddingPurpose: 'case_similarity',
    defaultSensitivity: 'confidential',
    supportsCaseScopedRetrieval: true,
    supportsDistrictScopedRetrieval: true,
    supportsLegalSearch: false,
  },
  {
    name: 'crime_reports',
    displayName: 'Crime Reports',
    purpose: 'Narrative crime review and reporting support from monthly and annual crime reviews.',
    primarySources: ['crime review PDFs', 'monthly crime review reports'],
    chunkingStrategy: ['by_report_section', 'by_topic'],
    embeddingPurpose: 'analytics_explanation',
    defaultSensitivity: 'restricted',
    supportsCaseScopedRetrieval: false,
    supportsDistrictScopedRetrieval: true,
    supportsLegalSearch: false,
  },
  {
    name: 'police_sop',
    displayName: 'Police SOP',
    purpose: 'Procedural guidance for FIR validation, investigation workflow, evidence handling, and reporting.',
    primarySources: ['police manuals', 'SOP PDFs', 'workflow guidance'],
    chunkingStrategy: ['by_topic', 'by_report_section'],
    embeddingPurpose: 'procedural_guidance',
    defaultSensitivity: 'restricted',
    supportsCaseScopedRetrieval: false,
    supportsDistrictScopedRetrieval: false,
    supportsLegalSearch: true,
  },
  {
    name: 'acts',
    displayName: 'Acts',
    purpose: 'Act-level retrieval for legal context, applicability, and statutory lookup.',
    primarySources: ['indian_laws_and_acts_v2.csv'],
    chunkingStrategy: ['by_act'],
    embeddingPurpose: 'legal_reasoning',
    defaultSensitivity: 'restricted',
    supportsCaseScopedRetrieval: false,
    supportsDistrictScopedRetrieval: false,
    supportsLegalSearch: true,
  },
  {
    name: 'ipc',
    displayName: 'IPC and Section Knowledge',
    purpose: 'Section-level legal retrieval for IPC/BNS recommendation, explanation, and citation.',
    primarySources: ['ipc_sections.csv'],
    chunkingStrategy: ['by_section'],
    embeddingPurpose: 'legal_reasoning',
    defaultSensitivity: 'restricted',
    supportsCaseScopedRetrieval: false,
    supportsDistrictScopedRetrieval: false,
    supportsLegalSearch: true,
  },
  {
    name: 'victim_statistics',
    displayName: 'Victim Statistics',
    purpose: 'Victim demographic, trend, and segmentation support for analysis and reporting.',
    primarySources: ['VICTIMS_OF_KA_2013.csv', 'VICTIM_OF_MURDER_2013.csv'],
    chunkingStrategy: ['by_table_row', 'by_metric_block'],
    embeddingPurpose: 'demographic_analysis',
    defaultSensitivity: 'restricted',
    supportsCaseScopedRetrieval: false,
    supportsDistrictScopedRetrieval: true,
    supportsLegalSearch: false,
  },
  {
    name: 'crime_analytics',
    displayName: 'Crime Analytics',
    purpose: 'Trend, district comparison, hotspot interpretation, and analytics-grounded explanation support.',
    primarySources: ['CRIME_REVIEW_2021_TO_2024.csv', 'monthly crime review CSVs'],
    chunkingStrategy: ['by_table_row', 'by_metric_block', 'by_topic'],
    embeddingPurpose: 'analytics_explanation',
    defaultSensitivity: 'restricted',
    supportsCaseScopedRetrieval: false,
    supportsDistrictScopedRetrieval: true,
    supportsLegalSearch: false,
  },
] as const;
