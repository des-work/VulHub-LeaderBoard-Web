/**
 * Centralized Logging Utility
 * 
 * Provides environment-aware logging with clear severity levels
 * Production: Only errors logged
 * Development: Full logging with colors
 * 
 * Usage:
 *   import { logger } from '@/lib/logging/logger';
 *   
 *   logger.debug('Debug message', { data });
 *   logger.info('Info message');
 *   logger.warn('Warning message', { severity: 'high' });
 *   logger.error('Error message', new Error());
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  /**
   * Debug level - Most verbose, development only
   */
  debug(message: string, context?: LogContext) {
    if (!this.isDevelopment) return;
    
    if (typeof window !== 'undefined' && window.console) {
      const style = 'color: #888; font-weight: normal;';
      console.log(`%c[DEBUG] ${message}`, style, context || '');
    }
  }

  /**
   * Info level - General information
   */
  info(message: string, context?: LogContext) {
    if (typeof window !== 'undefined' && window.console) {
      const style = 'color: #0066cc; font-weight: bold;';
      console.log(`%c[INFO] ${message}`, style, context || '');
    }
  }

  /**
   * Warning level - Something unexpected happened but app continues
   */
  warn(message: string, context?: LogContext) {
    if (typeof window !== 'undefined' && window.console) {
      const style = 'color: #ff9900; font-weight: bold;';
      console.warn(`%c[WARN] ${message}`, style, context || '');
    }
  }

  /**
   * Error level - Something failed that needs attention
   */
  error(message: string, error?: Error | LogContext, context?: LogContext) {
    if (typeof window !== 'undefined' && window.console) {
      const style = 'color: #cc0000; font-weight: bold;';
      
      if (error instanceof Error) {
        console.error(`%c[ERROR] ${message}`, style);
        console.error(error);
        if (context) console.error(context);
      } else {
        console.error(`%c[ERROR] ${message}`, style, error || context || '');
      }
    }
  }

  /**
   * Performance timing - Debug timings
   */
  time(label: string) {
    if (!this.isDevelopment) return;
    if (typeof window !== 'undefined' && window.console) {
      console.time(label);
    }
  }

  timeEnd(label: string) {
    if (!this.isDevelopment) return;
    if (typeof window !== 'undefined' && window.console) {
      console.timeEnd(label);
    }
  }

  /**
   * Group related logs together
   */
  group(label: string) {
    if (!this.isDevelopment) return;
    if (typeof window !== 'undefined' && window.console) {
      console.group(`📦 ${label}`);
    }
  }

  groupEnd() {
    if (!this.isDevelopment) return;
    if (typeof window !== 'undefined' && window.console) {
      console.groupEnd();
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// For backward compatibility, also export default
export default logger;
