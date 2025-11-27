import { Movie } from './Movie';

export class Cart {
  private movies: Movie[] = [];

  addMovie(movie: Movie): void {
    this.movies.push(movie);
  }

  getMovies(): Movie[] {
    return [...this.movies];
  }

  calculateTotal(): number {
    if (this.movies.length === 0) {
      return 0;
    }

    const bttfMovies = this.movies.filter((m) => m.isBackToTheFuture());
    const otherMovies = this.movies.filter((m) => !m.isBackToTheFuture());

    const otherMoviesTotal = otherMovies.reduce((sum, movie) => sum + movie.getBasePrice(), 0);

    const bttfTotal = this.calculateBttfTotal(bttfMovies);

    return bttfTotal + otherMoviesTotal;
  }

  private calculateBttfTotal(bttfMovies: Movie[]): number {
    if (bttfMovies.length === 0) {
      return 0;
    }

    const uniqueEpisodes = this.countUniqueEpisodes(bttfMovies);

    const baseTotal = bttfMovies.reduce((sum, movie) => sum + movie.getBasePrice(), 0);

    const discount = this.getDiscount(uniqueEpisodes);

    return baseTotal * (1 - discount);
  }

  private countUniqueEpisodes(bttfMovies: Movie[]): number {
    const episodes = new Set<number>();

    for (const movie of bttfMovies) {
      if (movie.episode !== undefined) {
        episodes.add(movie.episode);
      }
    }

    return episodes.size;
  }

  private getDiscount(uniqueEpisodes: number): number {
    if (uniqueEpisodes >= 3) {
      return 0.2;
    }
    if (uniqueEpisodes === 2) {
      return 0.1;
    }
    return 0;
  }
}
