import { Injectable, Logger } from '@nestjs/common';
import { ErrorHandlerService, ErrorContext, ErrorReport } from './error-handler.service';
import { DomainError } from './domain-error.base';

export interface RecoveryStrategy {
  canRecover(errorReport: ErrorReport): boolean;
  recover(errorReport: ErrorReport): Promise<any>;
  priority: number;
}

export interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoff?: number;
  retryableErrors?: string[];
}

export interface CircuitBreakerOptions {
  failureThreshold?: number;
  timeout?: number;
  resetTimeout?: number;
}

@Injectable()
export class ResilienceService {
  private readonly logger = new Logger(ResilienceService.name);
  private circuitBreakers = new Map<string, CircuitBreaker>();
  private recoveryStrategies: RecoveryStrategy[] = [];

  constructor(private errorHandler: ErrorHandlerService) {
    this.initializeDefaultRecoveryStrategies();
  }

  /**
   * Execute operation with circuit breaker protection
   */
  async executeWithCircuitBreaker<T>(
    serviceName: string,
    operation: () => Promise<T>,
    fallback?: () => Promise<T>,
    options: CircuitBreakerOptions = {}
  ): Promise<T> {
    const breaker = this.getOrCreateCircuitBreaker(serviceName, options);
    
    try {
      return await breaker.execute(operation);
    } catch (error) {
      this.logger.warn(`Circuit breaker ${serviceName} failed, attempting fallback`);
      
      if (fallback) {
        try {
          return await fallback();
        } catch (fallbackError) {
          this.logger.error(`Fallback for ${serviceName} also failed:`, fallbackError);
          throw fallbackError;
        }
      }
      
      throw error;
    }
  }

  /**
   * Execute operation with retry mechanism
   */
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> {
    const { 
      maxAttempts = 3, 
      delay = 1000, 
      backoff = 2,
      retryableErrors = ['TIMEOUT', 'NETWORK_ERROR', 'TEMPORARY_FAILURE']
    } = options;
    
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxAttempts) {
          this.logger.error(`Operation failed after ${maxAttempts} attempts:`, error);
          throw error;
        }
        
        if (!this.isRetryableError(error, retryableErrors)) {
          this.logger.warn(`Non-retryable error encountered:`, error);
          throw error;
        }
        
        const waitTime = delay * Math.pow(backoff, attempt - 1);
        this.logger.warn(`Attempt ${attempt} failed, retrying in ${waitTime}ms:`, error.message);
        
        await this.delay(waitTime);
      }
    }
    
    throw lastError!;
  }

  /**
   * Execute operation with error recovery strategies
   */
  async executeWithRecovery<T>(
    operation: () => Promise<T>,
    context: ErrorContext,
    customStrategies: RecoveryStrategy[] = []
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      const errorReport = this.errorHandler.handleError(error, context);
      
      // Try recovery strategies in order of priority
      const allStrategies = [...this.recoveryStrategies, ...customStrategies]
        .sort((a, b) => b.priority - a.priority);
      
      for (const strategy of allStrategies) {
        if (strategy.canRecover(errorReport)) {
          try {
            this.logger.log(`Attempting recovery with strategy: ${strategy.constructor.name}`);
            const result = await strategy.recover(errorReport);
            this.logger.log(`Recovery successful with strategy: ${strategy.constructor.name}`);
            return result;
          } catch (recoveryError) {
            this.logger.warn(`Recovery strategy ${strategy.constructor.name} failed:`, recoveryError);
          }
        }
      }
      
      this.logger.error('All recovery strategies failed, re-throwing original error');
      throw error;
    }
  }

  /**
   * Execute operation with comprehensive resilience (circuit breaker + retry + recovery)
   */
  async executeWithFullResilience<T>(
    serviceName: string,
    operation: () => Promise<T>,
    options: {
      circuitBreaker?: CircuitBreakerOptions;
      retry?: RetryOptions;
      fallback?: () => Promise<T>;
      recoveryStrategies?: RecoveryStrategy[];
      context?: ErrorContext;
    } = {}
  ): Promise<T> {
    const { circuitBreaker, retry, fallback, recoveryStrategies, context } = options;
    
    return this.executeWithCircuitBreaker(
      serviceName,
      () => this.executeWithRetry(
        () => this.executeWithRecovery(operation, context || {}, recoveryStrategies),
        retry
      ),
      fallback,
      circuitBreaker
    );
  }

  /**
   * Register a custom recovery strategy
   */
  registerRecoveryStrategy(strategy: RecoveryStrategy): void {
    this.recoveryStrategies.push(strategy);
    this.logger.log(`Registered recovery strategy: ${strategy.constructor.name}`);
  }

  /**
   * Get circuit breaker status
   */
  getCircuitBreakerStatus(serviceName: string): {
    state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
    failureCount: number;
    lastFailureTime?: Date;
  } {
    const breaker = this.circuitBreakers.get(serviceName);
    if (!breaker) {
      return { state: 'CLOSED', failureCount: 0 };
    }
    
    return breaker.getStatus();
  }

  /**
   * Reset circuit breaker
   */
  resetCircuitBreaker(serviceName: string): void {
    const breaker = this.circuitBreakers.get(serviceName);
    if (breaker) {
      breaker.reset();
      this.logger.log(`Reset circuit breaker for service: ${serviceName}`);
    }
  }

  private getOrCreateCircuitBreaker(serviceName: string, options: CircuitBreakerOptions): CircuitBreaker {
    if (!this.circuitBreakers.has(serviceName)) {
      this.circuitBreakers.set(serviceName, new CircuitBreaker(options));
    }
    return this.circuitBreakers.get(serviceName)!;
  }

  private isRetryableError(error: Error, retryableErrors: string[]): boolean {
    if (error instanceof DomainError) {
      return retryableErrors.includes(error.code);
    }
    
    // Check for common retryable error patterns
    const errorMessage = error.message.toLowerCase();
    return errorMessage.includes('timeout') || 
           errorMessage.includes('network') || 
           errorMessage.includes('connection') ||
           errorMessage.includes('temporary');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private initializeDefaultRecoveryStrategies(): void {
    // Database connection recovery
    this.registerRecoveryStrategy({
      canRecover: (errorReport) => 
        errorReport.error.message.includes('database') || 
        errorReport.error.message.includes('connection'),
      recover: async (errorReport) => {
        this.logger.log('Attempting database connection recovery');
        // Implement database reconnection logic
        throw new Error('Database recovery not implemented');
      },
      priority: 10
    });

    // External service recovery
    this.registerRecoveryStrategy({
      canRecover: (errorReport) => 
        errorReport.error.message.includes('external') || 
        errorReport.error.message.includes('service'),
      recover: async (errorReport) => {
        this.logger.log('Attempting external service recovery');
        // Implement external service recovery logic
        throw new Error('External service recovery not implemented');
      },
      priority: 5
    });

    // Cache recovery
    this.registerRecoveryStrategy({
      canRecover: (errorReport) => 
        errorReport.error.message.includes('cache') || 
        errorReport.error.message.includes('redis'),
      recover: async (errorReport) => {
        this.logger.log('Attempting cache recovery');
        // Implement cache recovery logic
        throw new Error('Cache recovery not implemented');
      },
      priority: 3
    });
  }
}

/**
 * Simple circuit breaker implementation
 */
class CircuitBreaker {
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime?: Date;
  private nextAttemptTime?: Date;

  constructor(private options: CircuitBreakerOptions = {}) {
    const { failureThreshold = 5, timeout = 60000 } = options;
    this.options = { failureThreshold, timeout };
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (this.nextAttemptTime && Date.now() < this.nextAttemptTime.getTime()) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = new Date();
    
    if (this.failureCount >= this.options.failureThreshold!) {
      this.state = 'OPEN';
      this.nextAttemptTime = new Date(Date.now() + this.options.timeout!);
    }
  }

  getStatus(): { state: 'CLOSED' | 'OPEN' | 'HALF_OPEN'; failureCount: number; lastFailureTime?: Date } {
    return {
      state: this.state,
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime
    };
  }

  reset(): void {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.lastFailureTime = undefined;
    this.nextAttemptTime = undefined;
  }
}
