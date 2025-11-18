/**
 * Enum representing the type of movie
 */
export enum MovieType {
  BACK_TO_THE_FUTURE = 'BACK_TO_THE_FUTURE',
  OTHER = 'OTHER',
}

/**
 * Movie entity representing a DVD in the shop
 * This is a domain entity with business logic for pricing
 */
export class Movie {
  constructor(
    public readonly title: string,
    public readonly type: MovieType,
    public readonly episode?: number
  ) {}

  /**
   * Create a Movie from a title string (factory method)
   * Parses the title to determine type and episode
   * @param title Movie title
   * @returns Movie instance
   */
  static fromTitle(title: string): Movie {
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
   * Get the base price of the movie before any discount
   * @returns The base price in euros
   */
  getBasePrice(): number {
    return this.type === MovieType.BACK_TO_THE_FUTURE ? 15 : 20;
  }

  /**
   * Check if this movie is the same episode as another movie
   * Only applicable for Back to the Future movies
   * @param other Another movie to compare with
   * @returns true if same episode, false otherwise
   */
  isSameEpisode(other: Movie): boolean {
    if (this.type !== MovieType.BACK_TO_THE_FUTURE || other.type !== MovieType.BACK_TO_THE_FUTURE) {
      return false;
    }
    return this.episode === other.episode;
  }

  /**
   * Check if this is a Back to the Future movie
   * @returns true if BTTF, false otherwise
   */
  isBackToTheFuture(): boolean {
    return this.type === MovieType.BACK_TO_THE_FUTURE;
  }
}
