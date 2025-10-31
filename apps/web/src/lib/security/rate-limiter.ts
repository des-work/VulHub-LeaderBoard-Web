/**
 * Client-Side Rate Limiter
 * 
 * Prevents brute force attacks and abuse by limiting request frequency
 */

interface RateLimitConfig {
  /**
   * Maximum number of requests allowed in the window
   */
  maxRequests: number;

  /**
   * Time window in milliseconds
   */
  windowMs: number;

  /**
   * Unique key for this rate limiter (e.g., 'login', 'register')
   */
  key: string;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

/**
 * Simple client-side rate limiter using localStorage
 * 
 * @example
 * ```ts
 * const limiter = new RateLimiter({
 *   maxRequests: 5,
 *   windowMs: 60000, // 1 minute
 *   key: 'login'
 * });
 * 
 * if (!limiter.check()) {
 *   alert('Too many attempts. Please wait.');
 *   return;
 * }
 * 
 * limiter.increment();
 * // Proceed with request
 * ```
 */
export class RateLimiter {
  private config: RateLimitConfig;
  private storageKey: string;

  constructor(config: RateLimitConfig) {
    this.config = config;
    this.storageKey = `rate_limit_${config.key}`;
  }

  /**
   * Get current rate limit status
   */
  private getStatus(): RateLimitEntry {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) {
        return { count: 0, resetTime: Date.now() + this.config.windowMs };
      }

      const entry: RateLimitEntry = JSON.parse(stored);

      // Reset if window has passed
      if (Date.now() >= entry.resetTime) {
        return { count: 0, resetTime: Date.now() + this.config.windowMs };
      }

      return entry;
    } catch {
      return { count: 0, resetTime: Date.now() + this.config.windowMs };
    }
  }

  /**
   * Save rate limit status
   */
  private setStatus(entry: RateLimitEntry): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(entry));
    } catch {
      // Ignore localStorage errors
    }
  }

  /**
   * Check if request is allowed
   * 
   * @returns true if allowed, false if rate limited
   */
  check(): boolean {
    const status = this.getStatus();
    return status.count < this.config.maxRequests;
  }

  /**
   * Increment request count
   * 
   * @returns true if incremented, false if rate limited
   */
  increment(): boolean {
    const status = this.getStatus();

    if (status.count >= this.config.maxRequests) {
      return false;
    }

    status.count++;
    this.setStatus(status);
    return true;
  }

  /**
   * Get remaining requests in current window
   */
  remaining(): number {
    const status = this.getStatus();
    return Math.max(0, this.config.maxRequests - status.count);
  }

  /**
   * Get time until reset in milliseconds
   */
  timeUntilReset(): number {
    const status = this.getStatus();
    return Math.max(0, status.resetTime - Date.now());
  }

  /**
   * Reset rate limit
   */
  reset(): void {
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Get formatted time until reset (e.g., "2m 30s")
   */
  getResetTime(): string {
    const ms = this.timeUntilReset();
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);

    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  }
}

// === PRE-CONFIGURED RATE LIMITERS ===

/**
 * Rate limiter for login attempts
 * - 5 attempts per 5 minutes
 */
export const loginRateLimiter = new RateLimiter({
  maxRequests: 5,
  windowMs: 5 * 60 * 1000, // 5 minutes
  key: 'login',
});

/**
 * Rate limiter for registration attempts
 * - 3 attempts per 15 minutes
 */
export const registerRateLimiter = new RateLimiter({
  maxRequests: 3,
  windowMs: 15 * 60 * 1000, // 15 minutes
  key: 'register',
});

/**
 * Rate limiter for password reset attempts
 * - 3 attempts per 15 minutes
 */
export const passwordResetRateLimiter = new RateLimiter({
  maxRequests: 3,
  windowMs: 15 * 60 * 1000, // 15 minutes
  key: 'password_reset',
});

/**
 * Rate limiter for submission creation
 * - 10 submissions per hour
 */
export const submissionRateLimiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 60 * 60 * 1000, // 1 hour
  key: 'submission',
});

/**
 * Rate limiter for API calls (general)
 * - 100 requests per minute
 */
export const apiRateLimiter = new RateLimiter({
  maxRequests: 100,
  windowMs: 60 * 1000, // 1 minute
  key: 'api_general',
});

// === RATE LIMIT ERROR ===

export class RateLimitError extends Error {
  public resetTime: string;
  public remaining: number;

  constructor(limiter: RateLimiter) {
    const resetTime = limiter.getResetTime();
    super(`Rate limit exceeded. Try again in ${resetTime}.`);
    this.name = 'RateLimitError';
    this.resetTime = resetTime;
    this.remaining = limiter.remaining();
  }
}

/**
 * Higher-order function to add rate limiting to any async function
 * 
 * @example
 * ```ts
 * const limitedLogin = withRateLimit(
 *   loginRateLimiter,
 *   async (credentials) => {
 *     return await api.login(credentials);
 *   }
 * );
 * 
 * try {
 *   await limitedLogin({ email, password });
 * } catch (error) {
 *   if (error instanceof RateLimitError) {
 *     alert(error.message);
 *   }
 * }
 * ```
 */
export function withRateLimit<T extends (...args: any[]) => Promise<any>>(
  limiter: RateLimiter,
  fn: T
): T {
  return (async (...args: any[]) => {
    if (!limiter.check()) {
      throw new RateLimitError(limiter);
    }

    limiter.increment();
    return await fn(...args);
  }) as T;
}

