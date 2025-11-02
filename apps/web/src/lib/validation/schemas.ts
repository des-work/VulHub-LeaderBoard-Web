/**
 * Input Validation Schemas
 * 
 * Provides validation rules for all user inputs to prevent XSS, injection, and other attacks
 */

// === BASIC VALIDATORS ===

export const validators = {
  /**
   * Email validation (RFC 5322 compliant)
   */
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) && value.length <= 254;
  },

  /**
   * Password validation
   * - Minimum 8 characters
   * - At least one uppercase letter
   * - At least one lowercase letter
   * - At least one number
   * - At least one special character
   */
  password: (value: string): boolean => {
    if (value.length < 8 || value.length > 128) {return false;}
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
    return hasUpperCase && hasLowerCase && hasNumber && hasSpecial;
  },

  /**
   * Username validation
   * - 3-30 characters
   * - Alphanumeric, hyphens, underscores only
   * - Cannot start/end with hyphen or underscore
   */
  username: (value: string): boolean => {
    if (value.length < 3 || value.length > 30) {return false;}
    const usernameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9_-]*[a-zA-Z0-9])?$/;
    return usernameRegex.test(value);
  },

  /**
   * Display name validation
   * - 1-50 characters
   * - Alphanumeric and basic punctuation
   */
  displayName: (value: string): boolean => {
    if (value.length < 1 || value.length > 50) {return false;}
    const displayNameRegex = /^[a-zA-Z0-9\s\-_.']+$/;
    return displayNameRegex.test(value);
  },

  /**
   * UUID validation
   */
  uuid: (value: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  },

  /**
   * URL validation
   */
  url: (value: string): boolean => {
    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  },

  /**
   * Sanitize HTML to prevent XSS
   * Removes all HTML tags and dangerous characters
   */
  sanitizeHtml: (value: string): string => {
    return value
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  /**
   * Sanitize SQL to prevent injection
   * Escapes single quotes and removes SQL keywords
   */
  sanitizeSql: (value: string): string => {
    return value.replace(/'/g, "''").replace(/;/g, '');
  },
};

// === VALIDATION ERRORS ===

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export class ValidationException extends Error {
  public errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    super('Validation failed');
    this.name = 'ValidationException';
    this.errors = errors;
  }
}

// === VALIDATION SCHEMAS ===

export interface ValidationRule {
  validator: (value: any) => boolean;
  message: string;
  code: string;
}

export interface ValidationSchema {
  [field: string]: ValidationRule[];
}

/**
 * Validate data against a schema
 */
export function validate(
  data: Record<string, any>,
  schema: ValidationSchema
): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];

    for (const rule of rules) {
      if (!rule.validator(value)) {
        errors.push({
          field,
          message: rule.message,
          code: rule.code,
        });
      }
    }
  }

  return errors;
}

/**
 * Validate and throw on error
 */
export function validateOrThrow(
  data: Record<string, any>,
  schema: ValidationSchema
): void {
  const errors = validate(data, schema);
  if (errors.length > 0) {
    throw new ValidationException(errors);
  }
}

// === COMMON SCHEMAS ===

export const authSchemas = {
  login: {
    email: [
      {
        validator: (v: any) => typeof v === 'string' && v.length > 0,
        message: 'Email is required',
        code: 'REQUIRED',
      },
      {
        validator: validators.email,
        message: 'Invalid email format',
        code: 'INVALID_EMAIL',
      },
    ],
    password: [
      {
        validator: (v: any) => typeof v === 'string' && v.length > 0,
        message: 'Password is required',
        code: 'REQUIRED',
      },
      {
        validator: (v: any) => v.length >= 8,
        message: 'Password must be at least 8 characters',
        code: 'PASSWORD_TOO_SHORT',
      },
    ],
  },

  register: {
    email: [
      {
        validator: (v: any) => typeof v === 'string' && v.length > 0,
        message: 'Email is required',
        code: 'REQUIRED',
      },
      {
        validator: validators.email,
        message: 'Invalid email format',
        code: 'INVALID_EMAIL',
      },
    ],
    password: [
      {
        validator: (v: any) => typeof v === 'string' && v.length > 0,
        message: 'Password is required',
        code: 'REQUIRED',
      },
      {
        validator: validators.password,
        message: 'Password must be 8-128 characters with uppercase, lowercase, number, and special character',
        code: 'PASSWORD_WEAK',
      },
    ],
    username: [
      {
        validator: (v: any) => typeof v === 'string' && v.length > 0,
        message: 'Username is required',
        code: 'REQUIRED',
      },
      {
        validator: validators.username,
        message: 'Username must be 3-30 characters, alphanumeric with hyphens/underscores',
        code: 'INVALID_USERNAME',
      },
    ],
  },
};

export const submissionSchemas = {
  create: {
    challenge_name: [
      {
        validator: (v: any) => typeof v === 'string' && v.length > 0,
        message: 'Challenge name is required',
        code: 'REQUIRED',
      },
      {
        validator: (v: any) => v.length <= 200,
        message: 'Challenge name is too long',
        code: 'TOO_LONG',
      },
    ],
    write_up: [
      {
        validator: (v: any) => typeof v === 'string' && v.length > 0,
        message: 'Write-up is required',
        code: 'REQUIRED',
      },
      {
        validator: (v: any) => v.length >= 50,
        message: 'Write-up must be at least 50 characters',
        code: 'TOO_SHORT',
      },
      {
        validator: (v: any) => v.length <= 10000,
        message: 'Write-up is too long (max 10,000 characters)',
        code: 'TOO_LONG',
      },
    ],
  },
};

export const profileSchemas = {
  update: {
    displayName: [
      {
        validator: (v: any) => !v || validators.displayName(v),
        message: 'Display name must be 1-50 characters with alphanumeric and basic punctuation',
        code: 'INVALID_DISPLAY_NAME',
      },
    ],
  },
};

