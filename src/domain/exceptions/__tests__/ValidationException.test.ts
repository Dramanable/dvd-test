import { ValidationException } from '../ValidationException';
import { DomainException } from '../DomainException';

describe('ValidationException', () => {
  describe('Constructor', () => {
    it('should create exception with message and code', () => {
      const exception = new ValidationException('Invalid input', 'email', 'invalid@');

      expect(exception.message).toBe('Invalid input');
      expect(exception.code).toBe('VALIDATION_ERROR');
      expect(exception.field).toBe('email');
      expect(exception.value).toBe('invalid@');
      expect(exception.name).toBe('ValidationException');
      expect(exception).toBeInstanceOf(ValidationException);
      expect(exception).toBeInstanceOf(DomainException);
      expect(exception).toBeInstanceOf(Error);
    });

    it('should have timestamp', () => {
      const before = new Date();
      const exception = new ValidationException('Test');
      const after = new Date();

      expect(exception.timestamp).toBeInstanceOf(Date);
      expect(exception.timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(exception.timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('should work without field and value', () => {
      const exception = new ValidationException('Generic error');

      expect(exception.message).toBe('Generic error');
      expect(exception.field).toBeUndefined();
      expect(exception.value).toBeUndefined();
    });
  });

  describe('Static factory methods', () => {
    it('should create nullOrUndefined exception', () => {
      const exception = ValidationException.nullOrUndefined('movieTitles');

      expect(exception.message).toBe('movieTitles cannot be null or undefined');
      expect(exception.code).toBe('VALIDATION_ERROR');
      expect(exception.field).toBe('movieTitles');
      expect(exception.value).toBeNull();
    });

    it('should create invalidType exception', () => {
      const exception = ValidationException.invalidType('age', 'number', 'abc');

      expect(exception.message).toBe('age must be of type number');
      expect(exception.code).toBe('VALIDATION_ERROR');
      expect(exception.field).toBe('age');
      expect(exception.value).toBe('abc');
    });

    it('should create emptyArray exception', () => {
      const exception = ValidationException.emptyArray('items');

      expect(exception.message).toBe('items cannot be an empty array');
      expect(exception.code).toBe('VALIDATION_ERROR');
      expect(exception.field).toBe('items');
      expect(exception.value).toEqual([]);
    });
  });

  describe('toJSON', () => {
    it('should convert to JSON format', () => {
      const exception = new ValidationException('Invalid email', 'email', 'test@');
      const json = exception.toJSON();

      expect(json).toHaveProperty('name', 'ValidationException');
      expect(json).toHaveProperty('message', 'Invalid email');
      expect(json).toHaveProperty('code', 'VALIDATION_ERROR');
      expect(json).toHaveProperty('timestamp');
      expect(json).toHaveProperty('field', 'email');
      expect(json).toHaveProperty('value', 'test@');
      expect(typeof json.timestamp).toBe('string');
    });

    it('should handle exceptions without field', () => {
      const exception = new ValidationException('Generic error');
      const json = exception.toJSON();

      expect(json.field).toBeUndefined();
      expect(json.value).toBeUndefined();
    });
  });

  describe('Error properties', () => {
    it('should have proper error name', () => {
      const exception = new ValidationException('Test');
      expect(exception.name).toBe('ValidationException');
    });

    it('should have stack trace', () => {
      const exception = new ValidationException('Test');
      expect(exception.stack).toBeDefined();
      expect(exception.stack).toContain('ValidationException');
    });

    it('should be throwable', () => {
      expect(() => {
        throw ValidationException.nullOrUndefined('field');
      }).toThrow(ValidationException);

      expect(() => {
        throw ValidationException.nullOrUndefined('field');
      }).toThrow('field cannot be null or undefined');
    });
  });

  describe('Integration with try-catch', () => {
    it('should be catchable as ValidationException', () => {
      try {
        throw ValidationException.nullOrUndefined('test');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationException);
        if (error instanceof ValidationException) {
          expect(error.field).toBe('test');
          expect(error.code).toBe('VALIDATION_ERROR');
        }
      }
    });

    it('should be catchable as DomainException', () => {
      try {
        throw ValidationException.invalidType('age', 'number', '25');
      } catch (error) {
        expect(error).toBeInstanceOf(DomainException);
        if (error instanceof DomainException) {
          expect(error.code).toBe('VALIDATION_ERROR');
        }
      }
    });

    it('should be catchable as Error', () => {
      try {
        throw ValidationException.emptyArray('movies');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        if (error instanceof Error) {
          expect(error.message).toBe('movies cannot be an empty array');
        }
      }
    });
  });
});
