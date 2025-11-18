#!/usr/bin/env node

/**
 * API Server Entry Point
 * Starts the Fastify server for the DVD Calculator REST API
 */

import { startServer } from './server';

const PORT = parseInt(process.env.PORT || '5000', 10);
const HOST = process.env.HOST || '0.0.0.0';

// Start server
startServer(PORT, HOST).catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

// Graceful shutdown
const signals = ['SIGINT', 'SIGTERM'] as const;
signals.forEach((signal) => {
  process.on(signal, () => {
    // eslint-disable-next-line no-console
    console.log(`\nReceived ${signal}, shutting down gracefully...`);
    process.exit(0);
  });
});
