import { Cart } from '../../domain/entities/Cart';
import { Movie, MovieType } from '../../domain/entities/Movie';
import { IInputParser } from '../ports/IInputParser';
import { CalculateCartPrice } from '../use-cases/CalculateCartPrice';

/**
 * Detailed calculation result
 */
export interface CalculationDetails {
  total: number;
  subtotal: number;
  discount: number;
  discountPercentage: number;
  itemCount: number;
  uniqueEpisodes: number;
  movies: Array<{
    title: string;
    type: MovieType;
    basePrice: number;
    episodeNumber?: number;
  }>;
}

/**
 * DVD Calculator Application Service
 * This service orchestrates use cases and manages dependencies
 * Follows Clean Architecture principles - depends only on abstractions (ports)
 */
export class DVDCalculatorService {
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
   * Run with detailed calculation results
   * @param input Multi-line text with movie titles
   * @returns Detailed calculation with subtotal, discount, movies, etc.
   */
  runWithDetails(input: string): CalculationDetails {
    const movieTitles = this.inputParser.parse(input);

    // Create cart and calculate (domain logic)
    const cart = new Cart();
    movieTitles.forEach((title) => {
      const movie = Movie.fromTitle(title);
      cart.addMovie(movie);
    });

    const total = cart.calculateTotal();
    const cartMovies = cart.getMovies();
    const bttfMovies = cartMovies.filter((m) => m.isBackToTheFuture());
    const uniqueEpisodes = new Set(bttfMovies.map((m) => m.episode)).size;

    const subtotal = cartMovies.reduce((sum, m) => sum + m.getBasePrice(), 0);
    const discount = subtotal - total;
    const discountPercentage = subtotal > 0 ? (discount / subtotal) * 100 : 0;

    return {
      total: Math.round(total),
      subtotal: Math.round(subtotal),
      discount: Math.round(discount * 100) / 100,
      discountPercentage: Math.round(discountPercentage * 10) / 10,
      itemCount: movieTitles.length,
      uniqueEpisodes,
      movies: cartMovies.map((m) => ({
        title: m.title,
        type: m.type,
        basePrice: m.getBasePrice(),
        episodeNumber: m.episode || 0,
      })),
    };
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
