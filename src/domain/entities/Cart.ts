import { Movie } from './Movie';

/**
 * Cart entity managing a collection of movies and calculating the total price
 * This is a domain entity with business rules for discounts
 */
export class Cart {
  private movies: Movie[] = [];

  /**
   * Add a movie to the cart
   * @param movie The movie to add
   */
  addMovie(movie: Movie): void {
    this.movies.push(movie);
  }

  /**
   * Get all movies in the cart
   * @returns Array of movies
   */
  getMovies(): Movie[] {
    return [...this.movies];
  }

  /**
   * Calculate the total price of the cart with applicable discounts
   * Business rules:
   * - BTTF DVDs: 15€ each
   * - Other movies: 20€ each (no discount)
   * - 2 different BTTF episodes: 10% discount on all BTTF DVDs
   * - 3 different BTTF episodes: 20% discount on all BTTF DVDs
   * @returns The total price in euros
   */
  calculateTotal(): number {
    if (this.movies.length === 0) {
      return 0;
    }

    const bttfMovies = this.movies.filter(m => m.isBackToTheFuture());
    const otherMovies = this.movies.filter(m => !m.isBackToTheFuture());

    // Calculate price for other movies (no discount)
    const otherMoviesTotal = otherMovies.reduce((sum, movie) => sum + movie.getBasePrice(), 0);

    // Calculate price for BTTF movies with discount
    const bttfTotal = this.calculateBttfTotal(bttfMovies);

    return bttfTotal + otherMoviesTotal;
  }

  /**
   * Calculate the total price for Back to the Future movies with applicable discount
   * @param bttfMovies Array of BTTF movies
   * @returns The total price with discount applied
   */
  private calculateBttfTotal(bttfMovies: Movie[]): number {
    if (bttfMovies.length === 0) {
      return 0;
    }

    // Count unique episodes
    const uniqueEpisodes = this.countUniqueEpisodes(bttfMovies);

    // Calculate base total
    const baseTotal = bttfMovies.reduce((sum, movie) => sum + movie.getBasePrice(), 0);

    // Apply discount based on number of different episodes
    const discount = this.getDiscount(uniqueEpisodes);

    return baseTotal * (1 - discount);
  }

  /**
   * Count the number of unique BTTF episodes in the list
   * @param bttfMovies Array of BTTF movies
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
   * Get the discount rate based on the number of different episodes
   * @param uniqueEpisodes Number of unique episodes
   * @returns Discount rate (0 to 1)
   */
  private getDiscount(uniqueEpisodes: number): number {
    if (uniqueEpisodes >= 3) {
      return 0.2; // 20% discount
    } else if (uniqueEpisodes === 2) {
      return 0.1; // 10% discount
    }
    return 0; // No discount
  }
}
