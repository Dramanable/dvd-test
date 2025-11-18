/**
 * End-to-End tests for the REST API
 * These tests start a real server and make HTTP requests
 */

import { FastifyInstance } from 'fastify';
import { buildServer } from '../server';

describe('API E2E Tests', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    // Create server without cache for tests
    server = buildServer({ logger: false });
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  describe('POST /v1/calculate', () => {
    it('should calculate price for 3 different BTTF movies (20% discount)', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/v1/calculate',
        payload: {
          movies: ['Back to the Future 1', 'Back to the Future 2', 'Back to the Future 3'],
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.total).toBe(36);
      expect(body.movies).toBeDefined();
      expect(body.discountPercentage).toBe(20);
    });

    it('should calculate price for 2 different BTTF movies (10% discount)', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/v1/calculate',
        payload: {
          movies: ['Back to the Future 1', 'Back to the Future 3'],
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.total).toBe(27);
      expect(body.discountPercentage).toBe(10);
    });

    it('should calculate price for 1 BTTF movie (no discount)', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/v1/calculate',
        payload: {
          movies: ['Back to the Future 1'],
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.total).toBe(15);
      expect(body.discountPercentage).toBe(0);
    });

    it('should calculate price for 4 BTTF movies with 3 different episodes', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/v1/calculate',
        payload: {
          movies: [
            'Back to the Future 1',
            'Back to the Future 2',
            'Back to the Future 3',
            'Back to the Future 2',
          ],
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.total).toBe(48);
      expect(body.discountPercentage).toBe(20);
    });

    it('should calculate price for mixed BTTF and other movies', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/v1/calculate',
        payload: {
          movies: [
            'Back to the Future 1',
            'Back to the Future 2',
            'Back to the Future 3',
            'La chèvre',
          ],
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.total).toBe(56);
    });

    it('should handle empty movie list', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/v1/calculate',
        payload: {
          movies: [],
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.total).toBe(0);
    });

    it('should return 400 for invalid request (missing movies field)', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/v1/calculate',
        payload: {},
      });

      expect(response.statusCode).toBe(400);
    });

    it('should handle roman numerals in movie titles', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/v1/calculate',
        payload: {
          movies: ['Back to the Future II', 'Back to the Future III'],
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.total).toBe(27);
      expect(body.discountPercentage).toBe(10);
    });

    it('should be case insensitive', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/v1/calculate',
        payload: {
          movies: ['BACK TO THE FUTURE 1', 'back to the future 2', 'BaCk To ThE fUtUrE 3'],
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.total).toBe(36);
    });
  });

  describe('GET /v1/health', () => {
    it('should return healthy status', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/v1/health',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.status).toBe('ok');
      expect(body.timestamp).toBeDefined();
    });
  });

  describe('GET /api/docs', () => {
    it('should serve Swagger UI', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/docs',
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toContain('text/html');
    });
  });

  describe('GET /api/docs/json', () => {
    it('should return OpenAPI specification', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/docs/json',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.openapi).toBeDefined();
      expect(body.info).toBeDefined();
      expect(body.paths).toBeDefined();
    });
  });

  describe('CORS', () => {
    it('should handle OPTIONS preflight request', async () => {
      const response = await server.inject({
        method: 'OPTIONS',
        url: '/v1/calculate',
        headers: {
          origin: 'http://localhost:3000',
          'access-control-request-method': 'POST',
        },
      });

      expect(response.statusCode).toBe(204);
      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/unknown-route',
      });

      expect(response.statusCode).toBe(404);
    });

    it('should handle malformed JSON', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/v1/calculate',
        payload: 'invalid json',
        headers: {
          'content-type': 'application/json',
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('Performance', () => {
    it('should handle multiple concurrent requests', async () => {
      const requests = Array.from({ length: 10 }, () =>
        server.inject({
          method: 'POST',
          url: '/v1/calculate',
          payload: {
            movies: ['Back to the Future 1', 'Back to the Future 2', 'Back to the Future 3'],
          },
        })
      );

      const responses = await Promise.all(requests);

      responses.forEach((response) => {
        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.body);
        expect(body.total).toBe(36);
      });
    });
  });
});
