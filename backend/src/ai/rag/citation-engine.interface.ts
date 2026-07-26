import type { RagCitation, RagRetrievedChunk } from './rag.types';

export interface RagCitationBuildResult {
  citations: RagCitation[];
  duplicateSourceIdsRemoved: string[];
}

export interface RagCitationEngine {
  buildCitations(chunks: readonly RagRetrievedChunk[]): Promise<RagCitationBuildResult>;
}
