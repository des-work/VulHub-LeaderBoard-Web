/**
 * useValidation Hook
 * 
 * React hook for form validation with real-time feedback
 */

import { useState, useCallback } from 'react';
import { ValidationSchema, validate, ValidationError } from './schemas';

interface ValidationState {
  errors: Record<string, string>;
  isValid: boolean;
  touched: Record<string, boolean>;
}

interface ValidationHook {
  errors: Record<string, string>;
  isValid: boolean;
  touched: Record<string, boolean>;
  validateField: (field: string, value: any) => boolean;
  validateAll: (data: Record<string, any>) => boolean;
  touch: (field: string) => void;
  reset: () => void;
}

/**
 * Hook for form validation
 * 
 * @param schema - Validation schema
 * @returns Validation state and methods
 * 
 * @example
 * ```tsx
 * const { errors, isValid, validateField, validateAll } = useValidation(authSchemas.login);
 * 
 * const handleSubmit = (e) => {
 *   e.preventDefault();
 *   if (validateAll(formData)) {
 *     // Submit form
 *   }
 * };
 * 
 * <input
 *   onChange={(e) => validateField('email', e.target.value)}
 *   className={errors.email ? 'border-red-500' : ''}
 * />
 * {errors.email && <p className="text-red-500">{errors.email}</p>}
 * ```
 */
export function useValidation(schema: ValidationSchema): ValidationHook {
  const [state, setState] = useState<ValidationState>({
    errors: {},
    isValid: true,
    touched: {},
  });

  /**
   * Validate a single field
   */
  const validateField = useCallback(
    (field: string, value: any): boolean => {
      const fieldRules = schema[field];
      if (!fieldRules) {return true;}

      let fieldError = '';

      for (const rule of fieldRules) {
        if (!rule.validator(value)) {
          fieldError = rule.message;
          break;
        }
      }

      setState((prev) => {
        const newErrors = { ...prev.errors };
        if (fieldError) {
          newErrors[field] = fieldError;
        } else {
          delete newErrors[field];
        }

        return {
          ...prev,
          errors: newErrors,
          isValid: Object.keys(newErrors).length === 0,
        };
      });

      return !fieldError;
    },
    [schema]
  );

  /**
   * Validate all fields
   */
  const validateAll = useCallback(
    (data: Record<string, any>): boolean => {
      const validationErrors = validate(data, schema);

      const errorMap: Record<string, string> = {};
      validationErrors.forEach((err) => {
        errorMap[err.field] = err.message;
      });

      const touchedMap: Record<string, boolean> = {};
      Object.keys(schema).forEach((field) => {
        touchedMap[field] = true;
      });

      setState({
        errors: errorMap,
        isValid: validationErrors.length === 0,
        touched: touchedMap,
      });

      return validationErrors.length === 0;
    },
    [schema]
  );

  /**
   * Mark field as touched
   */
  const touch = useCallback((field: string) => {
    setState((prev) => ({
      ...prev,
      touched: {
        ...prev.touched,
        [field]: true,
      },
    }));
  }, []);

  /**
   * Reset validation state
   */
  const reset = useCallback(() => {
    setState({
      errors: {},
      isValid: true,
      touched: {},
    });
  }, []);

  return {
    errors: state.errors,
    isValid: state.isValid,
    touched: state.touched,
    validateField,
    validateAll,
    touch,
    reset,
  };
}

