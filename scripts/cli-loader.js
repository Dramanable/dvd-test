#!/usr/bin/env node

/**
 * CLI Entry point with tsconfig-paths registration
 * This file registers path aliases before loading the actual CLI
 * 
 * This is necessary because TypeScript path aliases (@domain, @application, etc.)
 * are not resolved by Node.js at runtime. We use tsconfig-paths to map them.
 */

const tsConfig = require('../tsconfig.json');
const tsConfigPaths = require('tsconfig-paths');

// Register tsconfig paths for Node.js runtime with proper base URL
const baseUrl = __dirname; // dist folder
tsConfigPaths.register({
  baseUrl,
  paths: tsConfig.compilerOptions.paths,
});

// Load and execute the CLI
const cliModule = require('./presentation/cli/index');

// If the CLI exports CLIHandler, instantiate and run it
if (cliModule.CLIHandler) {
  const { DVDCalculatorService } = require('./application/services/DVDCalculatorService');
  const { InputParser } = require('./infrastructure/adapters/InputParser');
  
  const inputParser = new InputParser();
  const service = new DVDCalculatorService(inputParser);
  const cli = new cliModule.CLIHandler(service);
  
  cli.run().catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
}
