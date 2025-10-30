'use client';

/**
 * Card Component
 * Flexible card component with theme integration
 */

import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';
import { useThemeValue } from '../theme/context';

const cardVariants = cva(
  'rounded-lg border text-card-foreground transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-card border-border shadow-sm',
        matrix: 'bg-black/80 border-primary-500/30 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30',
        neon: 'bg-black/90 border-primary-500 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50',
        terminal: 'bg-black border-primary-500 shadow-inner',
        glass: 'bg-white/10 border-white/20 backdrop-blur-sm shadow-lg',
        solid: 'bg-neutral-900 border-neutral-800 shadow-md',
      },
      padding: {
        none: 'p-0',
        sm: 'p-3',
        default: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
      },
      hover: {
        true: 'hover:shadow-lg hover:scale-[1.02] cursor-pointer',
        false: '',
      },
      glow: {
        true: 'shadow-lg shadow-primary-500/25',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
      hover: false,
      glow: false,
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children?: React.ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, hover, glow, children, ...props }, ref) => {
    const theme = useThemeValue();
    
    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, padding, hover, glow }),
          // Apply theme-specific styles
          variant === 'matrix' && 'text-shadow-[0_0_5px_rgba(0,255,0,0.3)]',
          variant === 'neon' && 'text-shadow-[0_0_10px_rgba(0,255,0,0.5)]',
          variant === 'terminal' && 'font-mono',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

const CardHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  cardVariants,
};
