import { DVDCalculator } from '../DVDCalculator';

describe('SDK E2E Tests', () => {
  describe('Instance API: calculate()', () => {
    let calculator: DVDCalculator;

    beforeEach(() => {
      calculator = new DVDCalculator();
    });

    it('should calculate price for 3 different BTTF movies (20% discount)', () => {
      const movies = ['Back to the Future 1', 'Back to the Future 2', 'Back to the Future 3'];

      const total = calculator.calculate(movies);

      expect(total).toBe(36);
    });

    it('should calculate price for 2 different BTTF movies (10% discount)', () => {
      const movies = ['Back to the Future 1', 'Back to the Future 2'];

      const total = calculator.calculate(movies);

      expect(total).toBe(27);
    });

    it('should calculate price for 1 BTTF movie (no discount)', () => {
      const movies = ['Back to the Future 1'];

      const total = calculator.calculate(movies);

      expect(total).toBe(15);
    });

    it('should handle empty array', () => {
      const total = calculator.calculate([]);

      expect(total).toBe(0);
    });

    it('should handle mixed BTTF and other movies', () => {
      const movies = ['Back to the Future 1', 'Back to the Future 2', 'Star Wars', 'The Matrix'];

      const total = calculator.calculate(movies);

      expect(total).toBe(67); // 2 BTTF with 10% discount (27) + 2 others at full price (40)
    });

    it('should handle roman numerals', () => {
      const movies = ['Back to the Future II', 'Back to the Future III'];

      const total = calculator.calculate(movies);

      expect(total).toBe(27); // 2 BTTF with episodes 2 and 3 = 2 different episodes with 10% discount = (15×2)×0.9
    });

    it('should be case insensitive', () => {
      const movies = ['BACK TO THE FUTURE 1', 'back to the future 2', 'BaCk To ThE fUtUrE 3'];

      const total = calculator.calculate(movies);

      expect(total).toBe(36);
    });

    it('should handle duplicate movies correctly', () => {
      const movies = ['Back to the Future 1', 'Back to the Future 1', 'Back to the Future 2'];

      const total = calculator.calculate(movies);

      expect(total).toBe(40.5); // 3 movies but only 2 different episodes = 10% discount: 45 * 0.9 = 40.5
    });

    it('should handle whitespace in movie titles', () => {
      const movies = [
        '  Back to the Future 1  ',
        'Back to the Future 2',
        '   Back to the Future 3',
      ];

      const total = calculator.calculate(movies);

      expect(total).toBe(36);
    });
  });

  describe('Detailed API: calculateWithDetails()', () => {
    let calculator: DVDCalculator;

    beforeEach(() => {
      calculator = new DVDCalculator();
    });

    it('should return detailed calculation for 3 BTTF movies', () => {
      const movies = ['Back to the Future 1', 'Back to the Future 2', 'Back to the Future 3'];

      const details = calculator.calculateWithDetails(movies);

      expect(details.total).toBe(36);
      expect(details.subtotal).toBe(45);
      expect(details.discountPercentage).toBe(20);
      expect(details.itemCount).toBe(3);
      expect(details.uniqueEpisodes).toBe(3);
      expect(details.movies).toHaveLength(3);
      expect(details.movies[0].title).toContain('Back to the Future');
      expect(details.movies[0].basePrice).toBe(15);
    });

    it('should return detailed calculation for mixed movies', () => {
      const movies = ['Back to the Future 1', 'Back to the Future 2', 'Star Wars', 'The Matrix'];

      const details = calculator.calculateWithDetails(movies);

      expect(details.total).toBe(67); // 2 BTTF with 10% discount (27) + 2 others (40)
      expect(details.subtotal).toBe(70); // 15+15+20+20
      expect(details.discountPercentage).toBe(4.3); // Actual discount percentage calculated
      expect(details.itemCount).toBe(4);
      expect(details.uniqueEpisodes).toBe(2);
      expect(details.movies).toHaveLength(4);
    });

    it('should return detailed calculation for empty array', () => {
      const details = calculator.calculateWithDetails([]);

      expect(details.total).toBe(0);
      expect(details.subtotal).toBe(0);
      expect(details.discountPercentage).toBe(0);
      expect(details.itemCount).toBe(0);
      expect(details.uniqueEpisodes).toBe(0);
      expect(details.movies).toHaveLength(0);
    });

    it('should include all movie details in response', () => {
      const movies = ['Back to the Future 1', 'Star Wars'];

      const details = calculator.calculateWithDetails(movies);

      expect(details.movies[0]).toHaveProperty('title');
      expect(details.movies[0]).toHaveProperty('basePrice');
      expect(details.movies[0]).toHaveProperty('type');
      expect(details.movies[0]).toHaveProperty('episodeNumber');
      expect(details.movies[0].type).toBe('BACK_TO_THE_FUTURE');
      expect(details.movies[1].type).toBe('OTHER');
      expect(details.movies[1].episodeNumber).toBeDefined(); // OTHER movies have episode 0
    });

    it('should handle large order (10 copies of trilogy)', () => {
      const movies = Array.from({ length: 10 }, () => [
        'Back to the Future 1',
        'Back to the Future 2',
        'Back to the Future 3',
      ]).flat();

      const details = calculator.calculateWithDetails(movies);

      expect(details.itemCount).toBe(30);
      expect(details.uniqueEpisodes).toBe(3);
      expect(details.discountPercentage).toBe(20);
      expect(details.total).toBe(360); // 10 * 36
    });
  });

  describe('Fluent API', () => {
    let calculator: DVDCalculator;

    beforeEach(() => {
      calculator = new DVDCalculator();
    });

    it('should build calculation with addMovie()', () => {
      const result = calculator
        .addMovie('Back to the Future 1')
        .addMovie('Back to the Future 2')
        .addMovie('Back to the Future 3')
        .getTotal();

      expect(result).toBe(36);
    });

    it('should build calculation with addMovies()', () => {
      const movies = ['Back to the Future 1', 'Back to the Future 2', 'Back to the Future 3'];

      const result = calculator.addMovies(movies).getTotal();

      expect(result).toBe(36);
    });

    it('should chain addMovie() and addMovies()', () => {
      const result = calculator
        .addMovie('Back to the Future 1')
        .addMovies(['Back to the Future 2', 'Star Wars'])
        .addMovie('The Matrix')
        .getTotal();

      expect(result).toBe(67); // 2 BTTF (27) + 2 others (40)
    });

    it('should reset calculator', () => {
      calculator.addMovie('Back to the Future 1').addMovie('Back to the Future 2');

      const firstResult = calculator.getTotal();
      expect(firstResult).toBe(27);

      calculator.reset();
      const resetResult = calculator.getTotal();
      expect(resetResult).toBe(0);
    });

    it('should calculate multiple times without reset', () => {
      calculator.addMovie('Back to the Future 1');
      const first = calculator.getTotal();
      expect(first).toBe(15);

      calculator.addMovie('Back to the Future 2');
      const second = calculator.getTotal();
      expect(second).toBe(27);

      calculator.addMovie('Back to the Future 3');
      const third = calculator.getTotal();
      expect(third).toBe(36);
    });

    it('should get detailed cart info with fluent API', () => {
      const info = calculator
        .addMovie('Back to the Future 1')
        .addMovie('Back to the Future 2')
        .addMovie('Back to the Future 3')
        .getCartInfo();

      expect(info.total).toBe(36);
      expect(info.uniqueEpisodes).toBe(3);
      expect(info.discount).toBe(9);
      expect(info.subtotal).toBe(45);
    });

    it('should remove movies from cart', () => {
      calculator
        .addMovie('Back to the Future 1')
        .addMovie('Back to the Future 2')
        .addMovie('Star Wars');

      expect(calculator.getTotal()).toBe(47); // 2 BTTF (27) + 1 other (20)

      calculator.removeMovie('Star Wars');
      expect(calculator.getTotal()).toBe(27);
    });

    it('should get movies from cart', () => {
      calculator.addMovie('Back to the Future 1').addMovie('Back to the Future 2');

      const movies = calculator.getMovies();
      expect(movies).toHaveLength(2);
      expect(movies[0].title).toContain('Back to the Future');
    });
  });

  describe('Real-World Scenarios', () => {
    let calculator: DVDCalculator;

    beforeEach(() => {
      calculator = new DVDCalculator();
    });

    it('should handle real-world trilogy collection order', () => {
      const movies = [
        'Back to the Future', // Episode 1 (default)
        'Back to the Future 2',
        'Back to the Future III',
        'Star Wars Episode IV',
        'Star Wars Episode V',
        'The Matrix',
      ];

      const details = calculator.calculateWithDetails(movies);

      expect(details.itemCount).toBe(6);
      expect(details.uniqueEpisodes).toBe(3); // 3 different BTTF
      expect(details.discountPercentage).toBe(8.6); // Decimal discount percentage
      expect(details.total).toBe(96); // 3 BTTF (36) + 3 others (60)
    });

    it('should handle multiple copies of same episode', () => {
      const movies = ['Back to the Future 1', 'Back to the Future 1', 'Back to the Future 1'];

      const details = calculator.calculateWithDetails(movies);

      expect(details.itemCount).toBe(3);
      expect(details.uniqueEpisodes).toBe(1);
      expect(details.discountPercentage).toBe(0);
      expect(details.total).toBe(45); // 3 * 15, no discount
    });

    it('should validate empty strings are ignored', () => {
      const movies = ['Back to the Future 1', '', 'Back to the Future 2', '   '];

      const details = calculator.calculateWithDetails(movies);

      expect(details.itemCount).toBe(2);
      expect(details.movies).toHaveLength(2);
    });

    it('should handle concurrent calculations (independent instances)', () => {
      const calculations = Array.from({ length: 100 }, (_, i) => {
        const calc = new DVDCalculator();
        const movies =
          i % 2 === 0
            ? ['Back to the Future 1', 'Back to the Future 2', 'Back to the Future 3']
            : ['Back to the Future 1', 'Back to the Future 2'];

        return calc.calculate(movies);
      });

      const expected36 = calculations.filter((c) => c === 36).length;
      const expected27 = calculations.filter((c) => c === 27).length;

      expect(expected36).toBe(50);
      expect(expected27).toBe(50);
    });

    it('should support shopping cart workflow', () => {
      // Customer browses and adds movies
      calculator.addMovie('Back to the Future 1').addMovie('Back to the Future 2');

      // Check current total
      expect(calculator.getTotal()).toBe(27);

      // Customer decides to complete the trilogy
      calculator.addMovie('Back to the Future 3');

      // Gets better discount now
      expect(calculator.getTotal()).toBe(36);

      // Customer removes one movie
      calculator.removeMovie('Back to the Future 3');

      // Back to 10% discount
      expect(calculator.getTotal()).toBe(27);
    });
  });

  describe('Error Handling', () => {
    let calculator: DVDCalculator;

    beforeEach(() => {
      calculator = new DVDCalculator();
    });

    it('should throw error for null in calculate', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => calculator.calculate(null as any)).toThrow();
    });

    it('should throw error for undefined in calculate', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => calculator.calculate(undefined as any)).toThrow();
    });

    it('should throw error for null in calculateWithDetails', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => calculator.calculateWithDetails(null as any)).toThrow();
    });

    it('should throw error for undefined in calculateWithDetails', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => calculator.calculateWithDetails(undefined as any)).toThrow();
    });

    it('should handle array with empty values gracefully', () => {
      const movies = ['Back to the Future 1', '', 'Back to the Future 2', '   '];

      const details = calculator.calculateWithDetails(movies);

      expect(details.itemCount).toBe(2);
      expect(details.movies).toHaveLength(2);
    });
  });

  describe('Integration: API Consistency', () => {
    it('should return same results for both direct and fluent APIs', () => {
      const movies = ['Back to the Future 1', 'Back to the Future 2', 'Back to the Future 3'];

      const calculator1 = new DVDCalculator();
      const calculator2 = new DVDCalculator();

      const directResult = calculator1.calculate(movies);
      const fluentResult = calculator2.addMovies(movies).getTotal();

      expect(directResult).toBe(36);
      expect(fluentResult).toBe(36);
    });

    it('should maintain consistency across multiple calculations', () => {
      const movies = ['Back to the Future 1', 'Back to the Future 2'];

      const results = Array.from({ length: 10 }, () => {
        const calc = new DVDCalculator();
        return calc.calculate(movies);
      });

      results.forEach((result) => expect(result).toBe(27));
    });

    it('should produce consistent detailed and simple results', () => {
      const movies = ['Back to the Future 1', 'Back to the Future 2', 'Star Wars'];
      const calculator = new DVDCalculator();

      const simpleTotal = calculator.calculate(movies);
      const detailedTotal = calculator.calculateWithDetails(movies).total;

      expect(simpleTotal).toBe(detailedTotal);
      expect(simpleTotal).toBe(47); // 2 BTTF (27) + 1 other (20)
    });
  });
});
