/**
 * Error Alert Component
 * 
 * Displays user-friendly error messages with Matrix theme styling
 */

import React from 'react';
import { ApiError } from '../lib/api/errors';

export interface ErrorAlertProps {
  error: string | Error | null;
  onClose?: () => void;
  variant?: 'error' | 'warning' | 'info';
  className?: string;
}

export function ErrorAlert({ error, onClose, variant = 'error', className = '' }: ErrorAlertProps) {
  if (!error) return null;

  const message = typeof error === 'string' ? error : error.message;
  
  const variantStyles = {
    error: 'bg-red-500/10 border-red-500/30 text-red-400',
    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    info: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
  };

  const iconStyles = {
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  return (
    <div 
      className={`
        rounded-lg border-2 p-4 mb-4 
        flex items-start gap-3
        animate-fade-in
        ${variantStyles[variant]}
        ${className}
      `}
      role="alert"
      aria-live="assertive"
    >
      <span className="text-2xl flex-shrink-0" aria-hidden="true">
        {iconStyles[variant]}
      </span>
      
      <div className="flex-1">
        <p className="font-mono text-sm leading-relaxed">
          {message}
        </p>
        
        {error instanceof ApiError && error.details && (
          <details className="mt-2">
            <summary className="cursor-pointer text-xs opacity-70 hover:opacity-100">
              Technical Details
            </summary>
            <pre className="mt-2 text-xs opacity-60 overflow-auto">
              {JSON.stringify(error.details, null, 2)}
            </pre>
          </details>
        )}
      </div>
      
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-current opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Dismiss error"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      )}
    </div>
  );
}

/**
 * Inline error message (smaller, for form fields)
 */
export interface InlineErrorProps {
  error: string | null;
  className?: string;
}

export function InlineError({ error, className = '' }: InlineErrorProps) {
  if (!error) return null;

  return (
    <p 
      className={`text-red-400 text-sm mt-1 font-mono animate-fade-in ${className}`}
      role="alert"
    >
      {error}
    </p>
  );
}

/**
 * Toast notification for errors (auto-dismissing)
 */
export interface ErrorToastProps {
  error: string | Error | null;
  duration?: number;
  onDismiss?: () => void;
}

export function ErrorToast({ error, duration = 5000, onDismiss }: ErrorToastProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (error && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onDismiss?.(), 300); // Wait for fade out
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [error, duration, onDismiss]);

  if (!error || !isVisible) return null;

  const message = typeof error === 'string' ? error : error.message;

  return (
    <div 
      className={`
        fixed bottom-4 right-4 max-w-md
        bg-red-500/20 backdrop-blur-sm
        border-2 border-red-500/50
        rounded-lg p-4
        shadow-lg
        animate-slide-in-bottom
        ${!isVisible ? 'animate-fade-out' : ''}
        z-50
      `}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0">❌</span>
        <p className="flex-1 text-red-400 font-mono text-sm">
          {message}
        </p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onDismiss?.(), 300);
          }}
          className="flex-shrink-0 text-red-400 opacity-70 hover:opacity-100"
          aria-label="Dismiss"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

