export enum MovieType {
  BACK_TO_THE_FUTURE = 'BACK_TO_THE_FUTURE',
  OTHER = 'OTHER',
}

export class Movie {
  constructor(
    public readonly title: string,
    public readonly type: MovieType,
    public readonly episode?: number
  ) {}

  static fromTitle(title: string): Movie {
    const trimmedTitle = title.trim();
    const normalizedTitle = trimmedTitle.toLowerCase();

    const bttfNumericPattern = /back to the future\s+(\d+)/i;
    const numericMatch = trimmedTitle.match(bttfNumericPattern);

    if (numericMatch) {
      const episode = parseInt(numericMatch[1], 10);
      return new Movie(trimmedTitle, MovieType.BACK_TO_THE_FUTURE, episode);
    }

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

  getBasePrice(): number {
    return this.type === MovieType.BACK_TO_THE_FUTURE ? 15 : 20;
  }

  isSameEpisode(other: Movie): boolean {
    if (this.type !== MovieType.BACK_TO_THE_FUTURE || other.type !== MovieType.BACK_TO_THE_FUTURE) {
      return false;
    }
    return this.episode === other.episode;
  }

  isBackToTheFuture(): boolean {
    return this.type === MovieType.BACK_TO_THE_FUTURE;
  }
}
