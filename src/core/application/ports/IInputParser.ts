/**
 * Port (interface) for parsing input text
 * This abstraction belongs to the application layer
 * Implementations will be in the infrastructure layer
 */
export interface IInputParser {
  /**
   * Parse a multi-line text input into an array of movie titles
   * @param input Text input with one movie per line
   * @returns Array of movie titles
   */
  parse(input: string): string[];
}
