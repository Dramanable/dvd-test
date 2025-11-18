import { InputParser } from '../InputParser';

describe('InputParser', () => {
  let parser: InputParser;

  beforeEach(() => {
    parser = new InputParser();
  });

  describe('Parsing text input', () => {
    it('should parse single line input', () => {
      const input = 'Back to the Future 1';

      const result = parser.parse(input);

      expect(result).toEqual(['Back to the Future 1']);
    });

    it('should parse multiple lines input', () => {
      const input = `Back to the Future 1
Back to the Future 2
Back to the Future 3`;

      const result = parser.parse(input);

      expect(result).toEqual([
        'Back to the Future 1',
        'Back to the Future 2',
        'Back to the Future 3',
      ]);
    });

    it('should handle empty lines', () => {
      const input = `Back to the Future 1

Back to the Future 2`;

      const result = parser.parse(input);

      expect(result).toEqual(['Back to the Future 1', 'Back to the Future 2']);
    });

    it('should handle leading/trailing whitespace', () => {
      const input = `  Back to the Future 1  
  Back to the Future 2  `;

      const result = parser.parse(input);

      expect(result).toEqual(['Back to the Future 1', 'Back to the Future 2']);
    });

    it('should return empty array for empty input', () => {
      const input = '';

      const result = parser.parse(input);

      expect(result).toEqual([]);
    });

    it('should return empty array for whitespace only input', () => {
      const input = '   \n  \n  ';

      const result = parser.parse(input);

      expect(result).toEqual([]);
    });
  });

  describe('Parsing from specification examples', () => {
    it('should parse example 1 input', () => {
      const input = `Back to the Future 1
Back to the Future 2
Back to the Future 3`;

      const result = parser.parse(input);

      expect(result).toHaveLength(3);
      expect(result[0]).toBe('Back to the Future 1');
    });

    it('should parse example 5 input', () => {
      const input = `Back to the Future 1
Back to the Future 2
Back to the Future 3
La chèvre`;

      const result = parser.parse(input);

      expect(result).toHaveLength(4);
      expect(result[3]).toBe('La chèvre');
    });
  });
});
