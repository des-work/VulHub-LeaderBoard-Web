/**
 * Animation Error Handling System
 * 
 * Provides robust error handling, recovery strategies, and fallback mechanisms
 * for the Castle Siege Animation system.
 */

// ============================================================================
// Error Types & Interfaces
// ============================================================================

export enum AnimationErrorType {
  INITIALIZATION = 'initialization',
  RENDERING = 'rendering',
  PERFORMANCE = 'performance',
  BROWSER_SUPPORT = 'browser_support',
  MEMORY = 'memory',
  ASSET_LOAD = 'asset_load',
  STATE_SYNC = 'state_sync',
  UNKNOWN = 'unknown'
}

export interface AnimationError {
  type: AnimationErrorType;
  message: string;
  recoverable: boolean;
  context?: Record<string, any>;
  originalError?: Error;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface RecoveryStrategy {
  type: AnimationErrorType;
  attempts: number;
  maxRetries: number;
  backoffMs: number;
  fallbackBehavior?: () => void;
}

// ============================================================================
// Error Handler Class
// ============================================================================

export class AnimationErrorHandler {
  private errors: AnimationError[] = [];
  private recoveryStrategies: Map<AnimationErrorType, RecoveryStrategy> = new Map();
  private errorCallbacks: ((error: AnimationError) => void)[] = [];

  constructor() {
    this.initializeRecoveryStrategies();
  }

  /**
   * Handle animation errors with recovery logic
   */
  handle(error: AnimationError): boolean {
    // Store error for debugging
    this.errors.push(error);

    // Log error if recoverable
    if (error.recoverable) {
      console.warn(`[Animation Error - ${error.type}] ${error.message}`, error.context);
    } else {
      console.error(`[Animation Error - CRITICAL ${error.type}] ${error.message}`, error.context);
    }

    // Execute error callbacks
    this.errorCallbacks.forEach(callback => {
      try {
        callback(error);
      } catch (e) {
        console.error('Error callback failed:', e);
      }
    });

    // Execute recovery based on error type
    return this.executeRecovery(error);
  }

  /**
   * Execute recovery strategy for error
   */
  private executeRecovery(error: AnimationError): boolean {
    const strategy = this.recoveryStrategies.get(error.type);
    if (!strategy) {
      return false;
    }

    if (!error.recoverable) {
      return false;
    }

    switch (error.type) {
      case AnimationErrorType.BROWSER_SUPPORT:
        return this.fallbackToCSS();

      case AnimationErrorType.PERFORMANCE:
        return this.reduceQuality();

      case AnimationErrorType.MEMORY:
        return this.clearMemory();

      case AnimationErrorType.RENDERING:
        return this.restartRendering();

      default:
        return this.gracefulDegradation();
    }
  }

  /**
   * Initialize recovery strategies
   */
  private initializeRecoveryStrategies(): void {
    this.recoveryStrategies.set(AnimationErrorType.BROWSER_SUPPORT, {
      type: AnimationErrorType.BROWSER_SUPPORT,
      attempts: 1,
      maxRetries: 0,
      backoffMs: 0
    });

    this.recoveryStrategies.set(AnimationErrorType.PERFORMANCE, {
      type: AnimationErrorType.PERFORMANCE,
      attempts: 1,
      maxRetries: 3,
      backoffMs: 500
    });

    this.recoveryStrategies.set(AnimationErrorType.MEMORY, {
      type: AnimationErrorType.MEMORY,
      attempts: 1,
      maxRetries: 2,
      backoffMs: 1000
    });

    this.recoveryStrategies.set(AnimationErrorType.RENDERING, {
      type: AnimationErrorType.RENDERING,
      attempts: 1,
      maxRetries: 3,
      backoffMs: 500
    });
  }

  /**
   * Fallback to CSS animations if Canvas fails
   */
  private fallbackToCSS(): boolean {
    console.log('Falling back to CSS animations');
    const event = new CustomEvent('animation:fallback-css');
    window.dispatchEvent(event);
    return true;
  }

  /**
   * Reduce animation quality to improve performance
   */
  private reduceQuality(): boolean {
    console.log('Reducing animation quality for better performance');
    const event = new CustomEvent('animation:reduce-quality');
    window.dispatchEvent(event);
    return true;
  }

  /**
   * Clear memory to resolve memory pressure
   */
  private clearMemory(): boolean {
    console.log('Clearing animation memory');
    // Trigger garbage collection if available
    if (performance.memory) {
      console.log(`Memory before: ${Math.round(performance.memory.usedJSHeapSize / 1048576)}MB`);
    }
    const event = new CustomEvent('animation:clear-memory');
    window.dispatchEvent(event);
    return true;
  }

  /**
   * Restart rendering pipeline
   */
  private restartRendering(): boolean {
    console.log('Restarting rendering pipeline');
    const event = new CustomEvent('animation:restart-rendering');
    window.dispatchEvent(event);
    return true;
  }

  /**
   * Graceful degradation for unknown errors
   */
  private gracefulDegradation(): boolean {
    console.log('Graceful degradation: Attempting minimal animation');
    const event = new CustomEvent('animation:degrade');
    window.dispatchEvent(event);
    return true;
  }

  /**
   * Register error callback
   */
  onError(callback: (error: AnimationError) => void): () => void {
    this.errorCallbacks.push(callback);
    return () => {
      const index = this.errorCallbacks.indexOf(callback);
      if (index > -1) {
        this.errorCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Get error history
   */
  getErrorHistory(): AnimationError[] {
    return [...this.errors];
  }

  /**
   * Clear error history
   */
  clearErrorHistory(): void {
    this.errors = [];
  }

  /**
   * Check if system should enter degraded mode
   */
  shouldDegrade(): boolean {
    const recentErrors = this.errors.filter(
      e => Date.now() - e.timestamp < 10000 // Last 10 seconds
    );

    const criticalCount = recentErrors.filter(e => e.severity === 'critical').length;
    const highCount = recentErrors.filter(e => e.severity === 'high').length;

    return criticalCount > 2 || highCount > 5;
  }
}

// ============================================================================
// Error Creation Helpers
// ============================================================================

export function createAnimationError(
  type: AnimationErrorType,
  message: string,
  recoverable: boolean = true,
  context?: Record<string, any>,
  originalError?: Error,
  severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
): AnimationError {
  return {
    type,
    message,
    recoverable,
    context,
    originalError,
    timestamp: Date.now(),
    severity
  };
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const animationErrorHandler = new AnimationErrorHandler();
