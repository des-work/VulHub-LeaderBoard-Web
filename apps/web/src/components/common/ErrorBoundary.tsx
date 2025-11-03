'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { trackError, ErrorContext } from '../../lib/api/errorTracking';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Store error info in state
    this.setState({
      error,
      errorInfo,
    });

    // Prepare error context for tracking
    const errorContext: ErrorContext = {
      tags: {
        errorBoundary: 'true',
        componentStack: errorInfo.componentStack ? 'present' : 'missing',
      },
      extra: {
        componentStack: errorInfo.componentStack,
        errorInfo: {
          errorBoundary: true,
        },
      },
    };

    // Track error
    trackError(error, errorContext);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      const { error, errorInfo } = this.state;
      const isDev = typeof process !== 'undefined' && process.env?.NODE_ENV === 'development';
      const showDetails = this.props.showDetails ?? isDev;

      return (
        <div className="min-h-screen bg-red-50 dark:bg-red-950 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            {/* Error Card */}
            <div className="matrix-card p-8 text-center">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-error/20 flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-error" />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-matrix-glow mb-3">
                Oops! Something Went Wrong
              </h1>

              {/* Description */}
              <p className="text-muted mb-6">
                We encountered an unexpected error. Don't worry, your data is safe.
              </p>

              {/* Error Message */}
              {error && showDetails && (
                <div className="bg-error/10 border border-error/30 rounded p-4 mb-6 text-left">
                  <p className="font-mono text-sm text-error mb-2">
                    <strong>Error:</strong> {error.message}
                  </p>
                  {errorInfo && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-muted hover:text-bright">
                        View stack trace
                      </summary>
                      <pre className="mt-2 text-xs text-dim overflow-auto max-h-40">
                        {errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={this.handleReset}
                  className="matrix-button matrix-button-primary flex items-center justify-center gap-2"
                  aria-label="Try again"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
                <button
                  onClick={this.handleReload}
                  className="matrix-button matrix-button-outline flex items-center justify-center gap-2"
                  aria-label="Reload page"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reload Page
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="matrix-button matrix-button-outline flex items-center justify-center gap-2"
                  aria-label="Go to home page"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </button>
              </div>

              {/* Help Text */}
              <p className="text-xs text-dim mt-6">
                If this problem persists, please contact support.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
