#!/usr/bin/env node
/* eslint-disable no-console */

import * as fs from 'fs';
import * as readline from 'readline';
import { DVDCalculatorService } from '../../application/services/DVDCalculatorService';
import { InputParser } from '../../infrastructure/adapters/InputParser';

/**
 * Main entry point for the DVD shop calculator
 * Handles different input modes: file, stdin, or interactive
 * This is where dependency injection happens (Infrastructure → Application)
 */
async function main(): Promise<void> {
  // Dependency Injection: inject the infrastructure implementation
  const inputParser = new InputParser();
  const app = new DVDCalculatorService(inputParser);
  const args = process.argv.slice(2);

  // If a file path is provided as argument
  if (args.length > 0 && args[0] !== '-') {
    const filePath = args[0];
    try {
      const input = fs.readFileSync(filePath, 'utf-8');
      app.runAndDisplay(input);
    } catch (error) {
      console.error(`Error reading file: ${error}`);
      process.exit(1);
    }
    return;
  }

  // Check if data is being piped in
  if (!process.stdin.isTTY) {
    const input = await readStdin();
    app.runAndDisplay(input);
    return;
  }

  // Interactive mode
  console.log('DVD Shop Price Calculator');
  console.log('=========================');
  console.log('Enter movie titles (one per line).');
  console.log('Press Ctrl+D (Unix) or Ctrl+Z (Windows) when done.\n');

  const input = await readInteractive();
  app.runAndDisplay(input);
}

/**
 * Read input from stdin (for piped input)
 */
function readStdin(): Promise<string> {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.on('data', (chunk) => {
      data += chunk;
    });
    process.stdin.on('end', () => {
      resolve(data);
    });
  });
}

/**
 * Read input interactively line by line
 */
function readInteractive(): Promise<string> {
  return new Promise((resolve) => {
    const lines: string[] = [];
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.on('line', (line) => {
      lines.push(line);
    });

    rl.on('close', () => {
      resolve(lines.join('\n'));
    });
  });
}

// Run the application
main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
