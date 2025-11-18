import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  DVDCalculatorService,
  type CalculationDetails,
} from '../../../application/services/DVDCalculatorService';
import { ArrayInputParser } from '../../../infrastructure/adapters/ArrayInputParser';

/**
 * Build API response using DVDCalculatorService with dependency inversion
 * Presentation layer: Only DI and REST formatting
 * No business logic - delegates to application/domain layers via service
 */
function buildApiResponse(movies: string[]): CalculationDetails {
  // Dependency Inversion: Inject ArrayInputParser adapter into service
  const inputParser = new ArrayInputParser(movies);
  const service = new DVDCalculatorService(inputParser);

  // Calculate with details using application service (business logic in application/domain)
  const result = service.runWithDetails(''); // Input ignored, array already in parser

  // Return result (already formatted by service)
  return result;
}

/**
 * Request body schema for calculate endpoint
 */
interface CalculateRequest {
  Body: {
    movies: string[];
  };
}

/**
 * Register API v1 routes
 * @param fastify - Fastify instance
 */
export async function registerV1Routes(fastify: FastifyInstance): Promise<void> {
  // POST /v1/calculate - Calculate DVD prices
  fastify.post<CalculateRequest>(
    '/v1/calculate',
    {
      schema: {
        tags: ['calculator-v1'],
        summary: 'Calculate total price for DVD movies (v1)',
        description: 'Version 1 of the calculation endpoint with full movie details',
        body: {
          type: 'object',
          required: ['movies'],
          properties: {
            movies: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of movie titles',
            },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              total: { type: 'number', description: 'Total price after discount' },
              subtotal: { type: 'number', description: 'Subtotal before discount' },
              discount: { type: 'number', description: 'Discount amount' },
              discountPercentage: { type: 'number', description: 'Discount percentage' },
              itemCount: { type: 'number', description: 'Total number of items' },
              uniqueEpisodes: { type: 'number', description: 'Number of unique episodes' },
              movies: {
                type: 'array',
                description: 'Detailed movie information',
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

        // Generate cache key from sorted movie titles
        const cacheKey = `calculate:v1:${[...movies].sort().join(':')}`;

        // Try to get from cache if available
        if (request.server.cache) {
          const cached = await request.server.cache.get(cacheKey);
          if (cached) {
            return reply.code(200).send(cached);
          }
        }

        // Calculate using application layer (use case) and domain entities
        // Presentation layer only handles HTTP/REST concerns and data transformation
        const result = buildApiResponse(movies);

        // Store in cache if available
        if (request.server.cache) {
          await request.server.cache.set(cacheKey, result, 3600); // 1 hour TTL
        }

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

  // GET /v1/health - Health check for v1 API
  fastify.get(
    '/v1/health',
    {
      schema: {
        tags: ['health-v1'],
        summary: 'Health check endpoint for v1 API',
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string' },
              version: { type: 'string' },
              apiVersion: { type: 'string' },
              timestamp: { type: 'string' },
            },
          },
        },
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      return reply.code(200).send({
        status: 'ok',
        version: process.env.npm_package_version || '1.0.0',
        apiVersion: 'v1',
        timestamp: new Date().toISOString(),
      });
    }
  );
}
