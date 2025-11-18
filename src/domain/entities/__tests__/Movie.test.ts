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
});
