export abstract class ValueObject<T> {
  protected readonly _value: T;

  constructor(value: T) {
    this._value = value;
    this.validate();
  }

  /**
   * Get the value
   */
  get value(): T {
    return this._value;
  }

  /**
   * Validate the value object
   */
  protected abstract validate(): void;

  /**
   * Check if two value objects are equal
   */
  equals(other: ValueObject<T>): boolean {
    if (other === null || other === undefined) {
      return false;
    }

    if (this.constructor !== other.constructor) {
      return false;
    }

    return this.equalsValue(other._value);
  }

  /**
   * Check if the value equals another value
   */
  protected abstract equalsValue(other: T): boolean;

  /**
   * Convert to string representation
   */
  abstract toString(): string;
}

// Common Value Objects
export class Email extends ValueObject<string> {
  constructor(email: string) {
    super(email);
  }

  protected validate(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this._value)) {
      throw new Error('Invalid email format');
    }
  }

  protected equalsValue(other: string): boolean {
    return this._value.toLowerCase() === other.toLowerCase();
  }

  toString(): string {
    return this._value;
  }
}

export class Password extends ValueObject<string> {
  constructor(password: string) {
    super(password);
  }

  protected validate(): void {
    if (this._value.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(this._value)) {
      throw new Error('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(this._value)) {
      throw new Error('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(this._value)) {
      throw new Error('Password must contain at least one number');
    }

    if (!/[^A-Za-z0-9]/.test(this._value)) {
      throw new Error('Password must contain at least one special character');
    }
  }

  protected equalsValue(other: string): boolean {
    return this._value === other;
  }

  toString(): string {
    return '[REDACTED]';
  }
}

export class Score extends ValueObject<number> {
  constructor(score: number) {
    super(score);
  }

  protected validate(): void {
    if (this._value < 0 || this._value > 100) {
      throw new Error('Score must be between 0 and 100');
    }
  }

  protected equalsValue(other: number): boolean {
    return this._value === other;
  }

  toString(): string {
    return this._value.toString();
  }
}

export class Rank extends ValueObject<number> {
  constructor(rank: number) {
    super(rank);
  }

  protected validate(): void {
    if (this._value < 1) {
      throw new Error('Rank must be at least 1');
    }
  }

  protected equalsValue(other: number): boolean {
    return this._value === other;
  }

  toString(): string {
    return this._value.toString();
  }
}

export class TenantId extends ValueObject<string> {
  constructor(tenantId: string) {
    super(tenantId);
  }

  protected validate(): void {
    if (!this._value || this._value.trim().length === 0) {
      throw new Error('Tenant ID cannot be empty');
    }
  }

  protected equalsValue(other: string): boolean {
    return this._value === other;
  }

  toString(): string {
    return this._value;
  }
}

export class UserId extends ValueObject<string> {
  constructor(userId: string) {
    super(userId);
  }

  protected validate(): void {
    if (!this._value || this._value.trim().length === 0) {
      throw new Error('User ID cannot be empty');
    }
  }

  protected equalsValue(other: string): boolean {
    return this._value === other;
  }

  toString(): string {
    return this._value;
  }
}
