import { Cart } from '../../domain/entities/Cart';
import { Movie, MovieType } from '../../domain/entities/Movie';

/**
 * Use case for calculating the total price of a shopping cart
 * This follows the Clean Architecture principle of isolating business logic
 */
export class CalculateCartPrice {
  /**
   * Execute the use case: calculate total price from movie titles
   * @param movieTitles Array of movie title strings
   * @returns Total price in euros
   */
  execute(movieTitles: string[]): number {
    const cart = new Cart();

    for (const title of movieTitles) {
      const movie = this.parseMovieTitle(title);
      cart.addMovie(movie);
    }

    return cart.calculateTotal();
  }

  /**
   * Parse a movie title string and create a Movie entity
   * Identifies Back to the Future movies and extracts episode number
   * @param title The movie title as string
   * @returns A Movie entity
   */
  private parseMovieTitle(title: string): Movie {
    const normalizedTitle = title.trim().toLowerCase();

    // Check if it's a Back to the Future movie
    const bttfPattern = /back to the future\s+(\d+)/i;
    const match = normalizedTitle.match(bttfPattern);

    if (match) {
      const episode = parseInt(match[1], 10);
      return new Movie(title.trim(), MovieType.BACK_TO_THE_FUTURE, episode);
    }

    // Otherwise, it's another type of movie
    return new Movie(title.trim(), MovieType.OTHER);
  }
}
