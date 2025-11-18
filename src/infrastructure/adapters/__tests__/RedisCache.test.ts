/* eslint-disable @typescript-eslint/no-explicit-any */
import { RedisCache } from '../RedisCache';

// Mock ioredis
jest.mock('ioredis', () => {
  const mRedis = {
    connect: jest.fn().mockResolvedValue(undefined),
    quit: jest.fn().mockResolvedValue(undefined),
    get: jest.fn(),
    setex: jest.fn().mockResolvedValue('OK'),
    del: jest.fn().mockResolvedValue(1),
    flushdb: jest.fn().mockResolvedValue('OK'),
    dbsize: jest.fn().mockResolvedValue(0),
    ping: jest.fn().mockResolvedValue('PONG'),
    on: jest.fn(),
  };
  return jest.fn(() => mRedis);
});

describe('RedisCache', () => {
  let cache: RedisCache;
  let mockRedis: any;

  beforeEach(() => {
    cache = new RedisCache({
      host: 'localhost',
      port: 6379,
      ttl: 3600,
    });
    // Get the mocked Redis instance
    mockRedis = (cache as any).client;
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await cache.disconnect();
  });

  describe('connect', () => {
    it('should connect to Redis successfully', async () => {
      await expect(cache.connect()).resolves.not.toThrow();
      expect(mockRedis.connect).toHaveBeenCalledTimes(1);
    });

    it('should handle connection errors', async () => {
      mockRedis.connect.mockRejectedValueOnce(new Error('Connection failed'));
      await expect(cache.connect()).rejects.toThrow('Connection failed');
    });
  });

  describe('disconnect', () => {
    it('should disconnect from Redis', async () => {
      await cache.disconnect();
      expect(mockRedis.quit).toHaveBeenCalledTimes(1);
    });
  });

  describe('get', () => {
    it('should return cached value and increment hits', async () => {
      const testData = { price: 100, discount: 10 };
      mockRedis.get.mockResolvedValueOnce(JSON.stringify(testData));

      const result = await cache.get('test-key');

      expect(result).toEqual(testData);
      expect(mockRedis.get).toHaveBeenCalledWith('test-key');

      const stats = await cache.getStats();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(0);
    });

    it('should return null for cache miss and increment misses', async () => {
      mockRedis.get.mockResolvedValueOnce(null);

      const result = await cache.get('missing-key');

      expect(result).toBeNull();
      expect(mockRedis.get).toHaveBeenCalledWith('missing-key');

      const stats = await cache.getStats();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(1);
    });

    it('should handle errors gracefully', async () => {
      mockRedis.get.mockRejectedValueOnce(new Error('Redis error'));

      const result = await cache.get('error-key');

      expect(result).toBeNull();
      const stats = await cache.getStats();
      expect(stats.misses).toBe(1);
    });

    it('should handle invalid JSON gracefully', async () => {
      mockRedis.get.mockResolvedValueOnce('invalid json');

      const result = await cache.get('invalid-json-key');

      expect(result).toBeNull();
      const stats = await cache.getStats();
      expect(stats.misses).toBe(1);
    });
  });

  describe('set', () => {
    it('should cache value with default TTL', async () => {
      const testData = { price: 100 };

      await cache.set('test-key', testData);

      expect(mockRedis.setex).toHaveBeenCalledWith('test-key', 3600, JSON.stringify(testData));
    });

    it('should cache value with custom TTL', async () => {
      const testData = { price: 100 };

      await cache.set('test-key', testData, 1800);

      expect(mockRedis.setex).toHaveBeenCalledWith('test-key', 1800, JSON.stringify(testData));
    });

    it('should handle errors gracefully', async () => {
      mockRedis.setex.mockRejectedValueOnce(new Error('Redis error'));

      await expect(cache.set('error-key', { data: 'test' })).resolves.not.toThrow();
    });
  });

  describe('del', () => {
    it('should delete key from cache', async () => {
      await cache.del('test-key');

      expect(mockRedis.del).toHaveBeenCalledWith('test-key');
    });

    it('should handle errors gracefully', async () => {
      mockRedis.del.mockRejectedValueOnce(new Error('Redis error'));

      await expect(cache.del('error-key')).resolves.not.toThrow();
    });
  });

  describe('clear', () => {
    it('should flush the database', async () => {
      await cache.clear();

      expect(mockRedis.flushdb).toHaveBeenCalledTimes(1);
    });

    it('should handle errors gracefully', async () => {
      mockRedis.flushdb.mockRejectedValueOnce(new Error('Redis error'));

      await expect(cache.clear()).resolves.not.toThrow();
    });
  });

  describe('getStats', () => {
    it('should return cache statistics with hit rate', async () => {
      mockRedis.dbsize.mockResolvedValueOnce(42);

      // Simulate some cache hits and misses
      mockRedis.get.mockResolvedValueOnce(JSON.stringify({ data: 'hit1' }));
      mockRedis.get.mockResolvedValueOnce(JSON.stringify({ data: 'hit2' }));
      mockRedis.get.mockResolvedValueOnce(null); // miss

      await cache.get('key1');
      await cache.get('key2');
      await cache.get('key3');

      const stats = await cache.getStats();

      expect(stats).toEqual({
        hits: 2,
        misses: 1,
        keys: 42,
        hitRate: 66.67,
      });
    });

    it('should return 0 hit rate when no requests', async () => {
      mockRedis.dbsize.mockResolvedValueOnce(0);

      const stats = await cache.getStats();

      expect(stats.hitRate).toBe(0);
    });

    it('should handle dbsize errors gracefully', async () => {
      mockRedis.dbsize.mockRejectedValueOnce(new Error('Redis error'));

      const stats = await cache.getStats();

      expect(stats.keys).toBe(0);
      expect(stats.hitRate).toBe(0);
    });
  });

  describe('ping', () => {
    it('should return true when Redis responds with PONG', async () => {
      const result = await cache.ping();

      expect(result).toBe(true);
      expect(mockRedis.ping).toHaveBeenCalledTimes(1);
    });

    it('should return false on error', async () => {
      mockRedis.ping.mockRejectedValueOnce(new Error('Connection failed'));

      const result = await cache.ping();

      expect(result).toBe(false);
    });
  });

  describe('resetStats', () => {
    it('should reset hit and miss counters', async () => {
      mockRedis.get.mockResolvedValueOnce(JSON.stringify({ data: 'test' }));
      mockRedis.get.mockResolvedValueOnce(null);

      await cache.get('key1');
      await cache.get('key2');

      let stats = await cache.getStats();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);

      cache.resetStats();

      stats = await cache.getStats();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
    });
  });
});
