/**
 * API Error Handling
 * 
 * Provides structured error handling for API calls with user-friendly messages
 */

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor(message = 'Network error. Please check your connection.') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends Error {
  constructor(message = 'Request timed out. Please try again.') {
    super(message);
    this.name = 'TimeoutError';
  }
}

export class ValidationError extends Error {
  constructor(
    public field: string,
    message: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Parse API error response and create appropriate error object
 */
export function parseApiError(error: any): Error {
  // Network errors
  if (error.name === 'AbortError') {
    return new TimeoutError();
  }
  
  if (error.message?.includes('Failed to fetch') || error.message?.includes('network')) {
    return new NetworkError();
  }
  
  // Circuit breaker
  if (error.message === 'circuit_open') {
    return new ApiError(
      503,
      'SERVICE_UNAVAILABLE',
      'Service temporarily unavailable. Please try again in a moment.',
      { circuitOpen: true }
    );
  }
  
  // Server errors
  if (error.message?.startsWith('server_')) {
    const status = parseInt(error.message.split('_')[1]) || 500;
    return createApiError(status);
  }
  
  // Already an ApiError
  if (error instanceof ApiError) {
    return error;
  }
  
  // Generic error
  return new Error(error.message || 'An unexpected error occurred');
}

/**
 * Create ApiError from HTTP status code
 */
export function createApiError(status: number, data?: any): ApiError {
  const message = data?.message || getDefaultErrorMessage(status);
  const code = data?.code || getErrorCode(status);
  
  return new ApiError(status, code, message, data);
}

/**
 * Get default error message for HTTP status code
 */
function getDefaultErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'Please log in to continue.';
    case 403:
      return 'You don\'t have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'This resource already exists.';
    case 422:
      return 'Please check your input and try again.';
    case 429:
      return 'Too many requests. Please slow down.';
    case 500:
      return 'Server error. Please try again later.';
    case 502:
      return 'Bad gateway. Please try again.';
    case 503:
      return 'Service unavailable. Please try again later.';
    case 504:
      return 'Request timeout. Please try again.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

/**
 * Get error code for HTTP status
 */
function getErrorCode(status: number): string {
  switch (status) {
    case 400: return 'BAD_REQUEST';
    case 401: return 'UNAUTHORIZED';
    case 403: return 'FORBIDDEN';
    case 404: return 'NOT_FOUND';
    case 409: return 'CONFLICT';
    case 422: return 'VALIDATION_ERROR';
    case 429: return 'RATE_LIMIT';
    case 500: return 'INTERNAL_ERROR';
    case 502: return 'BAD_GATEWAY';
    case 503: return 'SERVICE_UNAVAILABLE';
    case 504: return 'GATEWAY_TIMEOUT';
    default: return 'UNKNOWN_ERROR';
  }
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: Error): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  
  if (error instanceof NetworkError) {
    return error.message;
  }
  
  if (error instanceof TimeoutError) {
    return error.message;
  }
  
  if (error instanceof ValidationError) {
    return `${error.field}: ${error.message}`;
  }
  
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: Error): boolean {
  if (error instanceof ApiError) {
    // Retry on server errors and rate limits
    return error.status >= 500 || error.status === 429;
  }
  
  if (error instanceof NetworkError || error instanceof TimeoutError) {
    return true;
  }
  
  return false;
}

/**
 * Check if error requires re-authentication
 */
export function requiresReauth(error: Error): boolean {
  if (error instanceof ApiError) {
    return error.status === 401;
  }
  
  return false;
}

/**
 * Log error for monitoring
 * Uses error tracking service if available, falls back to console
 */
export function logError(error: Error, context?: any): void {
  // Use lazy import to avoid circular dependencies
  // This will be replaced at build time and only loads errorTracking when needed
  try {
    // Only import if we're in a browser environment
    if (typeof window !== 'undefined') {
      // Use setTimeout to defer import and break potential circular dependency
      setTimeout(() => {
        import('./errorTracking').then(({ trackError }) => {
          trackError(error, {
            tags: {
              errorType: error.constructor.name,
              ...(error instanceof ApiError && {
                statusCode: String(error.status),
                errorCode: error.code,
              }),
            },
            extra: {
              ...context,
              ...(error instanceof ApiError && {
                apiError: {
                  status: error.status,
                  code: error.code,
                  details: error.details,
                },
              }),
            },
          });
        }).catch(() => {
          // Silent fallback - already handled below
        });
      }, 0);
    }
  } catch {
    // Silent catch - fallback to console
  }

  // Always log to console as well for immediate visibility
  // In Next.js, process.env is replaced at build time, so we can check directly
  // Use a try-catch to handle cases where process is not defined
  let isDevelopment = false;
  try {
    // @ts-ignore - process.env is replaced by Next.js at build time
    isDevelopment = process.env.NODE_ENV === 'development';
  } catch {
    // Default to true if we can't determine
    isDevelopment = true;
  }
  
  if (isDevelopment) {
    console.error('[API Error]', {
      name: error.name,
      message: error.message,
      ...(error instanceof ApiError && {
        status: error.status,
        code: error.code,
        details: error.details
      }),
      context,
      stack: error.stack
    });
  }
}

/**
 * Format validation errors from API
 */
export function formatValidationErrors(errors: Array<{ field: string; message: string }>): string {
  if (errors.length === 1) {
    return `${errors[0].field}: ${errors[0].message}`;
  }
  
  return errors.map(e => `${e.field}: ${e.message}`).join(', ');
}

