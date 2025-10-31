/**
 * Error Tracking Service
 * 
 * Provides centralized error tracking with support for:
 * - Sentry integration (optional)
 * - Error rate limiting and deduplication
 * - Rich context and metadata collection
 * - Production/development mode handling
 */

import { ApiError } from './errors';

/**
 * Error tracking service interface
 */
interface ErrorTrackingService {
  captureException(error: Error, context?: ErrorContext): void;
  captureMessage(message: string, level?: 'info' | 'warning' | 'error', context?: ErrorContext): void;
  setUser(user: { id: string; email?: string; username?: string } | null): void;
  setContext(key: string, context: any): void;
}

/**
 * Error context with rich metadata
 */
export interface ErrorContext {
  tags?: Record<string, string>;
  extra?: Record<string, any>;
  user?: {
    id: string;
    email?: string;
    username?: string;
  };
  request?: {
    url: string;
    method?: string;
    headers?: Record<string, string>;
    body?: any;
  };
  breadcrumbs?: Array<{
    message: string;
    category: string;
    level: 'info' | 'warning' | 'error';
    timestamp: Date;
  }>;
}

/**
 * Error deduplication and rate limiting
 */
class ErrorDeduplicator {
  private errorCounts = new Map<string, { count: number; firstSeen: number; lastSeen: number }>();
  private readonly windowMs = 60000; // 1 minute
  private readonly maxErrorsPerWindow = 10;
  private readonly deduplicationWindowMs = 5000; // 5 seconds

  shouldTrack(error: Error, context?: ErrorContext): { track: boolean; reason?: string } {
    const errorKey = this.getErrorKey(error, context);
    const now = Date.now();

    // Get or create error entry
    const entry = this.errorCounts.get(errorKey);
    
    if (!entry) {
      this.errorCounts.set(errorKey, {
        count: 1,
        firstSeen: now,
        lastSeen: now,
      });
      return { track: true };
    }

    // Check if within deduplication window
    if (now - entry.lastSeen < this.deduplicationWindowMs) {
      entry.count += 1;
      entry.lastSeen = now;
      return { track: false, reason: 'deduplicated' };
    }

    // Check rate limit
    if (entry.count >= this.maxErrorsPerWindow && now - entry.firstSeen < this.windowMs) {
      entry.lastSeen = now;
      return { track: false, reason: 'rate_limited' };
    }

    // Reset if window expired
    if (now - entry.firstSeen >= this.windowMs) {
      this.errorCounts.set(errorKey, {
        count: 1,
        firstSeen: now,
        lastSeen: now,
      });
      return { track: true };
    }

    entry.count += 1;
    entry.lastSeen = now;
    return { track: true };
  }

  private getErrorKey(error: Error, context?: ErrorContext): string {
    // Create a unique key based on error type and message
    const errorType = error.constructor.name;
    const message = error.message;
    
    // Include API error status if available
    if (error instanceof ApiError) {
      return `${errorType}:${error.status}:${message.substring(0, 100)}`;
    }
    
    return `${errorType}:${message.substring(0, 100)}`;
  }

  clear() {
    this.errorCounts.clear();
  }
}

/**
 * Sentry-like interface for type safety
 */
interface SentryInterface {
  captureException(exception: any, hint?: { tags?: Record<string, string>; extra?: Record<string, any>; user?: any }): string;
  captureMessage(message: string, level?: 'info' | 'warning' | 'error', hint?: { tags?: Record<string, string>; extra?: Record<string, any> }): string;
  setUser(user: { id: string; email?: string; username?: string } | null): void;
  setContext(key: string, context: any): void;
  addBreadcrumb(breadcrumb: { message: string; category: string; level: 'info' | 'warning' | 'error'; timestamp?: Date }): void;
}

/**
 * Check if Sentry is available
 */
function getSentry(): SentryInterface | null {
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    return (window as any).Sentry as SentryInterface;
  }
  return null;
}

/**
 * Collect browser and environment context
 */
function collectContext(): ErrorContext['extra'] {
  if (typeof window === 'undefined') {
    return {};
  }

  // @ts-ignore - process.env is replaced by Next.js at build time
  const environment = typeof process !== 'undefined' && process.env?.NODE_ENV 
    ? process.env.NODE_ENV 
    : 'development';

  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    url: window.location.href,
    pathname: window.location.pathname,
    referrer: document.referrer || undefined,
    screen: {
      width: window.screen.width,
      height: window.screen.height,
    },
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    timestamp: new Date().toISOString(),
    environment,
  };
}

/**
 * Format context for error tracking
 */
function formatContext(context?: ErrorContext): { tags: Record<string, string>; extra: Record<string, any>; user?: any } {
  const baseContext = collectContext();
  
  // @ts-ignore - process.env is replaced by Next.js at build time
  const environment = typeof process !== 'undefined' && process.env?.NODE_ENV 
    ? process.env.NODE_ENV 
    : 'development';

  const tags: Record<string, string> = {
    environment,
    ...context?.tags,
  };

  // Add API error specific tags
  // Note: This will be handled when the error is processed

  const extra: Record<string, any> = {
    ...baseContext,
    ...context?.extra,
  };

  if (context?.request) {
    extra.request = context.request;
  }

  if (context?.breadcrumbs && context.breadcrumbs.length > 0) {
    extra.breadcrumbs = context.breadcrumbs;
  }

  return {
    tags,
    extra,
    user: context?.user,
  };
}

/**
 * Error tracking service implementation
 */
class ErrorTrackingService implements ErrorTrackingService {
  private deduplicator = new ErrorDeduplicator();
  private user: ErrorContext['user'] = undefined;
  private contexts = new Map<string, any>();

  captureException(error: Error, context?: ErrorContext): void {
    // Check deduplication and rate limiting
    const shouldTrack = this.deduplicator.shouldTrack(error, context);
    if (!shouldTrack.track) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[Error Tracking] Skipping error: ${shouldTrack.reason}`, error);
      }
      return;
    }

    // Prepare context
    const formattedContext = formatContext({
      ...context,
      user: context?.user || this.user,
    });

    // Add API error specific tags
    if (error instanceof ApiError) {
      formattedContext.tags.statusCode = String(error.status);
      formattedContext.tags.errorCode = error.code;
      formattedContext.extra.apiError = {
        status: error.status,
        code: error.code,
        details: error.details,
      };
    }

    // Try to use Sentry if available
    const sentry = getSentry();
    if (sentry) {
      try {
        sentry.captureException(error, formattedContext);
      } catch (e) {
        console.error('[Error Tracking] Failed to send to Sentry:', e);
      }
    }

    // Always log in development
    // @ts-ignore - process.env is replaced by Next.js at build time
    const isDevelopment = typeof process !== 'undefined' && process.env?.NODE_ENV === 'development';
    if (isDevelopment) {
      console.error('[Error Tracking] Exception:', {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
        context: formattedContext,
      });
    }

    // Log to console in production for critical errors
    if (error instanceof ApiError && error.status >= 500) {
      console.error('[Critical API Error]', {
        status: error.status,
        code: error.code,
        message: error.message,
        url: formattedContext.extra?.url,
      });
    }
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: ErrorContext): void {
    const formattedContext = formatContext({
      ...context,
      user: context?.user || this.user,
    });

    formattedContext.tags.level = level;

    const sentry = getSentry();
    if (sentry) {
      try {
        sentry.captureMessage(message, level, formattedContext);
      } catch (e) {
        console.error('[Error Tracking] Failed to send to Sentry:', e);
      }
    }

    const isDevelopment = typeof process !== 'undefined' && process.env?.NODE_ENV === 'development';
    if (isDevelopment) {
      const logMethod = level === 'error' ? console.error : level === 'warning' ? console.warn : console.info;
      logMethod(`[Error Tracking] ${level.toUpperCase()}:`, message, formattedContext);
    }
  }

  setUser(user: { id: string; email?: string; username?: string } | null): void {
    this.user = user || undefined;

    const sentry = getSentry();
    if (sentry) {
      try {
        sentry.setUser(user);
      } catch (e) {
        console.error('[Error Tracking] Failed to set user in Sentry:', e);
      }
    }
  }

  setContext(key: string, context: any): void {
    this.contexts.set(key, context);

    const sentry = getSentry();
    if (sentry) {
      try {
        sentry.setContext(key, context);
      } catch (e) {
        console.error('[Error Tracking] Failed to set context in Sentry:', e);
      }
    }
  }

  /**
   * Add a breadcrumb for tracking user actions
   */
  addBreadcrumb(message: string, category: string, level: 'info' | 'warning' | 'error' = 'info'): void {
    const breadcrumb = {
      message,
      category,
      level,
      timestamp: new Date(),
    };

    const sentry = getSentry();
    if (sentry) {
      try {
        sentry.addBreadcrumb(breadcrumb);
      } catch (e) {
        // Silently fail for breadcrumbs
      }
    }
  }

  /**
   * Clear deduplication cache (useful for testing)
   */
  clearDeduplication(): void {
    this.deduplicator.clear();
  }
}

/**
 * Global error tracking service instance
 */
export const errorTracking = new ErrorTrackingService();

/**
 * Convenience functions
 */
export function trackError(error: Error, context?: ErrorContext): void {
  errorTracking.captureException(error, context);
}

export function trackMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: ErrorContext): void {
  errorTracking.captureMessage(message, level, context);
}

export function setErrorTrackingUser(user: { id: string; email?: string; username?: string } | null): void {
  errorTracking.setUser(user);
}

export function addErrorBreadcrumb(message: string, category: string, level: 'info' | 'warning' | 'error' = 'info'): void {
  errorTracking.addBreadcrumb(message, category, level);
}

