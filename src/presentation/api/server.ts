import fastifyCompress from '@fastify/compress';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import Fastify, { FastifyInstance } from 'fastify';
import { RedisCache } from '../../infrastructure/adapters/RedisCache';
import { registerRoutes } from './routes';
import { swaggerOptions, swaggerUiOptions } from './swagger';

/**
 * Build and configure Fastify server
 * @param opts - Fastify options
 * @returns Configured Fastify instance
 */
export function buildServer(opts = {}): FastifyInstance {
  const server = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
    },
    ...opts,
  });

  // Initialize Redis cache if enabled
  if (process.env.REDIS_ENABLED === 'true') {
    const cache = new RedisCache({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD,
      ttl: 3600, // 1 hour
    });

    // Attach cache to server for use in routes
    server.decorate('cache', cache);

    // Connect to Redis
    cache
      .connect()
      .then(() => server.log.info('Redis cache connected'))
      .catch((err) => server.log.error('Redis cache connection failed:', err));

    // Cleanup on server close
    server.addHook('onClose', async () => {
      await cache.disconnect();
    });
  }

  // Register Helmet for security headers
  server.register(fastifyHelmet, {
    // Disable contentSecurityPolicy for Swagger UI to work
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'validator.swagger.io'],
      },
    },
  });

  // Register Compression (gzip/brotli)
  server.register(fastifyCompress, {
    global: true,
    threshold: 1024, // Only compress responses larger than 1KB
    encodings: ['gzip', 'deflate', 'br'],
  });

  // Register Rate Limiting
  server.register(fastifyRateLimit, {
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    timeWindow: parseInt(process.env.RATE_LIMIT_TIMEWINDOW || '60000', 10), // 1 minute
    ban: 5, // Ban after 5 violations
    cache: 10000, // Cache 10k IPs
    allowList: ['127.0.0.1'], // Whitelist localhost
    redis: process.env.REDIS_URL, // Use Redis if available
    nameSpace: 'dvd-calculator-rl-',
    continueExceeding: true,
    skipOnError: true, // Don't fail if Redis is unavailable
  });

  // Register CORS
  server.register(fastifyCors, {
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://yourdomain.com', 'https://api.yourdomain.com']
        : true, // Allow all origins in development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  // Register Swagger
  server.register(fastifySwagger, swaggerOptions);

  // Register Swagger UI
  server.register(fastifySwaggerUi, swaggerUiOptions);

  // Register routes
  server.register(registerRoutes);

  return server;
}

/**
 * Start the Fastify server
 * @param port - Port number to listen on
 * @param host - Host to bind to
 * @returns Promise<FastifyInstance>
 */
export async function startServer(
  port: number = 3000,
  host: string = '0.0.0.0'
): Promise<FastifyInstance> {
  const server = buildServer();

  try {
    await server.listen({ port, host });
    server.log.info(`Server listening on http://${host}:${port}`);
    server.log.info(`Swagger docs available at http://${host}:${port}/api/docs`);
    return server;
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}
