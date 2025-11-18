/**
 * Port (interface) for caching
 * This abstraction belongs to the application layer
 * Implementations will be in the infrastructure layer
 */

export interface CacheStats {
  hits: number;
  misses: number;
  keys: number;
  hitRate: number;
}

export interface ICache {
  /**
   * Connect to the cache backend
   */
  connect(): Promise<void>;

  /**
   * Disconnect from the cache backend
   */
  disconnect(): Promise<void>;

  /**
   * Retrieve a value from cache
   * @param key Cache key
   * @returns The cached value or null if not found
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Store a value in cache
   * @param key Cache key
   * @param value Value to cache
   * @param ttl Optional time-to-live in seconds
   */
  set<T>(key: string, value: T, ttl?: number): Promise<void>;

  /**
   * Delete a value from cache
   * @param key Cache key
   */
  del(key: string): Promise<void>;

  /**
   * Clear all cache entries
   */
  clear(): Promise<void>;

  /**
   * Get cache statistics
   */
  getStats(): Promise<CacheStats>;

  /**
   * Check if cache is responsive
   */
  ping(): Promise<boolean>;

  /**
   * Reset statistics counters
   */
  resetStats(): void;
}
