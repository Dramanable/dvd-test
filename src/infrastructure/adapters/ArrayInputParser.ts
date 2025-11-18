import { IInputParser } from '@application/ports/IInputParser';

/**
 * Array Input Parser - Adapter for REST API
 * Converts an array of strings (from JSON) to the format expected by IInputParser
 * This is an infrastructure adapter that implements the application port
 */
export class ArrayInputParser implements IInputParser {
  private movies: string[];

  constructor(movies: string[]) {
    this.movies = movies;
  }

  /**
   * Parse returns the array as-is since it's already in the correct format
   * @param _input Ignored - the array was provided in constructor
   * @returns Array of movie titles
   */
  parse(_input: string): string[] {
    // Filter out empty strings and trim
    return this.movies
      .filter((movie) => movie && movie.trim().length > 0)
      .map((movie) => movie.trim());
  }
}
