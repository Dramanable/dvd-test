import { ArrayInputParser } from '../ArrayInputParser';

describe('ArrayInputParser', () => {
  describe('parse()', () => {
    it('should return array as-is when valid', () => {
      const movies = ['Back to the Future 1', 'Back to the Future 2'];
      const parser = new ArrayInputParser(movies);

      const result = parser.parse('');

      expect(result).toEqual(['Back to the Future 1', 'Back to the Future 2']);
    });

    it('should filter out empty strings', () => {
      const movies = ['Back to the Future 1', '', 'Back to the Future 2', ''];
      const parser = new ArrayInputParser(movies);

      const result = parser.parse('');

      expect(result).toEqual(['Back to the Future 1', 'Back to the Future 2']);
    });

    it('should trim whitespace from titles', () => {
      const movies = ['  Back to the Future 1  ', '  Back to the Future 2  '];
      const parser = new ArrayInputParser(movies);

      const result = parser.parse('');

      expect(result).toEqual(['Back to the Future 1', 'Back to the Future 2']);
    });

    it('should handle empty array', () => {
      const movies: string[] = [];
      const parser = new ArrayInputParser(movies);

      const result = parser.parse('');

      expect(result).toEqual([]);
    });

    it('should filter whitespace-only strings', () => {
      const movies = ['Back to the Future 1', '   ', 'Back to the Future 2', '\t\n'];
      const parser = new ArrayInputParser(movies);

      const result = parser.parse('');

      expect(result).toEqual(['Back to the Future 1', 'Back to the Future 2']);
    });

    it('should handle array with all empty/whitespace strings', () => {
      const movies = ['', '  ', '\t', '\n'];
      const parser = new ArrayInputParser(movies);

      const result = parser.parse('');

      expect(result).toEqual([]);
    });

    it('should preserve movie title casing', () => {
      const movies = ['BACK TO THE FUTURE 1', 'back to the future 2', 'Back To The Future 3'];
      const parser = new ArrayInputParser(movies);

      const result = parser.parse('');

      expect(result).toEqual([
        'BACK TO THE FUTURE 1',
        'back to the future 2',
        'Back To The Future 3',
      ]);
    });

    it('should handle special characters in titles', () => {
      const movies = ['Back to the Future: Part 1', 'Star Wars: Episode IV'];
      const parser = new ArrayInputParser(movies);

      const result = parser.parse('');

      expect(result).toEqual(['Back to the Future: Part 1', 'Star Wars: Episode IV']);
    });

    it('should handle duplicate titles', () => {
      const movies = ['Back to the Future 1', 'Back to the Future 1', 'Back to the Future 2'];
      const parser = new ArrayInputParser(movies);

      const result = parser.parse('');

      expect(result).toEqual([
        'Back to the Future 1',
        'Back to the Future 1',
        'Back to the Future 2',
      ]);
    });

    it('should implement IInputParser interface', () => {
      const movies = ['Back to the Future 1'];
      const parser = new ArrayInputParser(movies);

      // Should have parse method
      expect(typeof parser.parse).toBe('function');

      // parse method should accept string and return string[]
      const result = parser.parse('ignored input');
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
