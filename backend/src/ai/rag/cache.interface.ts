import type { RagQuery } from './rag.types';
import type { RagRetrieverResult } from './retriever.interface';

export interface RagCacheKey {
  key: string;
  collectionSignature: string;
}

export interface RagCacheEntry {
  createdAt: string;
  expiresAt: string;
  result: RagRetrieverResult;
}

export interface RagCache {
  makeKey(query: RagQuery): RagCacheKey;
  get(key: RagCacheKey): Promise<RagCacheEntry | null>;
  set(key: RagCacheKey, entry: RagCacheEntry): Promise<void>;
  invalidateByCollection(collection: string): Promise<void>;
}
