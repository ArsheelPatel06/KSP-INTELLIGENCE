import type { RagChunk, RagCollectionName, RagQueryFilter, RagRetrievedChunk } from './rag.types';
import type { RagEmbeddingVector } from './embedding.interface';

export interface RagVectorStoreUpsertRecord {
  chunk: RagChunk;
  embedding: RagEmbeddingVector;
}

export interface RagVectorStoreSearchRequest {
  collection: RagCollectionName;
  queryEmbedding: RagEmbeddingVector;
  filter?: RagQueryFilter;
  topK: number;
}

export interface RagVectorStore {
  upsert(records: readonly RagVectorStoreUpsertRecord[]): Promise<void>;
  search(request: RagVectorStoreSearchRequest): Promise<RagRetrievedChunk[]>;
  deleteByDocumentId(collection: RagCollectionName, documentId: string): Promise<void>;
}
