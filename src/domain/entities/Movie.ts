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
