import type { RagCache, RagCacheKey, RagCacheEntry } from '../cache.interface';
import type { RagQuery } from '../rag.types';
import crypto from 'crypto';

export class MemoryRagCache implements RagCache {
  private cache = new Map<string, RagCacheEntry>();

  public makeKey(query: RagQuery): RagCacheKey {
    // Generate a deterministic hash based on query text and filters
    const filterString = query.filters ? JSON.stringify(query.filters) : '';
    const raw = `${query.query}_${filterString}_${query.topK || 5}`;
    const hash = crypto.createHash('md5').update(raw).digest('hex');
    
    return {
      key: hash,
      collectionSignature: query.filters?.collections?.join(',') || 'all',
    };
  }

  public async get(key: RagCacheKey): Promise<RagCacheEntry | null> {
    const entry = this.cache.get(key.key);
    if (!entry) return null;
    
    // Check expiration
    if (new Date(entry.expiresAt).getTime() < Date.now()) {
      this.cache.delete(key.key);
      return null;
    }
    
    return entry;
  }

  public async set(key: RagCacheKey, entry: RagCacheEntry): Promise<void> {
    this.cache.set(key.key, entry);
  }

  public async invalidateByCollection(collection: string): Promise<void> {
    for (const [key, entry] of this.cache.entries()) {
      if (entry.result.selectedCollections.includes(collection as any)) {
        this.cache.delete(key);
      }
    }
  }
}
