import { CacheStats, ICache } from 'core/application/ports/ICache';
import Redis from 'ioredis';

export interface CacheConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
  ttl?: number; // Time-to-live en secondes (défaut: 1h)
}

/**
 * Redis implementation of ICache port
 * This is an adapter in the infrastructure layer
 */
export class RedisCache implements ICache {
  private client: Redis;
  private ttl: number;
  private stats = {
    hits: 0,
    misses: 0,
  };

  constructor(config: CacheConfig) {
    this.client = new Redis({
      host: config.host,
      port: config.port,
      password: config.password,
      db: config.db || 0,
      keyPrefix: config.keyPrefix || 'dvd:',
      retryStrategy: (times): number => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      lazyConnect: true,
    });

    this.ttl = config.ttl || 3600; // 1 heure par défaut

    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    this.client.on('connect', () => {
      // Connection successful - logging handled by server
    });
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.client.quit();
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      if (value) {
        this.stats.hits++;
        return JSON.parse(value) as T;
      }
      this.stats.misses++;
      return null;
    } catch (error) {
      console.error(`Cache GET error for key ${key}:`, error);
      this.stats.misses++;
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      const expiry = ttl || this.ttl;
      await this.client.setex(key, expiry, serialized);
    } catch (error) {
      console.error(`Cache SET error for key ${key}:`, error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error(`Cache DEL error for key ${key}:`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      await this.client.flushdb();
      // eslint-disable-next-line no-console
      console.info('Cache cleared successfully');
    } catch {
      // Silently fail on cache clear errors
    }
  }

  async getStats(): Promise<CacheStats> {
    try {
      const keys = await this.client.dbsize();
      const total = this.stats.hits + this.stats.misses;
      const hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;

      return {
        hits: this.stats.hits,
        misses: this.stats.misses,
        keys,
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
    try {
      const result = await this.client.ping();
      return result === 'PONG';
    } catch {
      return false;
    }
  }

  resetStats(): void {
    this.stats.hits = 0;
    this.stats.misses = 0;
  }
}
