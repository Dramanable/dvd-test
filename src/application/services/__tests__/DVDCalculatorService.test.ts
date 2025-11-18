import { IInputParser } from '../../ports/IInputParser';
import { DVDCalculatorService } from '../DVDCalculatorService';

/**
 * Mock implementation of IInputParser for testing
 */
class MockInputParser implements IInputParser {
  parse(input: string): string[] {
    return input
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }
}

describe('DVDCalculatorService', () => {
  let inputParser: IInputParser;
  let service: DVDCalculatorService;

  beforeEach(() => {
    inputParser = new MockInputParser();
  });

  describe('Constructor', () => {
    it('should create service with input parser', () => {
      service = new DVDCalculatorService(inputParser);
      expect(service).toBeInstanceOf(DVDCalculatorService);
    });
  });

  describe('run()', () => {
    beforeEach(() => {
      service = new DVDCalculatorService(inputParser);
    });

    it('should calculate price for single BTTF movie', () => {
      const input = 'Back to the Future 1';
      const result = service.run(input);
      expect(result).toBe(15);
    });

    it('should calculate price for two BTTF movies with 10% discount', () => {
      const input = 'Back to the Future 1\nBack to the Future 2';
      const result = service.run(input);
      expect(result).toBe(27); // 30 - 10% = 27
    });

    it('should calculate price for three BTTF movies with 20% discount', () => {
      const input = 'Back to the Future 1\nBack to the Future 2\nBack to the Future 3';
      const result = service.run(input);
      expect(result).toBe(36); // 45 - 20% = 36
    });

    it('should calculate price for four BTTF movies (duplicate episode)', () => {
      const input =
        'Back to the Future 1\nBack to the Future 2\nBack to the Future 3\nBack to the Future 1';
      const result = service.run(input);
      // 4 DVDs, but only 3 unique episodes: discount = 20%
      // 4 × 15€ = 60€, -20% = 48€
      expect(result).toBe(48);
    });

    it('should handle mixed BTTF and non-BTTF movies', () => {
      const input = 'Back to the Future 1\nOther Movie\nBack to the Future 2';
      const result = service.run(input);
      // 2 BTTF (2 unique episodes) = 10% discount: 30€ × 0.9 = 27€
      // 1 other movie = 20€ (non-BTTF price)
      // Total = 27€ + 20€ = 47€
      expect(result).toBe(47);
    });

    it('should handle empty input', () => {
      const input = '';
      const result = service.run(input);
      expect(result).toBe(0);
    });

    it('should handle input with empty lines', () => {
      const input = 'Back to the Future 1\n\n\nBack to the Future 2\n';
      const result = service.run(input);
      expect(result).toBe(27); // 30 - 10% = 27
    });

    it('should handle input with whitespace', () => {
      const input = '  Back to the Future 1  \n  Back to the Future 2  ';
      const result = service.run(input);
      expect(result).toBe(27);
    });
  });

  describe('runAndDisplay()', () => {
    beforeEach(() => {
      service = new DVDCalculatorService(inputParser);
    });

    it('should display result to console', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const input = 'Back to the Future 1\nBack to the Future 2';

      service.runAndDisplay(input);

      expect(consoleSpy).toHaveBeenCalledWith(27);
      consoleSpy.mockRestore();
    });
  });

  describe('Integration with InputParser', () => {
    it('should use injected input parser', () => {
      const customParser: IInputParser = {
        parse: jest.fn((input: string) => {
          // Custom parsing logic
          return input.split('|').map((s) => s.trim());
        }),
      };

      service = new DVDCalculatorService(customParser);
      const input = 'Back to the Future 1 | Back to the Future 2';

      service.run(input);

      expect(customParser.parse).toHaveBeenCalledWith(input);
    });

    it('should handle parser that returns empty array', () => {
      const emptyParser: IInputParser = {
        parse: () => [],
      };

      service = new DVDCalculatorService(emptyParser);
      const result = service.run('any input');

      expect(result).toBe(0);
    });
  });

  describe('Error handling', () => {
    it('should handle unknown movie titles as regular movies', () => {
      service = new DVDCalculatorService(inputParser);
      const input = 'Unknown Movie 1\nUnknown Movie 2';

      // Unknown titles are treated as regular (non-BTTF) movies: 20€ each
      const result = service.run(input);
      expect(result).toBe(40); // 2 movies × 20€
    });

    it('should handle parser that throws error', () => {
      const errorParser: IInputParser = {
        parse: () => {
          throw new Error('Parser error');
        },
      };

      service = new DVDCalculatorService(errorParser);

      expect(() => service.run('test')).toThrow('Parser error');
    });
  });

  describe('Service behavior', () => {
    it('should be stateless - multiple calls with same input give same result', () => {
      service = new DVDCalculatorService(inputParser);
      const input = 'Back to the Future 1\nBack to the Future 2\nBack to the Future 3';

      const result1 = service.run(input);
      const result2 = service.run(input);
      const result3 = service.run(input);

      expect(result1).toBe(36);
      expect(result2).toBe(36);
      expect(result3).toBe(36);
    });

    it('should handle concurrent calculations independently', () => {
      service = new DVDCalculatorService(inputParser);

      const input1 = 'Back to the Future 1';
      const input2 = 'Back to the Future 1\nBack to the Future 2';
      const input3 = 'Back to the Future 1\nBack to the Future 2\nBack to the Future 3';

      const result1 = service.run(input1);
      const result2 = service.run(input2);
      const result3 = service.run(input3);

      expect(result1).toBe(15);
      expect(result2).toBe(27);
      expect(result3).toBe(36);
    });
  });
});
