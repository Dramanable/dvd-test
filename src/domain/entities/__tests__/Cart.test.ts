import { Cart } from '../Cart';
import { Movie, MovieType } from '../Movie';

describe('Cart Entity', () => {
  let cart: Cart;

  beforeEach(() => {
    cart = new Cart();
  });

  describe('Adding movies', () => {
    it('should start with an empty cart', () => {
      expect(cart.getMovies()).toEqual([]);
    });

    it('should add a movie to the cart', () => {
      const movie = new Movie('Back to the Future 1', MovieType.BACK_TO_THE_FUTURE, 1);
      cart.addMovie(movie);

      expect(cart.getMovies()).toHaveLength(1);
      expect(cart.getMovies()[0]).toBe(movie);
    });

    it('should add multiple movies to the cart', () => {
      const movie1 = new Movie('Back to the Future 1', MovieType.BACK_TO_THE_FUTURE, 1);
      const movie2 = new Movie('Back to the Future 2', MovieType.BACK_TO_THE_FUTURE, 2);
      cart.addMovie(movie1);
      cart.addMovie(movie2);

      expect(cart.getMovies()).toHaveLength(2);
    });
  });

  describe('Price calculation - Examples from specification', () => {
    it('should calculate 36€ for 3 different BTTF episodes (example 1)', () => {
      // 3 different episodes = 20% discount
      // (15 * 3) * 0.8 = 36
      cart.addMovie(new Movie('Back to the Future 1', MovieType.BACK_TO_THE_FUTURE, 1));
      cart.addMovie(new Movie('Back to the Future 2', MovieType.BACK_TO_THE_FUTURE, 2));
      cart.addMovie(new Movie('Back to the Future 3', MovieType.BACK_TO_THE_FUTURE, 3));

      expect(cart.calculateTotal()).toBe(36);
    });

    it('should calculate 27€ for 2 different BTTF episodes (example 2)', () => {
      // 2 different episodes = 10% discount
      // (15 * 2) * 0.9 = 27
      cart.addMovie(new Movie('Back to the Future 1', MovieType.BACK_TO_THE_FUTURE, 1));
      cart.addMovie(new Movie('Back to the Future 3', MovieType.BACK_TO_THE_FUTURE, 3));

      expect(cart.calculateTotal()).toBe(27);
    });

    it('should calculate 15€ for 1 BTTF episode (example 3)', () => {
      // 1 episode = no discount
      // 15 * 1 = 15
      cart.addMovie(new Movie('Back to the Future 1', MovieType.BACK_TO_THE_FUTURE, 1));

      expect(cart.calculateTotal()).toBe(15);
    });

    it('should calculate 48€ for 4 BTTF DVDs with 3 different episodes (example 4)', () => {
      // 4 DVDs but only 3 different episodes = 20% discount on all BTTF
      // (15 * 4) * 0.8 = 48
      cart.addMovie(new Movie('Back to the Future 1', MovieType.BACK_TO_THE_FUTURE, 1));
      cart.addMovie(new Movie('Back to the Future 2', MovieType.BACK_TO_THE_FUTURE, 2));
      cart.addMovie(new Movie('Back to the Future 3', MovieType.BACK_TO_THE_FUTURE, 3));
      cart.addMovie(new Movie('Back to the Future 2', MovieType.BACK_TO_THE_FUTURE, 2));

      expect(cart.calculateTotal()).toBe(48);
    });

    it('should calculate 56€ for 3 BTTF episodes + 1 other movie (example 5)', () => {
      // 3 different BTTF episodes = 20% discount on BTTF only
      // ((15 * 3) * 0.8) + 20 = 56
      cart.addMovie(new Movie('Back to the Future 1', MovieType.BACK_TO_THE_FUTURE, 1));
      cart.addMovie(new Movie('Back to the Future 2', MovieType.BACK_TO_THE_FUTURE, 2));
      cart.addMovie(new Movie('Back to the Future 3', MovieType.BACK_TO_THE_FUTURE, 3));
      cart.addMovie(new Movie('La chèvre', MovieType.OTHER));

      expect(cart.calculateTotal()).toBe(56);
    });
  });

  describe('Edge cases', () => {
    it('should calculate 0€ for an empty cart', () => {
      expect(cart.calculateTotal()).toBe(0);
    });

    it('should calculate 20€ for a single other movie', () => {
      cart.addMovie(new Movie('La chèvre', MovieType.OTHER));

      expect(cart.calculateTotal()).toBe(20);
    });

    it('should calculate 40€ for two other movies (no discount)', () => {
      cart.addMovie(new Movie('La chèvre', MovieType.OTHER));
      cart.addMovie(new Movie('Forward to the Past', MovieType.OTHER));

      expect(cart.calculateTotal()).toBe(40);
    });

    it('should not apply discount with only 1 BTTF episode (multiple copies)', () => {
      // 3 copies of the same episode = no discount
      // 15 * 3 = 45
      cart.addMovie(new Movie('Back to the Future 1', MovieType.BACK_TO_THE_FUTURE, 1));
      cart.addMovie(new Movie('Back to the Future 1', MovieType.BACK_TO_THE_FUTURE, 1));
      cart.addMovie(new Movie('Back to the Future 1', MovieType.BACK_TO_THE_FUTURE, 1));

      expect(cart.calculateTotal()).toBe(45);
    });
  });
});
