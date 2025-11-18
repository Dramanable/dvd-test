#!/usr/bin/env node
/* eslint-disable no-console */

import * as fs from 'fs';
import * as readline from 'readline';
import type { ReadStream, WriteStream } from 'tty';
import { DVDCalculatorService } from '../../application/services/DVDCalculatorService';
import { InputParser } from '../../infrastructure/adapters/InputParser';

/**
 * CLI handler - separated for testing
 */
export class CLIHandler {
  constructor(
    private readonly service: DVDCalculatorService,
    private readonly fileSystem: { readFileSync: typeof fs.readFileSync } = fs,
    private readonly processArgs: string[] = process.argv.slice(2),
    private readonly stdin: ReadStream | NodeJS.ReadStream = process.stdin,
    private readonly stdout: WriteStream | NodeJS.WriteStream = process.stdout
  ) {}

  /**
   * Handle file input mode
   */
  handleFileInput(filePath: string): void {
    try {
      const input = this.fileSystem.readFileSync(filePath, 'utf-8');
      this.service.runAndDisplay(input);
    } catch (error) {
      console.error(`Error reading file: ${error}`);
      process.exit(1);
    }
  }

  /**
   * Handle piped stdin input
   */
  async handleStdinInput(): Promise<void> {
    const input = await this.readStdin();
    this.service.runAndDisplay(input);
  }

  /**
   * Handle interactive mode
   */
  async handleInteractiveInput(): Promise<void> {
    console.log('DVD Shop Price Calculator');
    console.log('=========================');
    console.log('Enter movie titles (one per line).');
    console.log('Press Ctrl+D (Unix) or Ctrl+Z (Windows) when done.\n');

    const input = await this.readInteractive();
    this.service.runAndDisplay(input);
  }

  /**
   * Read input from stdin (for piped input)
   */
  private readStdin(): Promise<string> {
    return new Promise((resolve) => {
      let data = '';
      this.stdin.on('data', (chunk) => {
        data += chunk;
      });
      this.stdin.on('end', () => {
        resolve(data);
      });
    });
  }

  /**
   * Read input interactively line by line
   */
  private readInteractive(): Promise<string> {
    return new Promise((resolve) => {
      const lines: string[] = [];
      const rl = readline.createInterface({
        input: this.stdin,
        output: this.stdout,
      });

      rl.on('line', (line) => {
        lines.push(line);
      });

      rl.on('close', () => {
        resolve(lines.join('\n'));
      });
    });
  }

  /**
   * Run CLI with appropriate input mode
   */
  async run(): Promise<void> {
    // If a file path is provided as argument
    if (this.processArgs.length > 0 && this.processArgs[0] !== '-') {
      this.handleFileInput(this.processArgs[0]);
      return;
    }

    // Check if data is being piped in
    if (!this.stdin.isTTY) {
      await this.handleStdinInput();
      return;
    }

    // Interactive mode
    await this.handleInteractiveInput();
  }
}

/**
 * Main entry point for the DVD shop calculator
 * Handles different input modes: file, stdin, or interactive
 * This is where dependency injection happens (Infrastructure → Application)
 */
async function main(): Promise<void> {
  // Dependency Injection: inject the infrastructure implementation
  const inputParser = new InputParser();
  const service = new DVDCalculatorService(inputParser);
  const cli = new CLIHandler(service);

  await cli.run();
}

// Run the application only if executed directly (not imported)
if (require.main === module) {
  main().catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
}
