import Fastify, { FastifyInstance } from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifyCors from '@fastify/cors';
import { swaggerOptions, swaggerUiOptions } from './swagger';
import { registerRoutes } from './routes';

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

  // Register CORS
  server.register(fastifyCors, {
    origin: true, // Allow all origins in development
    credentials: true,
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
