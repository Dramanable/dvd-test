import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DVDCalculator } from '../sdk/DVDCalculator';

/**
 * Request body schema for calculate endpoint
 */
interface CalculateRequest {
  Body: {
    movies: string[];
  };
}

/**
 * Register API routes
 * @param fastify - Fastify instance
 */
export async function registerRoutes(fastify: FastifyInstance): Promise<void> {
  // POST /api/calculate - Calculate DVD prices
  fastify.post<CalculateRequest>(
    '/api/calculate',
    {
      schema: {
        tags: ['calculator'],
        summary: 'Calculate total price for DVD movies',
        body: {
          type: 'object',
          required: ['movies'],
          properties: {
            movies: {
              type: 'array',
              items: { type: 'string' },
            },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              total: { type: 'number' },
              subtotal: { type: 'number' },
              discount: { type: 'number' },
              discountPercentage: { type: 'number' },
              itemCount: { type: 'number' },
              uniqueEpisodes: { type: 'number' },
              movies: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    type: { type: 'string' },
                    basePrice: { type: 'number' },
                    episodeNumber: { type: 'number' },
                  },
                },
              },
            },
          },
          400: {
            type: 'object',
            properties: {
              error: { type: 'string' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<CalculateRequest>, reply: FastifyReply) => {
      try {
        const { movies } = request.body;

        // Validation
        if (!Array.isArray(movies)) {
          return reply.code(400).send({
            error: 'Bad Request',
            message: 'movies must be an array',
          });
        }

        // Check if all items are strings
        if (movies.some((movie) => typeof movie !== 'string')) {
          return reply.code(400).send({
            error: 'Bad Request',
            message: 'All movies must be strings',
          });
        }

        // Calculate price using SDK
        const calculator = new DVDCalculator();
        const result = calculator.calculateWithDetails(movies);

        return reply.code(200).send(result);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return reply.code(500).send({
          error: 'Internal Server Error',
          message: errorMessage,
        });
      }
    }
  );

  // GET /health - Health check
  fastify.get(
    '/health',
    {
      schema: {
        tags: ['health'],
        summary: 'Health check endpoint',
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string' },
              timestamp: { type: 'string' },
              uptime: { type: 'number' },
            },
          },
        },
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      return reply.code(200).send({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    }
  );
}
