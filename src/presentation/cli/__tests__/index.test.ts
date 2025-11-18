/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventEmitter } from 'events';
import { CLIHandler } from '../index';
import { DVDCalculatorService } from '@application/services/DVDCalculatorService';
import { InputParser } from '@infrastructure/adapters/InputParser';

// Mock readline
let mockReadlineInterface: any;
jest.mock('readline', () => ({
  createInterface: jest.fn(() => {
    mockReadlineInterface = new EventEmitter();
    (mockReadlineInterface as any).close = jest.fn();
    return mockReadlineInterface;
  }),
}));

// Mock stream that mimics stdin
class MockReadStream extends EventEmitter {
  isTTY: boolean = false;

  push(chunk: string | null): void {
    if (chunk === null) {
      this.emit('end');
    } else {
      this.emit('data', chunk);
    }
  }

  resume(): this {
    return this;
  }

  pause(): this {
    return this;
  }

  setEncoding(): this {
    return this;
  }
}

describe('CLI', () => {
  let mockService: jest.Mocked<DVDCalculatorService>;
  let mockFileSystem: { readFileSync: jest.Mock };
  let mockStdin: MockReadStream;
  let mockStdout: any;

  beforeEach(() => {
    // Mock service
    mockService = {
      runAndDisplay: jest.fn(),
      run: jest.fn(),
      runWithDetails: jest.fn(),
    } as any;

    // Mock file system
    mockFileSystem = {
      readFileSync: jest.fn(),
    };

    // Mock stdin/stdout
    mockStdin = new MockReadStream();
    mockStdout = {
      write: jest.fn(),
    };

    // Mock console methods
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('File input mode', () => {
    it('should read from file and calculate price', () => {
      const fileContent = 'Back to the Future 1\nBack to the Future 2';
      mockFileSystem.readFileSync.mockReturnValue(fileContent);

      const cli = new CLIHandler(
        mockService,
        mockFileSystem,
        ['example.txt'],
        mockStdin as any,
        mockStdout as any
      );

      cli.handleFileInput('example.txt');

      expect(mockFileSystem.readFileSync).toHaveBeenCalledWith('example.txt', 'utf-8');
      expect(mockService.runAndDisplay).toHaveBeenCalledWith(fileContent);
    });

    it('should handle file read errors', () => {
      const error = new Error('File not found');
      mockFileSystem.readFileSync.mockImplementation(() => {
        throw error;
      });

      const cli = new CLIHandler(
        mockService,
        mockFileSystem,
        ['nonexistent.txt'],
        mockStdin as any,
        mockStdout as any
      );

      expect(() => cli.handleFileInput('nonexistent.txt')).toThrow('process.exit called');
      expect(console.error).toHaveBeenCalledWith(`Error reading file: ${error}`);
    });

    it('should run with file argument', async () => {
      const fileContent = 'Back to the Future 1';
      mockFileSystem.readFileSync.mockReturnValue(fileContent);

      const cli = new CLIHandler(
        mockService,
        mockFileSystem,
        ['example.txt'],
        mockStdin as any,
        mockStdout as any
      );

      await cli.run();

      expect(mockFileSystem.readFileSync).toHaveBeenCalledWith('example.txt', 'utf-8');
      expect(mockService.runAndDisplay).toHaveBeenCalledWith(fileContent);
    });
  });

  describe('Stdin input mode (piped)', () => {
    it('should read from stdin when piped', async () => {
      const input = 'Back to the Future 1\nBack to the Future 2\nBack to the Future 3';

      // Mock stdin as not TTY (piped)
      mockStdin.isTTY = false;

      const cli = new CLIHandler(
        mockService,
        mockFileSystem,
        [],
        mockStdin as any,
        mockStdout as any
      );

      // Simulate piped input
      const runPromise = cli.handleStdinInput();

      // Send data
      mockStdin.push(input);
      mockStdin.push(null); // End stream

      await runPromise;

      expect(mockService.runAndDisplay).toHaveBeenCalledWith(input);
    });

    it('should handle stdin in run method when not TTY', async () => {
      const input = 'Back to the Future 1';
      mockStdin.isTTY = false;

      const cli = new CLIHandler(
        mockService,
        mockFileSystem,
        [],
        mockStdin as any,
        mockStdout as any
      );

      const runPromise = cli.run();

      mockStdin.push(input);
      mockStdin.push(null);

      await runPromise;

      expect(mockService.runAndDisplay).toHaveBeenCalledWith(input);
    });
  });

  describe('Interactive mode', () => {
    it('should display welcome message', async () => {
      // Mock stdin as TTY (interactive)
      mockStdin.isTTY = true;

      const cli = new CLIHandler(
        mockService,
        mockFileSystem,
        [],
        mockStdin as any,
        mockStdout as any
      );

      // Start interactive mode
      const runPromise = cli.handleInteractiveInput();

      // Immediately close readline to end interactive mode
      setImmediate(() => {
        mockReadlineInterface.emit('close');
      });

      await runPromise;

      expect(console.log).toHaveBeenCalledWith('DVD Shop Price Calculator');
      expect(console.log).toHaveBeenCalledWith('=========================');
      expect(console.log).toHaveBeenCalledWith('Enter movie titles (one per line).');
      expect(console.log).toHaveBeenCalledWith(
        'Press Ctrl+D (Unix) or Ctrl+Z (Windows) when done.\n'
      );
    });

    it('should collect lines and calculate price', async () => {
      mockStdin.isTTY = true;

      const cli = new CLIHandler(
        mockService,
        mockFileSystem,
        [],
        mockStdin as any,
        mockStdout as any
      );

      const runPromise = cli.handleInteractiveInput();

      // Simulate user input using setImmediate for proper event loop handling
      setImmediate(() => {
        mockReadlineInterface.emit('line', 'Back to the Future 1');
        mockReadlineInterface.emit('line', 'Back to the Future 2');
        mockReadlineInterface.emit('close');
      });

      await runPromise;

      expect(mockService.runAndDisplay).toHaveBeenCalledWith(
        'Back to the Future 1\nBack to the Future 2'
      );
    });

    it('should run interactive mode when no args and TTY', async () => {
      mockStdin.isTTY = true;

      const cli = new CLIHandler(
        mockService,
        mockFileSystem,
        [],
        mockStdin as any,
        mockStdout as any
      );

      const runPromise = cli.run();

      setImmediate(() => {
        mockReadlineInterface.emit('line', 'Back to the Future 1');
        mockReadlineInterface.emit('close');
      });

      await runPromise;

      expect(mockService.runAndDisplay).toHaveBeenCalledWith('Back to the Future 1');
      expect(console.log).toHaveBeenCalledWith('DVD Shop Price Calculator');
    });
  });

  describe('Input mode detection', () => {
    it('should prioritize file argument over stdin', async () => {
      const fileContent = 'Back to the Future 1';
      mockFileSystem.readFileSync.mockReturnValue(fileContent);
      mockStdin.isTTY = false; // Even if piped

      const cli = new CLIHandler(
        mockService,
        mockFileSystem,
        ['example.txt'],
        mockStdin as any,
        mockStdout as any
      );

      await cli.run();

      expect(mockFileSystem.readFileSync).toHaveBeenCalledWith('example.txt', 'utf-8');
      expect(mockService.runAndDisplay).toHaveBeenCalledWith(fileContent);
    });

    it('should skip file mode if argument is "-"', async () => {
      mockStdin.isTTY = false;

      const cli = new CLIHandler(
        mockService,
        mockFileSystem,
        ['-'],
        mockStdin as any,
        mockStdout as any
      );

      const runPromise = cli.run();

      mockStdin.push('Back to the Future 1');
      mockStdin.push(null);

      await runPromise;

      expect(mockFileSystem.readFileSync).not.toHaveBeenCalled();
      expect(mockService.runAndDisplay).toHaveBeenCalledWith('Back to the Future 1');
    });
  });

  describe('Integration with real service', () => {
    it('should work with real DVDCalculatorService', () => {
      const fileContent = 'Back to the Future 1\nBack to the Future 2\nBack to the Future 3';
      mockFileSystem.readFileSync.mockReturnValue(fileContent);

      const inputParser = new InputParser();
      const realService = new DVDCalculatorService(inputParser);
      const runSpy = jest.spyOn(realService, 'runAndDisplay');

      const cli = new CLIHandler(
        realService,
        mockFileSystem,
        ['example.txt'],
        mockStdin as any,
        mockStdout as any
      );

      cli.handleFileInput('example.txt');

      expect(runSpy).toHaveBeenCalledWith(fileContent);
      expect(console.log).toHaveBeenCalledWith(36); // Expected result for 3 BTTF movies
    });
  });

  describe('Edge cases', () => {
    it('should handle empty file', () => {
      mockFileSystem.readFileSync.mockReturnValue('');

      const cli = new CLIHandler(
        mockService,
        mockFileSystem,
        ['empty.txt'],
        mockStdin as any,
        mockStdout as any
      );

      cli.handleFileInput('empty.txt');

      expect(mockService.runAndDisplay).toHaveBeenCalledWith('');
    });

    it('should handle empty stdin', async () => {
      mockStdin.isTTY = false;

      const cli = new CLIHandler(
        mockService,
        mockFileSystem,
        [],
        mockStdin as any,
        mockStdout as any
      );

      const runPromise = cli.handleStdinInput();

      mockStdin.push(null); // Empty input

      await runPromise;

      expect(mockService.runAndDisplay).toHaveBeenCalledWith('');
    });

    it('should handle empty interactive input', async () => {
      mockStdin.isTTY = true;

      const cli = new CLIHandler(
        mockService,
        mockFileSystem,
        [],
        mockStdin as any,
        mockStdout as any
      );

      const runPromise = cli.handleInteractiveInput();

      setImmediate(() => {
        mockReadlineInterface.emit('close'); // No lines entered
      });

      await runPromise;

      expect(mockService.runAndDisplay).toHaveBeenCalledWith('');
    });
  });
});
