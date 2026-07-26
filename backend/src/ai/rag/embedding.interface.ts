import type { RagChunk, RagCollectionName, RagEmbeddingPurpose, RagQuery } from './rag.types';

export interface RagEmbeddingModelProfile {
  provider: string;
  model: string;
  dimensions: number;
  normalized: boolean;
  purpose: RagEmbeddingPurpose;
  supportedCollections: readonly RagCollectionName[];
}

export interface RagEmbeddingVector {
  vector: number[];
  dimensions: number;
  model: string;
}

export interface RagChunkEmbeddingRequest {
  chunk: RagChunk;
  collection: RagCollectionName;
}

export interface RagQueryEmbeddingRequest {
  query: RagQuery;
  collections: readonly RagCollectionName[];
}

export interface RagEmbedder {
  getModelProfile(collection: RagCollectionName): RagEmbeddingModelProfile;
  embedChunk(input: RagChunkEmbeddingRequest): Promise<RagEmbeddingVector>;
  embedQuery(input: RagQueryEmbeddingRequest): Promise<RagEmbeddingVector>;
}
