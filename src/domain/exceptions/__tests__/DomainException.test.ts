import { DomainException } from '../DomainException';

// Create a concrete implementation for testing
class TestException extends DomainException {
  constructor(message: string) {
    super(message, 'TEST_ERROR');
  }
}

describe('DomainException', () => {
  describe('Constructor', () => {
    it('should create exception with message and code', () => {
      const exception = new TestException('Test error message');

      expect(exception.message).toBe('Test error message');
      expect(exception.code).toBe('TEST_ERROR');
      expect(exception.name).toBe('TestException');
      expect(exception).toBeInstanceOf(DomainException);
      expect(exception).toBeInstanceOf(Error);
    });

    it('should have timestamp', () => {
      const before = new Date();
      const exception = new TestException('Test');
      const after = new Date();

      expect(exception.timestamp).toBeInstanceOf(Date);
      expect(exception.timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(exception.timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('toJSON', () => {
    it('should convert to JSON format', () => {
      const exception = new TestException('Test error');
      const json = exception.toJSON();

      expect(json).toHaveProperty('name', 'TestException');
      expect(json).toHaveProperty('message', 'Test error');
      expect(json).toHaveProperty('code', 'TEST_ERROR');
      expect(json).toHaveProperty('timestamp');
      expect(typeof json.timestamp).toBe('string');

      // Verify timestamp is ISO format
      expect(() => new Date(json.timestamp as string)).not.toThrow();
    });

    it('should have ISO timestamp format', () => {
      const exception = new TestException('Test');
      const json = exception.toJSON();

      const timestamp = json.timestamp as string;
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });

  describe('Error properties', () => {
    it('should have proper error name', () => {
      const exception = new TestException('Test');
      expect(exception.name).toBe('TestException');
    });

    it('should have stack trace', () => {
      const exception = new TestException('Test');
      expect(exception.stack).toBeDefined();
      expect(exception.stack).toContain('TestException');
    });

    it('should capture stack trace at creation point', () => {
      function throwError(): never {
        throw new TestException('From function');
      }

      try {
        throwError();
      } catch (error) {
        if (error instanceof TestException) {
          expect(error.stack).toContain('throwError');
        }
      }
    });
  });

  describe('Throwable behavior', () => {
    it('should be throwable', () => {
      expect(() => {
        throw new TestException('Throwable error');
      }).toThrow(TestException);

      expect(() => {
        throw new TestException('Throwable error');
      }).toThrow('Throwable error');
    });

    it('should be catchable as DomainException', () => {
      try {
        throw new TestException('Test');
      } catch (error) {
        expect(error).toBeInstanceOf(DomainException);
        if (error instanceof DomainException) {
          expect(error.code).toBe('TEST_ERROR');
        }
      }
    });

    it('should be catchable as Error', () => {
      try {
        throw new TestException('Test');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        if (error instanceof Error) {
          expect(error.message).toBe('Test');
        }
      }
    });
  });

  describe('Inheritance', () => {
    it('should allow custom error codes', () => {
      class CustomException extends DomainException {
        constructor(message: string) {
          super(message, 'CUSTOM_CODE');
        }
      }

      const exception = new CustomException('Custom error');
      expect(exception.code).toBe('CUSTOM_CODE');
      expect(exception.name).toBe('CustomException');
    });

    it('should maintain instanceof relationships', () => {
      class SpecificException extends DomainException {
        constructor() {
          super('Specific error', 'SPECIFIC_ERROR');
        }
      }

      const exception = new SpecificException();
      expect(exception).toBeInstanceOf(SpecificException);
      expect(exception).toBeInstanceOf(DomainException);
      expect(exception).toBeInstanceOf(Error);
    });
  });
});
