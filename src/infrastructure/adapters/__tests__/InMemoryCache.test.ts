import { InMemoryCache } from '../InMemoryCache';

describe('InMemoryCache', () => {
  let cache: InMemoryCache;

  beforeEach(() => {
    cache = new InMemoryCache({ ttl: 1 }); // 1 second TTL for tests
  });

  afterEach(async () => {
    await cache.disconnect();
  });

  describe('connect and disconnect', () => {
    it('should connect successfully', async () => {
      await expect(cache.connect()).resolves.not.toThrow();
    });

    it('should disconnect and clear cache', async () => {
      await cache.connect();
      await cache.set('key1', 'value1');

      await cache.disconnect();

      expect(cache.size()).toBe(0);
    });
  });

  describe('get and set', () => {
    beforeEach(async () => {
      await cache.connect();
    });

    it('should store and retrieve a value', async () => {
      await cache.set('test-key', { data: 'test-value' });
      const result = await cache.get('test-key');

      expect(result).toEqual({ data: 'test-value' });
    });

    it('should return null for non-existent key', async () => {
      const result = await cache.get('missing-key');

      expect(result).toBeNull();
    });

    it('should handle different data types', async () => {
      await cache.set('string', 'hello');
      await cache.set('number', 42);
      await cache.set('boolean', true);
      await cache.set('object', { a: 1, b: 2 });
      await cache.set('array', [1, 2, 3]);

      expect(await cache.get('string')).toBe('hello');
      expect(await cache.get('number')).toBe(42);
      expect(await cache.get('boolean')).toBe(true);
      expect(await cache.get('object')).toEqual({ a: 1, b: 2 });
      expect(await cache.get('array')).toEqual([1, 2, 3]);
    });

    it('should overwrite existing key', async () => {
      await cache.set('key', 'value1');
      await cache.set('key', 'value2');

      const result = await cache.get('key');
      expect(result).toBe('value2');
    });

    it('should respect custom TTL', async () => {
      await cache.set('short-lived', 'value', 0.1); // 100ms TTL

      let result = await cache.get('short-lived');
      expect(result).toBe('value');

      // Wait for expiration
      await new Promise((resolve) => setTimeout(resolve, 150));

      result = await cache.get('short-lived');
      expect(result).toBeNull();
    });

    it('should expire entries after default TTL', async () => {
      await cache.set('key', 'value');

      let result = await cache.get('key');
      expect(result).toBe('value');

      // Wait for expiration (TTL is 1 second)
      await new Promise((resolve) => setTimeout(resolve, 1100));

      result = await cache.get('key');
      expect(result).toBeNull();
    });
  });

  describe('del', () => {
    beforeEach(async () => {
      await cache.connect();
    });

    it('should delete a key', async () => {
      await cache.set('key', 'value');
      await cache.del('key');

      const result = await cache.get('key');
      expect(result).toBeNull();
    });

    it('should handle deleting non-existent key', async () => {
      await expect(cache.del('missing-key')).resolves.not.toThrow();
    });
  });

  describe('clear', () => {
    beforeEach(async () => {
      await cache.connect();
    });

    it('should clear all entries', async () => {
      await cache.set('key1', 'value1');
      await cache.set('key2', 'value2');
      await cache.set('key3', 'value3');

      expect(cache.size()).toBe(3);

      await cache.clear();

      expect(cache.size()).toBe(0);
      expect(await cache.get('key1')).toBeNull();
      expect(await cache.get('key2')).toBeNull();
      expect(await cache.get('key3')).toBeNull();
    });
  });

  describe('getStats', () => {
    beforeEach(async () => {
      await cache.connect();
    });

    it('should track hits and misses', async () => {
      await cache.set('key1', 'value1');
      await cache.set('key2', 'value2');

      // 2 hits
      await cache.get('key1');
      await cache.get('key2');

      // 1 miss
      await cache.get('missing-key');

      const stats = await cache.getStats();

      expect(stats.hits).toBe(2);
      expect(stats.misses).toBe(1);
      expect(stats.keys).toBe(2);
      expect(stats.hitRate).toBe(66.67);
    });

    it('should return 0 hit rate when no requests', async () => {
      const stats = await cache.getStats();

      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
      expect(stats.hitRate).toBe(0);
    });

    it('should not count expired entries in keys', async () => {
      await cache.set('key1', 'value1', 0.1); // 100ms TTL
      await cache.set('key2', 'value2', 10); // 10s TTL

      let stats = await cache.getStats();
      expect(stats.keys).toBe(2);

      // Wait for first key to expire
      await new Promise((resolve) => setTimeout(resolve, 150));

      stats = await cache.getStats();
      expect(stats.keys).toBe(1); // Only key2 should remain
    });
  });

  describe('ping', () => {
    it('should always return true', async () => {
      const result = await cache.ping();
      expect(result).toBe(true);
    });
  });

  describe('resetStats', () => {
    beforeEach(async () => {
      await cache.connect();
    });

    it('should reset hit and miss counters', async () => {
      await cache.set('key', 'value');

      await cache.get('key'); // hit
      await cache.get('missing'); // miss

      let stats = await cache.getStats();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);

      cache.resetStats();

      stats = await cache.getStats();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
    });
  });

  describe('maxSize limit', () => {
    it('should enforce max size limit', async () => {
      const limitedCache = new InMemoryCache({ maxSize: 3 });
      await limitedCache.connect();

      await limitedCache.set('key1', 'value1');
      await limitedCache.set('key2', 'value2');
      await limitedCache.set('key3', 'value3');

      expect(limitedCache.size()).toBe(3);

      // Adding a 4th key should remove the oldest (key1)
      await limitedCache.set('key4', 'value4');

      expect(limitedCache.size()).toBe(3);
      expect(await limitedCache.get('key1')).toBeNull(); // Oldest removed
      expect(await limitedCache.get('key2')).toBe('value2');
      expect(await limitedCache.get('key3')).toBe('value3');
      expect(await limitedCache.get('key4')).toBe('value4');

      await limitedCache.disconnect();
    });

    it('should not remove entries when updating existing key', async () => {
      const limitedCache = new InMemoryCache({ maxSize: 2 });
      await limitedCache.connect();

      await limitedCache.set('key1', 'value1');
      await limitedCache.set('key2', 'value2');

      // Update key1 (should not trigger removal)
      await limitedCache.set('key1', 'updated');

      expect(limitedCache.size()).toBe(2);
      expect(await limitedCache.get('key1')).toBe('updated');
      expect(await limitedCache.get('key2')).toBe('value2');

      await limitedCache.disconnect();
    });
  });

  describe('automatic cleanup', () => {
    it('should clean up expired entries periodically', async () => {
      const cleanupCache = new InMemoryCache({ ttl: 0.05 }); // 50ms TTL
      await cleanupCache.connect();

      await cleanupCache.set('key1', 'value1');
      await cleanupCache.set('key2', 'value2');

      expect(cleanupCache.size()).toBe(2);

      // Wait for expiration + cleanup interval
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Trigger stats to force cleanup
      await cleanupCache.getStats();

      expect(cleanupCache.size()).toBe(0);

      await cleanupCache.disconnect();
    }, 10000);
  });

  describe('error handling', () => {
    beforeEach(async () => {
      await cache.connect();
    });

    it('should handle null values gracefully', async () => {
      await cache.set('null-key', null);
      const result = await cache.get('null-key');
      expect(result).toBeNull();
    });

    it('should handle undefined values gracefully', async () => {
      await cache.set('undefined-key', undefined);
      const result = await cache.get('undefined-key');
      expect(result).toBeUndefined();
    });
  });

  describe('concurrent operations', () => {
    beforeEach(async () => {
      await cache.connect();
    });

    it('should handle concurrent get/set operations', async () => {
      const operations = [];

      // Concurrent sets
      for (let i = 0; i < 10; i++) {
        operations.push(cache.set(`key${i}`, `value${i}`));
      }

      await Promise.all(operations);

      // Concurrent gets
      const gets = [];
      for (let i = 0; i < 10; i++) {
        gets.push(cache.get(`key${i}`));
      }

      const results = await Promise.all(gets);

      results.forEach((result, i) => {
        expect(result).toBe(`value${i}`);
      });
    });
  });
});
