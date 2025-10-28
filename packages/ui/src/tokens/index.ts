// Comprehensive design tokens system
export * from './design-tokens';
export * from './color-system';
export * from './typography-system';
export * from './spacing-system';
export * from './shadow-system';

// Legacy tokens for backward compatibility
export const tokens = {
  colors: {
    primary: '#3b82f6',
    secondary: '#64748b',
    accent: '#f59e0b',
    destructive: '#ef4444',
    muted: '#f1f5f9',
    background: '#ffffff',
    foreground: '#0f172a',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
  },
};