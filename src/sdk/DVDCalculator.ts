import { Movie, MovieType } from '../domain/entities/Movie';
import { Cart } from '../domain/entities/Cart';
import { CalculateCartPrice } from '../application/use-cases/CalculateCartPrice';
import { ValidationException } from '../domain/exceptions';

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
  private calculateUseCase: CalculateCartPrice;

  constructor() {
    this.cart = new Cart();
    this.calculateUseCase = new CalculateCartPrice();
  }

  /**
   * Calculate total price for a list of movie titles
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

    return this.calculateUseCase.execute(validTitles);
  }

  /**
   * Calculate price with detailed breakdown
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

    // Create cart
    const cart = new Cart();
    validTitles.forEach((title) => {
      const movie = this.parseMovie(title);
      cart.addMovie(movie);
    });

    // Calculate prices
    const total = cart.calculateTotal();
    const bttfMovies = cart.getMovies().filter((m) => m.isBackToTheFuture());
    const uniqueEpisodes = this.countUniqueEpisodes(bttfMovies);
    const discountPercentage = this.getDiscountPercentage(uniqueEpisodes);

    const bttfTotal = bttfMovies.reduce((sum, movie) => sum + movie.getBasePrice(), 0);
    const subtotal =
      bttfTotal +
      cart
        .getMovies()
        .filter((m) => !m.isBackToTheFuture())
        .reduce((sum, m) => sum + m.getBasePrice(), 0);
    const discount = subtotal - total;

    // Get movie details
    const movies = cart.getMovies().map((movie) => ({
      title: movie.title,
      type: movie.type,
      basePrice: movie.getBasePrice(),
      episodeNumber: movie.episode,
    }));

    return {
      total: Math.round(total),
      subtotal: Math.round(subtotal),
      discount: Math.round(discount),
      discountPercentage,
      itemCount: validTitles.length,
      uniqueEpisodes,
      movies,
    };
  }

  /**
   * Parse a movie title and create a Movie entity
   *
   * @param title - Movie title
   * @returns Movie entity
   *
   * @example
   * ```typescript
   * const movie = calculator.parseMovie('Back to the Future II');
   * console.log(movie.episode); // 2
   * ```
   */
  parseMovie(title: string): Movie {
    const trimmedTitle = title.trim();
    const normalizedTitle = trimmedTitle.toLowerCase();

    // Check if it's a Back to the Future movie with numeric episode
    const bttfNumericPattern = /back to the future\s+(\d+)/i;
    const numericMatch = trimmedTitle.match(bttfNumericPattern);

    if (numericMatch) {
      const episode = parseInt(numericMatch[1], 10);
      return new Movie(trimmedTitle, MovieType.BACK_TO_THE_FUTURE, episode);
    }

    // Check if it's a Back to the Future movie with Roman numerals
    if (normalizedTitle.includes('back to the future')) {
      let episode = 1;

      if (normalizedTitle.includes(' iii')) {
        episode = 3;
      } else if (normalizedTitle.includes(' ii')) {
        episode = 2;
      }

      return new Movie(trimmedTitle, MovieType.BACK_TO_THE_FUTURE, episode);
    }

    return new Movie(trimmedTitle, MovieType.OTHER);
  }

  /**
   * Count unique BTTF episodes
   * @param bttfMovies - Array of BTTF movies
   * @returns Number of unique episodes
   */
  private countUniqueEpisodes(bttfMovies: Movie[]): number {
    const episodes = new Set<number>();
    for (const movie of bttfMovies) {
      if (movie.episode !== undefined) {
        episodes.add(movie.episode);
      }
    }
    return episodes.size;
  }

  /**
   * Get discount percentage based on unique episodes
   * @param uniqueEpisodes - Number of unique episodes
   * @returns Discount percentage (0, 10, or 20)
   */
  private getDiscountPercentage(uniqueEpisodes: number): number {
    if (uniqueEpisodes >= 3) {
      return 20;
    }
    if (uniqueEpisodes === 2) {
      return 10;
    }
    return 0;
  }

  /**
   * Add a single movie to the cart (fluent API)
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
    const movie = this.parseMovie(title);
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
    return Math.round(this.cart.calculateTotal());
  }

  /**
   * Get cart information
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
    const total = this.cart.calculateTotal();
    const bttfMovies = this.cart.getMovies().filter((m) => m.isBackToTheFuture());
    const uniqueEpisodes = this.countUniqueEpisodes(bttfMovies);

    const bttfTotal = bttfMovies.reduce((sum, movie) => sum + movie.getBasePrice(), 0);
    const otherTotal = this.cart
      .getMovies()
      .filter((m) => !m.isBackToTheFuture())
      .reduce((sum, m) => sum + m.getBasePrice(), 0);
    const subtotal = bttfTotal + otherTotal;
    const discount = subtotal - total;

    return {
      total: Math.round(total),
      subtotal: Math.round(subtotal),
      discount: Math.round(discount),
      itemCount: this.cart.getMovies().length,
      uniqueEpisodes,
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
