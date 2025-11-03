/**
 * Animation Error Boundary
 * 
 * Catches and handles animation errors with graceful fallbacks
 */

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { animationErrorHandler, AnimationError, AnimationErrorType } from '../utils/error-handling';

interface Props {
  children: ReactNode;
  onError?: (error: AnimationError) => void;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: AnimationError | null;
  errorCount: number;
}

export class AnimationErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error: null,
      errorCount: 0
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const animError: AnimationError = {
      type: AnimationErrorType.UNKNOWN,
      message: error.message,
      recoverable: true,
      context: {
        componentStack: errorInfo.componentStack
      },
      originalError: error,
      timestamp: Date.now(),
      severity: 'high'
    };

    this.setState(prevState => ({
      error: animError,
      errorCount: prevState.errorCount + 1
    }));

    // Report to error handler
    animationErrorHandler.handle(animError);

    // Call parent error handler
    this.props.onError?.(animError);

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[AnimationErrorBoundary]', error, errorInfo);
    }
  }

  render(): ReactNode {
    if (this.state.hasError && this.state.errorCount > 2) {
      return this.renderFallback();
    }

    return this.props.children;
  }

  private renderFallback(): ReactNode {
    if (this.props.fallback) {
      return this.props.fallback;
    }

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#000000',
        color: '#00ff00',
        fontFamily: 'Courier New, monospace',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
        <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>
          Animation Unavailable
        </h2>
        <p style={{
          margin: '0 0 2rem 0',
          maxWidth: '400px',
          opacity: 0.8,
          lineHeight: '1.5'
        }}>
          The animation system encountered an error. You can proceed directly to the sign-in form.
        </p>
        {this.state.error && (
          <details style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: 'rgba(0, 255, 0, 0.05)',
            border: '1px solid rgba(0, 255, 0, 0.2)',
            borderRadius: '4px',
            textAlign: 'left',
            fontSize: '0.875rem',
            maxWidth: '500px'
          }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              Error Details
            </summary>
            <pre style={{
              margin: '0.5rem 0 0 0',
              overflow: 'auto',
              maxHeight: '200px',
              fontSize: '0.75rem'
            }}>
              {this.state.error.message}
            </pre>
          </details>
        )}
      </div>
    );
  }
}
