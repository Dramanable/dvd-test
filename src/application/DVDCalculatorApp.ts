import { IInputParser } from './ports/IInputParser';
import { CalculateCartPrice } from './use-cases/CalculateCartPrice';

/**
 * CLI Application to calculate DVD cart prices
 * This is the application layer that orchestrates the use cases
 * Depends only on domain layer and application ports (interfaces)
 */
export class DVDCalculatorApp {
  private calculateCartPrice: CalculateCartPrice;
  private inputParser: IInputParser;

  constructor(inputParser: IInputParser) {
    this.calculateCartPrice = new CalculateCartPrice();
    this.inputParser = inputParser;
  }

  /**
   * Run the application with text input
   * @param input Multi-line text with movie titles
   * @returns The calculated total price
   */
  run(input: string): number {
    const movieTitles = this.inputParser.parse(input);
    return this.calculateCartPrice.execute(movieTitles);
  }

  /**
   * Run the application and print the result to console
   * @param input Multi-line text with movie titles
   */
  runAndDisplay(input: string): void {
    const total = this.run(input);
    // eslint-disable-next-line no-console
    console.log(total);
  }
}
