import { IInputParser } from '../application/ports/IInputParser';

/**
 * Parser for converting text input into an array of movie titles
 * Part of the infrastructure layer
 * Implements the IInputParser port from the application layer
 */
export class InputParser implements IInputParser {
  /**
   * Parse a multi-line text input into an array of movie titles
   * @param input Text input with one movie per line
   * @returns Array of movie titles (trimmed, empty lines removed)
   */
  parse(input: string): string[] {
    return input
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }
}
