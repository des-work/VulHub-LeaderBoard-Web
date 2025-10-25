import { tokens } from './tokens.json';

/**
 * Generate Tailwind CSS configuration from design tokens
 */
export function generateTailwindConfig() {
  return {
    theme: {
      extend: {
        colors: {
          ...tokens.colors,
          background: 'var(--color-background)',
          foreground: 'var(--color-foreground)',
          muted: 'var(--color-muted)',
          'muted-foreground': 'var(--color-muted-foreground)',
          border: 'var(--color-border)',
          input: 'var(--color-input)',
          ring: 'var(--color-ring)',
        },
        fontFamily: tokens.typography.fontFamily,
        fontSize: tokens.typography.fontSize,
        fontWeight: tokens.typography.fontWeight,
        letterSpacing: tokens.typography.letterSpacing,
        spacing: tokens.spacing,
        borderRadius: tokens.borderRadius,
        boxShadow: tokens.shadows,
        animation: {
          'fade-in': 'fadeIn var(--duration-200) var(--easing-out)',
          'slide-up': 'slideUp var(--duration-300) var(--easing-out)',
          'slide-down': 'slideDown var(--duration-300) var(--easing-out)',
          'scale-in': 'scaleIn var(--duration-200) var(--easing-out)',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          slideUp: {
            '0%': { transform: 'translateY(10px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
          slideDown: {
            '0%': { transform: 'translateY(-10px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
          scaleIn: {
            '0%': { transform: 'scale(0.95)', opacity: '0' },
            '100%': { transform: 'scale(1)', opacity: '1' },
          },
        },
        screens: tokens.breakpoints,
      },
    },
  };
}
