import { DVDCalculator } from '../DVDCalculator';
import { MovieType } from '../../domain/entities/Movie';

describe('DVDCalculator SDK', () => {
  let calculator: DVDCalculator;

  beforeEach(() => {
    calculator = new DVDCalculator();
  });

  describe('calculate()', () => {
    it('should calculate price for a single Back to the Future movie', () => {
      const result = calculator.calculate(['Back to the Future 1']);
      expect(result).toBe(15);
    });

    it('should calculate price for two different BTTF episodes with 10% discount', () => {
      const result = calculator.calculate(['Back to the Future 1', 'Back to the Future 2']);
      expect(result).toBe(27); // (15 + 15) * 0.9
    });

    it('should calculate price for three different BTTF episodes with 20% discount', () => {
      const result = calculator.calculate([
        'Back to the Future 1',
        'Back to the Future 2',
        'Back to the Future 3',
      ]);
      expect(result).toBe(36); // (15 + 15 + 15) * 0.8
    });

    it('should calculate price for two same BTTF episodes without discount', () => {
      const result = calculator.calculate(['Back to the Future 1', 'Back to the Future 1']);
      expect(result).toBe(30); // 15 + 15 (no discount)
    });

    it('should calculate price for non-BTTF movies', () => {
      const result = calculator.calculate(['Other Movie', 'Another Movie']);
      expect(result).toBe(40); // 20 + 20
    });

    it('should calculate price for mixed BTTF and non-BTTF movies', () => {
      const result = calculator.calculate([
        'Back to the Future 1',
        'Back to the Future 2',
        'Other Movie',
      ]);
      expect(result).toBe(47); // (15 + 15) * 0.9 + 20 = 27 + 20
    });

    it('should handle empty array', () => {
      const result = calculator.calculate([]);
      expect(result).toBe(0);
    });

    it('should handle array with empty strings', () => {
      const result = calculator.calculate(['', '  ', 'Back to the Future 1']);
      expect(result).toBe(15);
    });
  });

  describe('calculate WithDetails()', () => {
    it('should return detailed calculation result', () => {
      const result = calculator.calculateWithDetails([
        'Back to the Future 1',
        'Back to the Future 2',
      ]);

      expect(result.total).toBe(27);
      expect(result.subtotal).toBe(30);
      expect(result.discount).toBe(3);
      expect(result.discountPercentage).toBe(10);
      expect(result.itemCount).toBe(2);
      expect(result.uniqueEpisodes).toBe(2);
    });

    it('should return zero values for empty cart', () => {
      const result = calculator.calculateWithDetails([]);

      expect(result.total).toBe(0);
      expect(result.subtotal).toBe(0);
      expect(result.discount).toBe(0);
      expect(result.discountPercentage).toBe(0);
      expect(result.itemCount).toBe(0);
      expect(result.uniqueEpisodes).toBe(0);
    });

    it('should include movie details in result', () => {
      const result = calculator.calculateWithDetails(['Back to the Future']);

      expect(result.movies).toHaveLength(1);
      expect(result.movies[0].title).toBe('Back to the Future');
      expect(result.movies[0].type).toBe(MovieType.BACK_TO_THE_FUTURE);
      expect(result.movies[0].basePrice).toBe(15);
    });
  });

  describe('parseMovie()', () => {
    it('should parse Back to the Future movie', () => {
      const movie = calculator.parseMovie('Back to the Future');

      expect(movie.title).toBe('Back to the Future');
      expect(movie.type).toBe(MovieType.BACK_TO_THE_FUTURE);
      expect(movie.getBasePrice()).toBe(15);
    });

    it('should parse Back to the Future II with episode number', () => {
      const movie = calculator.parseMovie('Back to the Future 2');

      expect(movie.title).toBe('Back to the Future 2');
      expect(movie.episode).toBe(2);
    });

    it('should parse Back to the Future III with episode number', () => {
      const movie = calculator.parseMovie('Back to the Future 3');

      expect(movie.title).toBe('Back to the Future 3');
      expect(movie.episode).toBe(3);
    });

    it('should parse non-BTTF movie', () => {
      const movie = calculator.parseMovie('Other Movie');

      expect(movie.title).toBe('Other Movie');
      expect(movie.type).toBe(MovieType.OTHER);
      expect(movie.getBasePrice()).toBe(20);
    });
  });

  describe('Edge cases', () => {
    it('should handle null or undefined gracefully', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => calculator.calculate(null as any)).toThrow();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => calculator.calculate(undefined as any)).toThrow();
    });

    it('should handle very large arrays', () => {
      const movies = Array(1000).fill('Back to the Future 1');
      const result = calculator.calculate(movies);
      expect(result).toBe(15000); // 1000 * 15 (no discount for same episodes)
    });

    it('should trim whitespace from movie titles', () => {
      const result = calculator.calculate(['  Back to the Future 1  ', 'Back to the Future 2   ']);
      expect(result).toBe(27);
    });

    it('should be case-sensitive for movie titles', () => {
      const result = calculator.calculate([
        'back to the future 1', // lowercase - treated as BTTF (case-insensitive)
        'Back to the Future 2', // correct case - BTTF
      ]);
      expect(result).toBe(27); // Both are BTTF with discount
    });
  });

  describe('Fluent API', () => {
    it('should support method chaining', () => {
      const result = calculator
        .reset()
        .addMovie('Back to the Future 1')
        .addMovie('Back to the Future 2')
        .getTotal();

      expect(result).toBe(27);
    });

    it('should support bulk adding movies', () => {
      const result = calculator
        .reset()
        .addMovies(['Back to the Future 1', 'Back to the Future 2', 'Back to the Future 3'])
        .getTotal();

      expect(result).toBe(36);
    });

    it('should allow resetting the calculator', () => {
      calculator.addMovie('Back to the Future 1');
      expect(calculator.getTotal()).toBe(15);

      calculator.reset();
      expect(calculator.getTotal()).toBe(0);
    });

    it('should allow removing movies', () => {
      calculator
        .addMovie('Back to the Future 1')
        .addMovie('Back to the Future 2')
        .removeMovie('Back to the Future 2');

      expect(calculator.getTotal()).toBe(15);
    });
  });

  describe('State management', () => {
    it('should maintain internal state across multiple operations', () => {
      calculator.addMovie('Back to the Future 1');
      expect(calculator.getTotal()).toBe(15);

      calculator.addMovie('Back to the Future 2');
      expect(calculator.getTotal()).toBe(27);

      calculator.addMovie('Back to the Future 3');
      expect(calculator.getTotal()).toBe(36);
    });

    it('should provide cart information', () => {
      calculator.addMovie('Back to the Future 1').addMovie('Back to the Future 2');

      const info = calculator.getCartInfo();
      expect(info.itemCount).toBe(2);
      expect(info.uniqueEpisodes).toBe(2);
      expect(info.total).toBe(27);
    });

    it('should allow getting all movies in cart', () => {
      calculator.addMovie('Back to the Future 1').addMovie('Back to the Future 2');

      const movies = calculator.getMovies();
      expect(movies).toHaveLength(2);
      expect(movies[0].title).toBe('Back to the Future 1');
      expect(movies[1].title).toBe('Back to the Future 2');
    });
  });
});
