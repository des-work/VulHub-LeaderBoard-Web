import { Logger } from '@nestjs/common';
import { ErrorHandlerService } from '../errors/error-handler.service';
import { ResilienceService } from '../resilience/resilience.service';
import { ValidationError } from '../errors/domain-error.base';

export interface OperationContext {
  operation: string;
  userId?: string;
  tenantId?: string;
  resource?: string;
  metadata?: Record<string, any>;
}

export interface OperationMetrics {
  startTime: number;
  endTime?: number;
  duration?: number;
  success: boolean;
  errorType?: string;
  retryCount?: number;
}

/**
 * Enhanced base service with resilience, metrics, and consistent patterns
 */
export abstract class EnhancedBaseService {
  protected readonly logger: Logger;
  protected readonly errorHandler: ErrorHandlerService;
  protected readonly resilience: ResilienceService;
  protected readonly metrics = new Map<string, OperationMetrics[]>();

  constructor(
    protected readonly repository: any,
    errorHandler: ErrorHandlerService,
    resilience: ResilienceService,
  ) {
    this.logger = new Logger(this.constructor.name);
    this.errorHandler = errorHandler;
    this.resilience = resilience;
  }

  /**
   * Execute operation with comprehensive error handling, resilience, and metrics
   */
  protected async executeWithResilience<T>(
    operation: () => Promise<T>,
    context: OperationContext,
    options: {
      useCircuitBreaker?: boolean;
      useRetry?: boolean;
      useRecovery?: boolean;
      fallback?: () => Promise<T>;
      retryOptions?: any;
      circuitBreakerOptions?: any;
    } = {}
  ): Promise<T> {
    const {
      useCircuitBreaker = true,
      useRetry = true,
      useRecovery = true,
      fallback,
      retryOptions,
      circuitBreakerOptions
    } = options;

    const metrics: OperationMetrics = {
      startTime: Date.now(),
      success: false,
      retryCount: 0
    };

    try {
      this.logOperationStart(context);
      
      let result: T;
      
      if (useCircuitBreaker || useRetry || useRecovery) {
        result = await this.resilience.executeWithFullResilience(
          `${this.constructor.name}.${context.operation}`,
          operation,
          {
            circuitBreaker: useCircuitBreaker ? circuitBreakerOptions : undefined,
            retry: useRetry ? retryOptions : undefined,
            fallback,
            recoveryStrategies: useRecovery ? this.getRecoveryStrategies() : undefined,
            context: {
              userId: context.userId,
              tenantId: context.tenantId,
              operation: context.operation,
              resource: context.resource,
              metadata: context.metadata
            }
          }
        );
      } else {
        result = await operation();
      }

      metrics.success = true;
      metrics.endTime = Date.now();
      metrics.duration = metrics.endTime - metrics.startTime;
      
      this.logOperationSuccess(context, metrics);
      this.recordMetrics(context.operation, metrics);
      
      return result;
    } catch (error) {
      metrics.endTime = Date.now();
      metrics.duration = metrics.endTime - metrics.startTime;
      metrics.errorType = error.constructor.name;
      
      this.logOperationError(context, error, metrics);
      this.recordMetrics(context.operation, metrics);
      
      throw error;
    }
  }

  /**
   * Validate input with enhanced validation
   */
  protected validateInput<T>(
    input: T,
    validationFn: (data: T) => void,
    context?: string
  ): void {
    try {
      validationFn(input);
    } catch (error) {
      if (error instanceof ValidationError) {
        this.logger.warn(`Validation failed for ${context || 'input'}:`, error.message);
        throw error;
      }
      throw new ValidationError('input', 'Invalid input provided');
    }
  }

  /**
   * Validate business rules (to be implemented by subclasses)
   */
  protected abstract validateBusinessRules(entity: any, operation: string): void;

  /**
   * Get recovery strategies specific to this service (to be implemented by subclasses)
   */
  protected getRecoveryStrategies(): any[] {
    return [];
  }

  /**
   * Audit operation for compliance and debugging
   */
  protected async auditOperation(
    operation: string,
    entityId: string,
    changes?: Record<string, any>,
    context?: OperationContext
  ): Promise<void> {
    try {
      // Implement audit logging
      this.logger.log(`Audit: ${operation} on ${entityId}`, {
        operation,
        entityId,
        changes,
        userId: context?.userId,
        tenantId: context?.tenantId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.logger.error('Failed to audit operation:', error);
    }
  }

  /**
   * Get operation metrics for monitoring
   */
  getOperationMetrics(operation?: string): OperationMetrics[] {
    if (operation) {
      return this.metrics.get(operation) || [];
    }
    
    const allMetrics: OperationMetrics[] = [];
    for (const metrics of this.metrics.values()) {
      allMetrics.push(...metrics);
    }
    return allMetrics;
  }

  /**
   * Get performance statistics
   */
  getPerformanceStats(operation?: string): {
    totalOperations: number;
    successRate: number;
    averageDuration: number;
    errorRate: number;
    mostCommonError?: string;
  } {
    const metrics = this.getOperationMetrics(operation);
    
    if (metrics.length === 0) {
      return {
        totalOperations: 0,
        successRate: 0,
        averageDuration: 0,
        errorRate: 0
      };
    }

    const successful = metrics.filter(m => m.success);
    const failed = metrics.filter(m => !m.success);
    const totalDuration = metrics.reduce((sum, m) => sum + (m.duration || 0), 0);
    
    // Find most common error
    const errorCounts = new Map<string, number>();
    failed.forEach(m => {
      if (m.errorType) {
        errorCounts.set(m.errorType, (errorCounts.get(m.errorType) || 0) + 1);
      }
    });
    
    const mostCommonError = Array.from(errorCounts.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0];

    return {
      totalOperations: metrics.length,
      successRate: successful.length / metrics.length,
      averageDuration: totalDuration / metrics.length,
      errorRate: failed.length / metrics.length,
      mostCommonError
    };
  }

  /**
   * Clear metrics (useful for testing)
   */
  clearMetrics(): void {
    this.metrics.clear();
  }

  private logOperationStart(context: OperationContext): void {
    this.logger.log(`Starting operation: ${context.operation}`, {
      userId: context.userId,
      tenantId: context.tenantId,
      resource: context.resource,
      metadata: context.metadata
    });
  }

  private logOperationSuccess(context: OperationContext, metrics: OperationMetrics): void {
    this.logger.log(`Operation completed successfully: ${context.operation}`, {
      duration: metrics.duration,
      userId: context.userId,
      tenantId: context.tenantId
    });
  }

  private logOperationError(
    context: OperationContext, 
    error: Error, 
    metrics: OperationMetrics
  ): void {
    this.logger.error(`Operation failed: ${context.operation}`, {
      error: error.message,
      duration: metrics.duration,
      errorType: metrics.errorType,
      userId: context.userId,
      tenantId: context.tenantId
    });
  }

  private recordMetrics(operation: string, metrics: OperationMetrics): void {
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, []);
    }
    
    const operationMetrics = this.metrics.get(operation)!;
    operationMetrics.push(metrics);
    
    // Keep only last 100 metrics per operation to prevent memory leaks
    if (operationMetrics.length > 100) {
      operationMetrics.splice(0, operationMetrics.length - 100);
    }
  }
}
