import { Movie, MovieType } from '../Movie';

describe('Movie Entity', () => {
  describe('Back to the Future movies', () => {
    it('should create a Back to the Future movie with correct properties', () => {
      const movie = new Movie('Back to the Future 1', MovieType.BACK_TO_THE_FUTURE, 1);

      expect(movie.title).toBe('Back to the Future 1');
      expect(movie.type).toBe(MovieType.BACK_TO_THE_FUTURE);
      expect(movie.episode).toBe(1);
    });

    it('should have a base price of 15€', () => {
      const movie = new Movie('Back to the Future 2', MovieType.BACK_TO_THE_FUTURE, 2);

      expect(movie.getBasePrice()).toBe(15);
    });

    it('should identify different episodes correctly', () => {
      const movie1 = new Movie('Back to the Future 1', MovieType.BACK_TO_THE_FUTURE, 1);
      const movie2 = new Movie('Back to the Future 2', MovieType.BACK_TO_THE_FUTURE, 2);
      const movie3 = new Movie('Back to the Future 1', MovieType.BACK_TO_THE_FUTURE, 1);

      expect(movie1.isSameEpisode(movie2)).toBe(false);
      expect(movie1.isSameEpisode(movie3)).toBe(true);
    });
  });

  describe('Other movies', () => {
    it('should create a regular movie with correct properties', () => {
      const movie = new Movie('La chèvre', MovieType.OTHER);

      expect(movie.title).toBe('La chèvre');
      expect(movie.type).toBe(MovieType.OTHER);
      expect(movie.episode).toBeUndefined();
    });

    it('should have a base price of 20€', () => {
      const movie = new Movie('Forward to the Past full stack et front', MovieType.OTHER);

      expect(movie.getBasePrice()).toBe(20);
    });
  });

  describe('Movie.fromTitle factory', () => {
    it('should parse Back to the Future 1 with arabic numeral', () => {
      const movie = Movie.fromTitle('Back to the Future 1');

      expect(movie.type).toBe(MovieType.BACK_TO_THE_FUTURE);
      expect(movie.episode).toBe(1);
    });

    it('should parse Back to the Future 2 with arabic numeral', () => {
      const movie = Movie.fromTitle('Back to the Future 2');

      expect(movie.type).toBe(MovieType.BACK_TO_THE_FUTURE);
      expect(movie.episode).toBe(2);
    });

    it('should parse Back to the Future 3 with arabic numeral', () => {
      const movie = Movie.fromTitle('Back to the Future 3');

      expect(movie.type).toBe(MovieType.BACK_TO_THE_FUTURE);
      expect(movie.episode).toBe(3);
    });

    it('should parse Back to the Future II with roman numerals', () => {
      const movie = Movie.fromTitle('Back to the Future II');

      expect(movie.type).toBe(MovieType.BACK_TO_THE_FUTURE);
      expect(movie.episode).toBe(2);
    });

    it('should parse Back to the Future III with roman numerals', () => {
      const movie = Movie.fromTitle('Back to the Future III');

      expect(movie.type).toBe(MovieType.BACK_TO_THE_FUTURE);
      expect(movie.episode).toBe(3);
    });

    it('should default to episode 1 when no number specified', () => {
      const movie = Movie.fromTitle('Back to the Future');

      expect(movie.type).toBe(MovieType.BACK_TO_THE_FUTURE);
      expect(movie.episode).toBe(1);
    });

    it('should be case insensitive for roman numerals', () => {
      const movie = Movie.fromTitle('back to the future iii');

      expect(movie.type).toBe(MovieType.BACK_TO_THE_FUTURE);
      expect(movie.episode).toBe(3);
    });

    it('should trim whitespace', () => {
      const movie = Movie.fromTitle('  Back to the Future II  ');

      expect(movie.title).toBe('Back to the Future II');
      expect(movie.type).toBe(MovieType.BACK_TO_THE_FUTURE);
      expect(movie.episode).toBe(2);
    });

    it('should parse other movies', () => {
      const movie = Movie.fromTitle('La chèvre');

      expect(movie.type).toBe(MovieType.OTHER);
      expect(movie.episode).toBeUndefined();
    });
  });

  describe('isSameEpisode', () => {
    it('should return false when comparing BTTF with OTHER movie', () => {
      const bttf = new Movie('Back to the Future 1', MovieType.BACK_TO_THE_FUTURE, 1);
      const other = new Movie('La chèvre', MovieType.OTHER);

      expect(bttf.isSameEpisode(other)).toBe(false);
    });

    it('should return false when comparing OTHER movie with BTTF', () => {
      const other = new Movie('La chèvre', MovieType.OTHER);
      const bttf = new Movie('Back to the Future 1', MovieType.BACK_TO_THE_FUTURE, 1);

      expect(other.isSameEpisode(bttf)).toBe(false);
    });

    it('should return false when comparing two OTHER movies', () => {
      const movie1 = new Movie('La chèvre', MovieType.OTHER);
      const movie2 = new Movie('Les bronzés', MovieType.OTHER);

      expect(movie1.isSameEpisode(movie2)).toBe(false);
    });
  });
});
