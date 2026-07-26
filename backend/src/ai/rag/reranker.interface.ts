import type { RagQuery, RagRetrievedChunk } from './rag.types';

export interface RagRerankerRule {
  name: string;
  description: string;
  weight: number;
}

export interface RagRerankerResult {
  reranked: RagRetrievedChunk[];
  appliedRules: RagRerankerRule[];
}

export interface RagReranker {
  rerank(query: RagQuery, chunks: readonly RagRetrievedChunk[]): Promise<RagRerankerResult>;
}
