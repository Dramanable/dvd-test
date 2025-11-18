/**
 * DVD Shop Calculator SDK
 *
 * This SDK provides a programmatic interface to calculate DVD prices
 * with Back to the Future promotions.
 *
 * @example Basic usage
 * ```typescript
 * import { DVDCalculator } from 'dvd-shop-calculator';
 *
 * const calculator = new DVDCalculator();
 * const price = calculator.calculate(['Back to the Future 1', 'Back to the Future 2']);
 * console.log(price); // 27
 * ```
 *
 * @example Using entities directly
 * ```typescript
 * import { Cart, Movie, MovieType } from 'dvd-shop-calculator';
 *
 * const cart = new Cart();
 * cart.addMovie(new Movie('Back to the Future 1', MovieType.BACK_TO_THE_FUTURE, 1));
 * cart.addMovie(new Movie('Back to the Future 2', MovieType.BACK_TO_THE_FUTURE, 2));
 * const total = cart.calculateTotal(); // 27
 * ```
 *
 * @example Fluent API
 * ```typescript
 * import { DVDCalculator } from 'dvd-shop-calculator';
 *
 * const price = new DVDCalculator()
 *   .addMovie('Back to the Future 1')
 *   .addMovie('Back to the Future 2')
 *   .getTotal(); // 27
 * ```
 *
 * @module dvd-shop-calculator
 */

// Main SDK facade
export { DVDCalculator } from './DVDCalculator';
export type { CalculationResult, CartInfo } from './DVDCalculator';

// Domain entities
export { Movie, MovieType } from '../domain/entities/Movie';
export { Cart } from '../domain/entities/Cart';

// Use cases (for advanced usage)
export { CalculateCartPrice } from '../application/use-cases/CalculateCartPrice';

// Application layer (for DI and custom implementations)
export type { IInputParser } from '../application/ports/IInputParser';
export { DVDCalculatorApp } from '../application/DVDCalculatorApp';

// Infrastructure (concrete implementations)
export { InputParser } from '../infrastructure/InputParser';
