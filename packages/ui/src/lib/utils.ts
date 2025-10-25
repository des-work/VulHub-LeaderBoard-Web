import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function for combining class names with Tailwind CSS
 * Handles conflicts and merges classes properly
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate variant classes using class-variance-authority
 */
export function createVariants<T extends Record<string, any>>(
  baseClasses: string,
  variants: T
) {
  return (props: Partial<Record<keyof T, keyof T[keyof T]>> & { className?: string }) => {
    const { className, ...variantProps } = props;
    const variantClasses = Object.entries(variantProps)
      .map(([key, value]) => {
        const variant = variants[key];
        return variant?.[value as keyof typeof variant];
      })
      .filter(Boolean)
      .join(' ');
    
    return cn(baseClasses, variantClasses, className);
  };
}

/**
 * Generate responsive classes
 */
export function responsive(classes: Record<string, string>) {
  return Object.entries(classes)
    .map(([breakpoint, className]) => {
      if (breakpoint === 'base') return className;
      return `${breakpoint}:${className}`;
    })
    .join(' ');
}

/**
 * Generate focus-visible classes
 */
export function focusVisible(className: string) {
  return `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`;
}

/**
 * Generate disabled classes
 */
export function disabled(className: string) {
  return `disabled:pointer-events-none disabled:opacity-50 ${className}`;
}

/**
 * Generate loading classes
 */
export function loading(className: string) {
  return `animate-pulse ${className}`;
}
