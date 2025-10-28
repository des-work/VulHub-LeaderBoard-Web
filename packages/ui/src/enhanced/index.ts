'use client';

/**
 * Enhanced Components
 * Advanced UI components with improved functionality
 */

import React from 'react';
import { cn } from '../lib/utils';

// Enhanced Button with loading states
export interface EnhancedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  };

  const sizeClasses = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-8',
  };

  return React.createElement('button', {
    className: cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className
    ),
    disabled: disabled || loading,
    ...props
  }, [
    loading && React.createElement('svg', {
      key: 'loading',
      className: 'mr-2 h-4 w-4 animate-spin',
      viewBox: '0 0 24 24'
    }, [
      React.createElement('circle', {
        key: 'circle',
        className: 'opacity-25',
        cx: '12',
        cy: '12',
        r: '10',
        stroke: 'currentColor',
        strokeWidth: '4',
        fill: 'none'
      }),
      React.createElement('path', {
        key: 'path',
        className: 'opacity-75',
        fill: 'currentColor',
        d: 'M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
      })
    ]),
    !loading && leftIcon && React.createElement('span', { key: 'leftIcon', className: 'mr-2' }, leftIcon),
    children,
    !loading && rightIcon && React.createElement('span', { key: 'rightIcon', className: 'ml-2' }, rightIcon)
  ]);
};

// Enhanced Card with hover effects
export interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const EnhancedCard: React.FC<EnhancedCardProps> = ({
  children,
  className,
  hover = false,
  padding = 'md',
  ...props
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };

  return React.createElement('div', {
    className: cn(
      'rounded-lg border bg-card text-card-foreground shadow-sm',
      hover && 'hover:shadow-md transition-shadow duration-200',
      paddingClasses[padding],
      className
    ),
    ...props
  }, children);
};

// Enhanced Input with validation states
export interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const EnhancedInput: React.FC<EnhancedInputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className,
  ...props
}) => {
  return React.createElement('div', { className: 'space-y-2' }, [
    label && React.createElement('label', {
      key: 'label',
      className: 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
    }, label),
    React.createElement('div', { key: 'input-container', className: 'relative' }, [
      leftIcon && React.createElement('div', {
        key: 'leftIcon',
        className: 'absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground'
      }, leftIcon),
      React.createElement('input', {
        key: 'input',
        className: cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          leftIcon && 'pl-10',
          rightIcon && 'pr-10',
          error && 'border-destructive focus-visible:ring-destructive',
          className
        ),
        ...props
      }),
      rightIcon && React.createElement('div', {
        key: 'rightIcon',
        className: 'absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground'
      }, rightIcon)
    ]),
    error && React.createElement('p', { key: 'error', className: 'text-sm text-destructive' }, error),
    helperText && !error && React.createElement('p', { key: 'helper', className: 'text-sm text-muted-foreground' }, helperText)
  ]);
};

// Export all enhanced components
export const Enhanced = {
  Button: EnhancedButton,
  Card: EnhancedCard,
  Input: EnhancedInput,
} as const;