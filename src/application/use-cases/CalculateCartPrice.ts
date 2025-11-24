import { Cart } from '@domain/entities/Cart';
import { Movie } from '@domain/entities/Movie';

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
      const movie = Movie.fromTitle(title);
      cart.addMovie(movie);
    }

    return cart.calculateTotal();
  }
}
