export interface AiCacheRecord<TValue = unknown> {
  key: string;
  value: TValue;
  ttlSeconds?: number;
  tags?: string[];
}

/**
 * Cache contract for AI execution artifacts.
 *
 * Typical future use cases:
 * - evidence bundle caching
 * - analytics snapshot caching
 * - graph expansion caching
 * - provider response memoization for deterministic prompts
 */
export interface AiCache {
  get<TValue>(key: string): Promise<TValue | null>;
  set<TValue>(record: AiCacheRecord<TValue>): Promise<void>;
  delete(key: string): Promise<void>;
  invalidateByTag(tag: string): Promise<void>;
}
