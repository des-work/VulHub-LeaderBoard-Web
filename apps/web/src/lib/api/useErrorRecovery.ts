/**
 * React Hook for Error Recovery
 * 
 * Provides utilities for retrying failed operations with exponential backoff
 */

import { useState, useCallback, useRef } from 'react';
import { isRetryableError } from './errors';

export interface UseErrorRecoveryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  onRetry?: (attempt: number, error: Error) => void;
  onMaxRetriesExceeded?: (error: Error) => void;
}

export interface UseErrorRecoveryReturn {
  retry: <T>(operation: () => Promise<T>, error: Error) => Promise<T | null>;
  isRetrying: boolean;
  retryCount: number;
  reset: () => void;
}

/**
 * Hook for error recovery with automatic retry
 */
export function useErrorRecovery(options: UseErrorRecoveryOptions = {}): UseErrorRecoveryReturn {
  const {
    maxRetries = 3,
    initialDelayMs = 1000,
    maxDelayMs = 10000,
    onRetry,
    onMaxRetriesExceeded,
  } = options;

  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const retryCountRef = useRef(0);

  const calculateDelay = useCallback((attempt: number): number => {
    // Exponential backoff: initialDelay * 2^attempt, capped at maxDelay
    const delay = Math.min(initialDelayMs * Math.pow(2, attempt), maxDelayMs);
    // Add jitter to prevent thundering herd
    const jitter = delay * 0.1 * Math.random();
    return delay + jitter;
  }, [initialDelayMs, maxDelayMs]);

  const retry = useCallback(async <T,>(
    operation: () => Promise<T>,
    error: Error
  ): Promise<T | null> => {
    // Only retry retryable errors
    if (!isRetryableError(error)) {
      return null;
    }

    // Check if we've exceeded max retries
    if (retryCountRef.current >= maxRetries) {
      onMaxRetriesExceeded?.(error);
      retryCountRef.current = 0;
      setIsRetrying(false);
      return null;
    }

    setIsRetrying(true);
    retryCountRef.current += 1;

    // Calculate delay
    const delay = calculateDelay(retryCountRef.current - 1);

    // Call retry callback
    onRetry?.(retryCountRef.current, error);

    // Wait before retrying
    await new Promise(resolve => setTimeout(resolve, delay));

    try {
      const result = await operation();
      // Success - reset retry count
      retryCountRef.current = 0;
      setRetryCount(0);
      setIsRetrying(false);
      return result;
    } catch (retryError) {
      // Retry failed - try again if we haven't exceeded max
      if (retryCountRef.current < maxRetries) {
        return retry(operation, retryError as Error);
      } else {
        // Max retries exceeded
        onMaxRetriesExceeded?.(retryError as Error);
        retryCountRef.current = 0;
        setRetryCount(0);
        setIsRetrying(false);
        return null;
      }
    }
  }, [maxRetries, calculateDelay, onRetry, onMaxRetriesExceeded]);

  const reset = useCallback(() => {
    retryCountRef.current = 0;
    setRetryCount(0);
    setIsRetrying(false);
  }, []);

  return {
    retry,
    isRetrying,
    retryCount: retryCountRef.current,
    reset,
  };
}

/**
 * Hook for manual retry with user confirmation
 */
export interface UseManualRetryReturn<T = any> {
  canRetry: boolean;
  retry: () => Promise<T | null>;
  isRetrying: boolean;
  error: Error | null;
}

export function useManualRetry<T = any>(
  operation: () => Promise<T>,
  error: Error | null
): UseManualRetryReturn<T> {
  const [isRetrying, setIsRetrying] = useState(false);
  const canRetry = error !== null && isRetryableError(error);

  const retry = useCallback(async (): Promise<T | null> => {
    if (!canRetry || !operation) {
      return null;
    }

    setIsRetrying(true);
    try {
      const result = await operation();
      setIsRetrying(false);
      return result;
    } catch (err) {
      setIsRetrying(false);
      throw err;
    }
  }, [canRetry, operation]);

  return {
    canRetry,
    retry,
    isRetrying,
    error,
  };
}

