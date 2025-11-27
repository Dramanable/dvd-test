import { Cart } from '@domain/entities/Cart';
import { Movie, MovieType } from '@domain/entities/Movie';
import { ValidationException } from '@domain/exceptions';
import { ArrayInputParser } from '@infrastructure/adapters/ArrayInputParser';
import { DVDCalculatorService } from '@application/services/DVDCalculatorService';

/**
 * Result of a detailed price calculation
 */
export interface CalculationResult {
  /** Total price after discount */
  total: number;
  /** Subtotal before discount */
  subtotal: number;
  /** Discount amount in euros */
  discount: number;
  /** Discount percentage (0, 10, or 20) */
  discountPercentage: number;
  /** Total number of movies in cart */
  itemCount: number;
  /** Number of unique BTTF episodes */
  uniqueEpisodes: number;
  /** List of movies with details */
  movies: Array<{
    title: string;
    type: MovieType;
    basePrice: number;
    episodeNumber?: number;
  }>;
}

/**
 * Cart information
 */
export interface CartInfo {
  /** Total price after discount */
  total: number;
  /** Subtotal before discount */
  subtotal: number;
  /** Discount amount */
  discount: number;
  /** Total number of movies */
  itemCount: number;
  /** Number of unique BTTF episodes */
  uniqueEpisodes: number;
}

/**
 * DVDCalculator - Main SDK facade for DVD shop price calculation
 *
 * @example
 * ```typescript
 * const calculator = new DVDCalculator();
 * const price = calculator.calculate(['Back to the Future', 'Back to the Future II']);
 * console.log(price); // 27
 * ```
 *
 * @example Fluent API
 * ```typescript
 * const price = calculator
 *   .reset()
 *   .addMovie('Back to the Future')
 *   .addMovie('Back to the Future II')
 *   .getTotal();
 * ```
 */
export class DVDCalculator {
  private cart: Cart;

  constructor() {
    this.cart = new Cart();
  }

  /**
   * Calculate total price for a list of movie titles
   * Uses DVDCalculatorService with dependency inversion
   *
   * @param movieTitles - Array of movie titles
   * @returns Total price in euros
   * @throws Error if movieTitles is null or undefined
   *
   * @example
   * ```typescript
   * calculator.calculate(['Back to the Future']); // 15
   * calculator.calculate(['Back to the Future', 'Back to the Future II']); // 27
   * calculator.calculate(['Back to the Future', 'Back to the Future II', 'Back to the Future III']); // 36
   * ```
   */
  calculate(movieTitles: string[]): number {
    if (movieTitles === null || movieTitles === undefined) {
      throw ValidationException.nullOrUndefined('movieTitles');
    }

    // Filter out empty strings and trim
    const validTitles = movieTitles
      .filter((title) => title && title.trim().length > 0)
      .map((title) => title.trim());

    // Dependency Inversion: Use service with ArrayInputParser adapter
    const inputParser = new ArrayInputParser(validTitles);
    const service = new DVDCalculatorService(inputParser);

    return service.run(''); // Input ignored, array in parser
  }

  /**
   * Calculate price with detailed breakdown
   * Uses DVDCalculatorService with dependency inversion
   *
   * @param movieTitles - Array of movie titles
   * @returns Detailed calculation result
   *
   * @example
   * ```typescript
   * const result = calculator.calculateWithDetails(['Back to the Future', 'Back to the Future II']);
   * console.log(result.total); // 27
   * console.log(result.discount); // 3
   * console.log(result.discountPercentage); // 10
   * ```
   */
  calculateWithDetails(movieTitles: string[]): CalculationResult {
    if (movieTitles === null || movieTitles === undefined) {
      throw ValidationException.nullOrUndefined('movieTitles');
    }

    // Filter and trim
    const validTitles = movieTitles
      .filter((title) => title && title.trim().length > 0)
      .map((title) => title.trim());

    // Dependency Inversion: Use service with ArrayInputParser adapter
    const inputParser = new ArrayInputParser(validTitles);
    const service = new DVDCalculatorService(inputParser);

    return service.runWithDetails(''); // Input ignored, array in parser
  }

  /**
   * Add a single movie to the cart (fluent API)
   * Uses Movie.fromTitle() from domain layer
   *
   * @param title - Movie title
   * @returns this for method chaining
   *
   * @example
   * ```typescript
   * calculator
   *   .addMovie('Back to the Future')
   *   .addMovie('Back to the Future II')
   *   .getTotal();
   * ```
   */
  addMovie(title: string): this {
    const movie = Movie.fromTitle(title);
    this.cart.addMovie(movie);
    return this;
  }

  /**
   * Add multiple movies to the cart (fluent API)
   *
   * @param titles - Array of movie titles
   * @returns this for method chaining
   *
   * @example
   * ```typescript
   * calculator
   *   .addMovies(['Back to the Future', 'Back to the Future II'])
   *   .getTotal();
   * ```
   */
  addMovies(titles: string[]): this {
    titles.forEach((title) => this.addMovie(title));
    return this;
  }

  /**
   * Remove a movie from the cart by title (fluent API)
   *
   * @param title - Movie title to remove
   * @returns this for method chaining
   *
   * @example
   * ```typescript
   * calculator
   *   .addMovie('Back to the Future 1')
   *   .addMovie('Back to the Future 2')
   *   .removeMovie('Back to the Future 2')
   *   .getTotal(); // 15
   * ```
   */
  removeMovie(title: string): this {
    // Rebuild cart without the removed movie
    const movies = this.cart.getMovies();
    const index = movies.findIndex((m) => m.title === title.trim());

    if (index !== -1) {
      // Create new cart with all movies except the one to remove
      this.cart = new Cart();
      movies.forEach((movie, i) => {
        if (i !== index) {
          this.cart.addMovie(movie);
        }
      });
    }

    return this;
  }

  /**
   * Reset the cart (fluent API)
   *
   * @returns this for method chaining
   *
   * @example
   * ```typescript
   * calculator.reset().addMovie('Back to the Future');
   * ```
   */
  reset(): this {
    this.cart = new Cart();
    return this;
  }

  /**
   * Get current total price from internal cart
   * Uses DVDCalculatorService - no business logic
   *
   * @returns Total price in euros
   *
   * @example
   * ```typescript
   * calculator.addMovie('Back to the Future');
   * console.log(calculator.getTotal()); // 15
   * ```
   */
  getTotal(): number {
    // Get movie titles from cart
    const movieTitles = this.cart.getMovies().map((m) => m.title);

    // Use service to calculate (no business logic here)
    const inputParser = new ArrayInputParser(movieTitles);
    const service = new DVDCalculatorService(inputParser);

    return service.run('');
  }

  /**
   * Get cart information using DVDCalculatorService
   * No business logic - delegates to application layer
   *
   * @returns Cart information with prices and counts
   *
   * @example
   * ```typescript
   * const info = calculator.getCartInfo();
   * console.log(info.itemCount); // 2
   * console.log(info.total); // 27
   * ```
   */
  getCartInfo(): CartInfo {
    // Get movie titles from cart
    const movieTitles = this.cart.getMovies().map((m) => m.title);

    // Use service to calculate (no business logic here)
    const inputParser = new ArrayInputParser(movieTitles);
    const service = new DVDCalculatorService(inputParser);
    const details = service.runWithDetails('');

    return {
      total: details.total,
      subtotal: details.subtotal,
      discount: details.discount,
      itemCount: details.itemCount,
      uniqueEpisodes: details.uniqueEpisodes,
    };
  }

  /**
   * Get all movies in the cart
   *
   * @returns Array of Movie entities
   *
   * @example
   * ```typescript
   * const movies = calculator.getMovies();
   * movies.forEach(movie => console.log(movie.getTitle()));
   * ```
   */
  getMovies(): Movie[] {
    return this.cart.getMovies();
  }
}
