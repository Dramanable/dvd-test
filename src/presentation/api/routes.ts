import { FastifyInstance } from 'fastify';
import { registerV1Routes } from './v1/routes';

/**
 * Register all API routes
 * @param fastify - Fastify instance
 */
export async function registerRoutes(fastify: FastifyInstance): Promise<void> {
  // Register v1 routes
  await registerV1Routes(fastify);
}
