import { CalculateCartPrice } from '../CalculateCartPrice';

describe('CalculateCartPrice Use Case', () => {
  let calculateCartPrice: CalculateCartPrice;

  beforeEach(() => {
    calculateCartPrice = new CalculateCartPrice();
  });

  describe('Specification examples', () => {
    it('should return 36 for 3 different BTTF episodes', () => {
      const movieTitles = [
        'Back to the Future 1',
        'Back to the Future 2',
        'Back to the Future 3'
      ];

      const result = calculateCartPrice.execute(movieTitles);

      expect(result).toBe(36);
    });

    it('should return 27 for 2 different BTTF episodes', () => {
      const movieTitles = [
        'Back to the Future 1',
        'Back to the Future 3'
      ];

      const result = calculateCartPrice.execute(movieTitles);

      expect(result).toBe(27);
    });

    it('should return 15 for 1 BTTF episode', () => {
      const movieTitles = ['Back to the Future 1'];

      const result = calculateCartPrice.execute(movieTitles);

      expect(result).toBe(15);
    });

    it('should return 48 for 4 BTTF DVDs with 3 different episodes', () => {
      const movieTitles = [
        'Back to the Future 1',
        'Back to the Future 2',
        'Back to the Future 3',
        'Back to the Future 2'
      ];

      const result = calculateCartPrice.execute(movieTitles);

      expect(result).toBe(48);
    });

    it('should return 56 for 3 BTTF episodes + 1 other movie', () => {
      const movieTitles = [
        'Back to the Future 1',
        'Back to the Future 2',
        'Back to the Future 3',
        'La chèvre'
      ];

      const result = calculateCartPrice.execute(movieTitles);

      expect(result).toBe(56);
    });
  });

  describe('Edge cases', () => {
    it('should return 0 for empty list', () => {
      const result = calculateCartPrice.execute([]);

      expect(result).toBe(0);
    });

    it('should handle unknown movie titles as other movies', () => {
      const movieTitles = ['Random Movie'];

      const result = calculateCartPrice.execute(movieTitles);

      expect(result).toBe(20);
    });

    it('should handle case sensitivity', () => {
      const movieTitles = [
        'back to the future 1',
        'BACK TO THE FUTURE 2'
      ];

      const result = calculateCartPrice.execute(movieTitles);

      expect(result).toBe(27);
    });

    it('should handle extra whitespace', () => {
      const movieTitles = [
        '  Back to the Future 1  ',
        'Back to the Future 2'
      ];

      const result = calculateCartPrice.execute(movieTitles);

      expect(result).toBe(27);
    });
  });
});
