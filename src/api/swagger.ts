import { FastifyDynamicSwaggerOptions } from '@fastify/swagger';

/**
 * Swagger/OpenAPI configuration
 */
export const swaggerOptions: FastifyDynamicSwaggerOptions = {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'DVD Shop Calculator API',
      description:
        'REST API for calculating DVD prices with Back to the Future promotions. ' +
        'Built with Clean Architecture, TDD, and Fastify.',
      version: '1.0.0',
      contact: {
        name: 'API Support',
        url: 'https://github.com/Dramanable/dvd-test',
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: 'https://api.example.com',
        description: 'Production server',
      },
    ],
    tags: [
      {
        name: 'calculator',
        description: 'DVD price calculation endpoints',
      },
      {
        name: 'health',
        description: 'Health check endpoints',
      },
    ],
    components: {
      schemas: {
        CalculateRequest: {
          type: 'object',
          required: ['movies'],
          properties: {
            movies: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of movie titles to calculate price for',
              example: ['Back to the Future 1', 'Back to the Future 2'],
            },
          },
        },
        CalculateResponse: {
          type: 'object',
          properties: {
            total: {
              type: 'number',
              description: 'Final price in euros after discount',
              example: 27,
            },
            subtotal: {
              type: 'number',
              description: 'Price before discount in euros',
              example: 30,
            },
            discount: {
              type: 'number',
              description: 'Discount amount in euros',
              example: 3,
            },
            discountPercentage: {
              type: 'number',
              description: 'Discount percentage applied (0, 10, or 20)',
              example: 10,
            },
            itemCount: {
              type: 'number',
              description: 'Total number of movies in the cart',
              example: 2,
            },
            uniqueEpisodes: {
              type: 'number',
              description: 'Number of unique Back to the Future episodes',
              example: 2,
            },
            movies: {
              type: 'array',
              description: 'Detailed list of movies with pricing information',
              items: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string',
                    description: 'Movie title',
                    example: 'Back to the Future 1',
                  },
                  type: {
                    type: 'string',
                    description: 'Movie type',
                    enum: ['BACK_TO_THE_FUTURE', 'OTHER'],
                    example: 'BACK_TO_THE_FUTURE',
                  },
                  basePrice: {
                    type: 'number',
                    description: 'Base price of the movie in euros',
                    example: 15,
                  },
                  episodeNumber: {
                    type: 'number',
                    description: 'Episode number (for BTTF movies)',
                    example: 1,
                  },
                },
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error type',
              example: 'Bad Request',
            },
            message: {
              type: 'string',
              description: 'Error message',
              example: 'movies must be an array',
            },
          },
        },
        HealthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              description: 'Service status',
              example: 'ok',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Current server timestamp',
              example: '2025-11-18T15:30:00.000Z',
            },
            uptime: {
              type: 'number',
              description: 'Server uptime in seconds',
              example: 3600,
            },
          },
        },
      },
    },
  },
};

/**
 * Swagger UI configuration
 */
export const swaggerUiOptions = {
  routePrefix: '/api/docs',
  uiConfig: {
    docExpansion: 'list' as const,
    deepLinking: true,
  },
  staticCSP: true,
  transformStaticCSP: (header: string): string => header,
};
