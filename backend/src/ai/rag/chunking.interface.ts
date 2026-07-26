import type { RagChunk, RagDocumentMetadata } from './rag.types';

export interface RagChunkingRule {
  maxTokensPerChunk: number;
  overlapTokens: number;
  preserveHeadings: boolean;
  preserveTables: boolean;
  preserveSectionIdentifiers: boolean;
  splitOnParagraphsFirst: boolean;
  notes?: readonly string[];
}

export interface RagChunkingStrategyDefinition {
  collection: string;
  purpose: string;
  rule: RagChunkingRule;
}

export interface RagChunkerInput {
  documentId: string;
  rawText: string;
  metadata: RagDocumentMetadata;
}

export interface RagChunkerOutput {
  chunks: RagChunk[];
  estimatedTokenCount: number;
  warnings: string[];
}

export interface RagChunker {
  chunk(input: RagChunkerInput): Promise<RagChunkerOutput>;
  getStrategy(collection: RagDocumentMetadata['collection']): RagChunkingStrategyDefinition;
}
