/**
 * React Hook for API Error Handling
 * 
 * Provides utilities for displaying and managing API errors in components
 */

import { useState, useCallback } from 'react';
import { ApiError, getUserFriendlyMessage, requiresReauth } from './errors';
import { useAuth } from '../auth/context';
import { addErrorBreadcrumb } from './errorTracking';

export interface UseApiErrorReturn {
  error: string | null;
  setError: (error: Error | string | null) => void;
  clearError: () => void;
  handleError: (error: Error) => void;
  hasError: boolean;
}

export function useApiError(): UseApiErrorReturn {
  const [error, setErrorState] = useState<string | null>(null);
  const { logout } = useAuth();

  const setError = useCallback((err: Error | string | null) => {
    if (err === null) {
      setErrorState(null);
    } else if (typeof err === 'string') {
      setErrorState(err);
    } else {
      const message = getUserFriendlyMessage(err);
      setErrorState(message);
    }
  }, []);

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  const handleError = useCallback((err: Error) => {
    // Track error breadcrumb
    addErrorBreadcrumb(
      `API Error: ${getUserFriendlyMessage(err)}`,
      'api',
      err instanceof ApiError && err.status >= 500 ? 'error' : 'warning'
    );

    // Handle authentication errors
    if (requiresReauth(err)) {
      setError('Your session has expired. Please log in again.');
      setTimeout(() => {
        logout();
      }, 2000);
      return;
    }

    // Set user-friendly error message
    setError(err);
  }, [setError, logout]);

  return {
    error,
    setError,
    clearError,
    handleError,
    hasError: error !== null
  };
}

/**
 * Hook for managing loading and error states together
 */
export interface UseApiStateReturn extends UseApiErrorReturn {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  startLoading: () => void;
  stopLoading: () => void;
}

export function useApiState(): UseApiStateReturn {
  const [isLoading, setIsLoading] = useState(false);
  const errorHandling = useApiError();

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
    if (loading) {
      errorHandling.clearError();
    }
  }, [errorHandling]);

  const startLoading = useCallback(() => setLoading(true), [setLoading]);
  const stopLoading = useCallback(() => setLoading(false), [setLoading]);

  return {
    ...errorHandling,
    isLoading,
    setLoading,
    startLoading,
    stopLoading
  };
}

/**
 * Hook for executing API calls with automatic error and loading handling
 */
export function useApiCall<T = any>(
  apiCall: () => Promise<T>
): {
  execute: () => Promise<T | null>;
  isLoading: boolean;
  error: string | null;
  data: T | null;
  reset: () => void;
} {
  const [data, setData] = useState<T | null>(null);
  const { isLoading, setLoading, error, handleError, clearError } = useApiState();

  const execute = useCallback(async (): Promise<T | null> => {
    setLoading(true);
    clearError();
    
    try {
      const result = await apiCall();
      setData(result);
      return result;
    } catch (err) {
      handleError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiCall, setLoading, clearError, handleError]);

  const reset = useCallback(() => {
    setData(null);
    clearError();
  }, [clearError]);

  return {
    execute,
    isLoading,
    error,
    data,
    reset
  };
}

