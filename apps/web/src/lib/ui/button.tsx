'use client';

/**
 * Button Component
 * Highly customizable button with proper styling and theme integration
 */

import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';
import { useThemeValue } from '../theme/context';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary-500 text-primary-950 hover:bg-primary-600 active:bg-primary-700 shadow-sm hover:shadow-md',
        destructive: 'bg-error text-white hover:bg-error/90 active:bg-error/80 shadow-sm hover:shadow-md',
        outline: 'border border-primary-500 text-primary-500 hover:bg-primary-500/10 active:bg-primary-500/20',
        secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 active:bg-secondary-700 shadow-sm hover:shadow-md',
        ghost: 'hover:bg-primary-500/10 hover:text-primary-500 active:bg-primary-500/20',
        link: 'text-primary-500 underline-offset-4 hover:underline active:underline',
        matrix: 'bg-black border-2 border-primary-500 text-primary-500 hover:bg-primary-500/10 hover:border-primary-400 active:bg-primary-500/20 font-mono font-bold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40',
        neon: 'bg-black border-2 border-primary-500 text-primary-500 hover:bg-primary-500/20 active:bg-primary-500/30 font-mono font-bold shadow-lg shadow-primary-500/50 hover:shadow-primary-500/70 hover:shadow-xl',
        terminal: 'bg-black border border-primary-500 text-primary-500 hover:bg-primary-500/10 active:bg-primary-500/20 font-mono font-bold shadow-inner',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-md px-8 text-base',
        xl: 'h-12 rounded-lg px-10 text-lg',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
      loading: {
        true: 'cursor-not-allowed',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fullWidth: false,
      loading: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const theme = useThemeValue();
    
    const isDisabled = disabled || loading;
    
    return (
      <button
        className={cn(
          buttonVariants({ variant, size, fullWidth, loading, className }),
          // Apply theme-specific styles
          variant === 'matrix' && 'text-shadow-[0_0_10px_rgba(0,255,0,0.5)]',
          variant === 'neon' && 'text-shadow-[0_0_5px_rgba(0,255,0,0.8),0_0_10px_rgba(0,255,0,0.6),0_0_15px_rgba(0,255,0,0.4)]',
          variant === 'terminal' && 'font-mono',
          className
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="mr-2 h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {loadingText || 'Loading...'}
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
