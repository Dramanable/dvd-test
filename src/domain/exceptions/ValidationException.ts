import { DomainException } from './DomainException';

/**
 * Exception thrown when input validation fails
 * Used for null checks, type validation, and business rule violations
 */
export class ValidationException extends DomainException {
  public readonly field?: string;
  public readonly value?: unknown;

  constructor(message: string, field?: string, value?: unknown) {
    super(message, 'VALIDATION_ERROR');
    this.field = field;
    this.value = value;
  }

  /**
   * Create a ValidationException for null or undefined values
   */
  static nullOrUndefined(fieldName: string): ValidationException {
    return new ValidationException(`${fieldName} cannot be null or undefined`, fieldName, null);
  }

  /**
   * Create a ValidationException for invalid types
   */
  static invalidType(
    fieldName: string,
    expectedType: string,
    actualValue: unknown
  ): ValidationException {
    return new ValidationException(
      `${fieldName} must be of type ${expectedType}`,
      fieldName,
      actualValue
    );
  }

  /**
   * Create a ValidationException for empty arrays
   */
  static emptyArray(fieldName: string): ValidationException {
    return new ValidationException(`${fieldName} cannot be an empty array`, fieldName, []);
  }

  /**
   * Convert exception to JSON format with field information
   */
  override toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      field: this.field,
      value: this.value,
    };
  }
}
