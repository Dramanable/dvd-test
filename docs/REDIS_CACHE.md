# Redis Cache Setup

## Overview

The DVD Calculator API includes an optional Redis caching layer that significantly improves performance for repeated calculations with the same movie combinations.

## Features

- **Smart Caching**: Caches calculation results based on sorted movie titles
- **Automatic TTL**: Cache entries expire after 1 hour by default
- **Hit/Miss Statistics**: Track cache performance via `/metrics` endpoint
- **Graceful Fallback**: API works without Redis, cache is optional

## Local Development with Docker Compose

### Start Redis with the API

```bash
docker-compose up
```

This starts:
- API server on port 5000
- Redis on port 6379

### Start Redis Only

```bash
docker-compose up redis
```

### Stop Services

```bash
docker-compose down
```

## Local Development without Docker

### Install Redis

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
```

**macOS (Homebrew):**
```bash
brew install redis
brew services start redis
```

**Windows:**
Download from [Redis Windows releases](https://github.com/microsoftarchive/redis/releases)

### Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env and set:
REDIS_ENABLED=true
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Start the API

```bash
npm run dev
```

## Testing Cache Behavior

### 1. Make a calculation request

```bash
curl -X POST http://localhost:5000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"movies": ["Star Wars Episode IV", "Star Wars Episode V"]}'
```

### 2. Check cache statistics

```bash
curl http://localhost:5000/metrics
```

Look for the `cache` section:
```json
{
  "cache": {
    "hits": 5,
    "misses": 3,
    "keys": 12,
    "hit_rate_percent": 62.5
  }
}
```

### 3. Make the same request again

The second request will be served from cache (faster response time).

## Cache Key Strategy

Cache keys are generated from **sorted movie titles**:

```
Input: ["Star Wars IV", "Star Wars V"]
Cache Key: "calculate:Star Wars IV:Star Wars V"

Input: ["Star Wars V", "Star Wars IV"]  (different order)
Cache Key: "calculate:Star Wars IV:Star Wars V"  (same key!)
```

This ensures identical movie combinations hit the cache regardless of input order.

## Cache Invalidation

Currently, there's no automatic cache invalidation. Cache entries expire after:
- **1 hour** (3600 seconds) by default
- Custom TTL can be configured in code

## Performance Impact

**Without Cache:**
- Calculation: ~2-5ms per request

**With Cache:**
- Cache hit: ~0.5-1ms per request
- Cache miss: ~2-5ms (same as without cache)

**Expected improvement:** 50-80% faster response times for repeated calculations.

## Monitoring

### Health Check

```bash
curl http://localhost:5000/health
```

Response includes Redis status:
```json
{
  "status": "ok",
  "dependencies": {
    "redis": "connected"
  }
}
```

### Cache Metrics

```bash
curl http://localhost:5000/metrics
```

Provides:
- **hits**: Number of cache hits
- **misses**: Number of cache misses
- **keys**: Total keys in cache
- **hit_rate_percent**: Cache hit rate percentage

## Production Considerations

### 1. Redis Persistence

Configure Redis to persist data to disk:

```
# redis.conf
appendonly yes
appendfsync everysec
```

### 2. Memory Management

Set a max memory limit:

```
# redis.conf
maxmemory 256mb
maxmemory-policy allkeys-lru
```

### 3. Security

- Use password authentication: `requirepass your-strong-password`
- Bind to specific interface: `bind 127.0.0.1`
- Enable TLS for remote connections

### 4. Monitoring

Monitor Redis with:
- `redis-cli INFO`
- `redis-cli MONITOR`
- Prometheus exporters
- Cloud provider dashboards (AWS ElastiCache, Azure Cache, etc.)

## Troubleshooting

### Cache Not Working

Check if Redis is enabled:
```bash
echo $REDIS_ENABLED  # Should be "true"
```

Check if Redis is running:
```bash
redis-cli ping  # Should return "PONG"
```

Check application logs:
```
[INFO] Redis cache connected
```

### Connection Refused

Ensure Redis is running:
```bash
sudo systemctl status redis-server  # Linux
brew services list | grep redis     # macOS
```

Check Redis port:
```bash
netstat -an | grep 6379
```

### High Memory Usage

Check cache size:
```bash
redis-cli DBSIZE
```

Clear cache if needed:
```bash
redis-cli FLUSHDB
```

Or via API:
```bash
# Note: No clear endpoint exposed yet for security
# Use redis-cli or add authenticated admin endpoint
```

## Disabling Cache

To run without Redis:

```bash
# In .env
REDIS_ENABLED=false
```

Or don't set `REDIS_ENABLED` at all (defaults to disabled).

## Further Reading

- [Redis Documentation](https://redis.io/documentation)
- [Redis Best Practices](https://redis.io/docs/manual/patterns/)
- [ioredis Client](https://github.com/luin/ioredis)
