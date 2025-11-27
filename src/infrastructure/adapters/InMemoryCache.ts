import { CacheStats, ICache } from 'core/application/ports/ICache';

export interface InMemoryCacheConfig {
  ttl?: number; // Time-to-live en secondes (défaut: 1h)
  maxSize?: number; // Nombre max d'entrées (défaut: illimité)
}

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

/**
 * In-Memory implementation of ICache port
 * Useful for testing and development without Redis
 * This is an adapter in the infrastructure layer
 */
export class InMemoryCache implements ICache {
  private store = new Map<string, CacheEntry<unknown>>();
  private ttl: number;
  private maxSize: number;
  private stats = {
    hits: 0,
    misses: 0,
  };
  private cleanupInterval?: NodeJS.Timeout;

  constructor(config: InMemoryCacheConfig = {}) {
    this.ttl = (config.ttl || 3600) * 1000; // Convert to milliseconds
    this.maxSize = config.maxSize || Infinity;
  }

  async connect(): Promise<void> {
    // Start cleanup interval to remove expired entries
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000); // Clean up every minute
  }

  async disconnect(): Promise<void> {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = undefined;
    }
    this.store.clear();
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    // If max size reached, remove oldest entry
    if (this.store.size >= this.maxSize && !this.store.has(key)) {
      const firstKey = this.store.keys().next().value;
      if (firstKey) {
        this.store.delete(firstKey);
      }
    }

    const expiry = ttl ? ttl * 1000 : this.ttl;
    const entry: CacheEntry<T> = {
      value,
      expiresAt: Date.now() + expiry,
    };

    this.store.set(key, entry);
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
  }

  async clear(): Promise<void> {
    this.store.clear();
  }

  async getStats(): Promise<CacheStats> {
    try {
      // Remove expired entries before counting
      this.cleanup();

      const total = this.stats.hits + this.stats.misses;
      const hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;

      return {
        hits: this.stats.hits,
        misses: this.stats.misses,
        keys: this.store.size,
        hitRate: Math.round(hitRate * 100) / 100,
      };
    } catch {
      return {
        hits: this.stats.hits,
        misses: this.stats.misses,
        keys: 0,
        hitRate: 0,
      };
    }
  }

  async ping(): Promise<boolean> {
    return true; // Always available
  }

  resetStats(): void {
    this.stats.hits = 0;
    this.stats.misses = 0;
  }

  /**
   * Remove expired entries from the cache
   * @private
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Get the number of entries in the cache (including expired)
   * Useful for testing
   */
  size(): number {
    return this.store.size;
  }
}
