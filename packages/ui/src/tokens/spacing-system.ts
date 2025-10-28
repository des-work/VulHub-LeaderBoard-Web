/**
 * Advanced Spacing and Sizing System
 * Provides comprehensive spacing utilities and responsive sizing
 */

import { spacing, borderRadius, type Spacing, type BorderRadius } from './design-tokens';

// Spacing utility functions
export const spacingUtils = {
  /**
   * Generate consistent spacing scale
   */
  generateScale: (baseUnit: number = 4) => {
    return {
      0: '0px',
      1: `${baseUnit}px`,
      2: `${baseUnit * 2}px`,
      3: `${baseUnit * 3}px`,
      4: `${baseUnit * 4}px`,
      5: `${baseUnit * 5}px`,
      6: `${baseUnit * 6}px`,
      8: `${baseUnit * 8}px`,
      10: `${baseUnit * 10}px`,
      12: `${baseUnit * 12}px`,
      16: `${baseUnit * 16}px`,
      20: `${baseUnit * 20}px`,
      24: `${baseUnit * 24}px`,
      32: `${baseUnit * 32}px`,
      40: `${baseUnit * 40}px`,
      48: `${baseUnit * 48}px`,
      56: `${baseUnit * 56}px`,
      64: `${baseUnit * 64}px`,
    };
  },

  /**
   * Convert spacing value to CSS
   */
  toCSS: (value: Spacing | string | number) => {
    if (typeof value === 'number') return `${value}px`;
    if (typeof value === 'string') return value;
    return spacing[value] || value;
  },

  /**
   * Generate responsive spacing
   */
  generateResponsiveSpacing: (base: Spacing, breakpoints: Record<string, Spacing>) => {
    return {
      base: spacing[base],
      ...Object.entries(breakpoints).reduce((acc, [breakpoint, value]) => {
        acc[`@media (min-width: ${breakpoint})`] = spacing[value];
        return acc;
      }, {} as Record<string, string>),
    };
  },
};

// Sizing system
export const sizing = {
  // Width utilities
  width: {
    auto: 'auto',
    full: '100%',
    screen: '100vw',
    min: 'min-content',
    max: 'max-content',
    fit: 'fit-content',
    ...Object.fromEntries(Object.entries(spacing).filter(([key]) => key !== '0')),
  },

  // Height utilities
  height: {
    auto: 'auto',
    full: '100%',
    screen: '100vh',
    min: 'min-content',
    max: 'max-content',
    fit: 'fit-content',
    ...Object.fromEntries(Object.entries(spacing).filter(([key]) => key !== '0')),
  },

  // Max width utilities
  maxWidth: {
    none: 'none',
    xs: '20rem',
    sm: '24rem',
    md: '28rem',
    lg: '32rem',
    xl: '36rem',
    '2xl': '42rem',
    '3xl': '48rem',
    '4xl': '56rem',
    '5xl': '64rem',
    '6xl': '72rem',
    '7xl': '80rem',
    full: '100%',
    min: 'min-content',
    max: 'max-content',
    fit: 'fit-content',
    prose: '65ch',
    'screen-sm': '640px',
    'screen-md': '768px',
    'screen-lg': '1024px',
    'screen-xl': '1280px',
    'screen-2xl': '1536px',
  },

  // Min width utilities
  minWidth: {
    0: '0px',
    full: '100%',
    min: 'min-content',
    max: 'max-content',
    fit: 'fit-content',
  },

  // Max height utilities
  maxHeight: {
    none: 'none',
    full: '100%',
    screen: '100vh',
    min: 'min-content',
    max: 'max-content',
    fit: 'fit-content',
    ...Object.fromEntries(Object.entries(spacing).filter(([key]) => key !== '0')),
  },

  // Min height utilities
  minHeight: {
    full: '100%',
    screen: '100vh',
    min: 'min-content',
    max: 'max-content',
    fit: 'fit-content',
    ...Object.fromEntries(Object.entries(spacing).filter(([key]) => key !== '0')),
  },
} as const;

// Layout utilities
export const layout = {
  // Container sizes
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    full: '100%',
  },

  // Aspect ratios
  aspectRatio: {
    square: '1 / 1',
    video: '16 / 9',
    photo: '4 / 3',
    wide: '21 / 9',
    portrait: '3 / 4',
    golden: '1.618 / 1',
  },

  // Grid utilities
  grid: {
    cols: {
      1: 'repeat(1, minmax(0, 1fr))',
      2: 'repeat(2, minmax(0, 1fr))',
      3: 'repeat(3, minmax(0, 1fr))',
      4: 'repeat(4, minmax(0, 1fr))',
      5: 'repeat(5, minmax(0, 1fr))',
      6: 'repeat(6, minmax(0, 1fr))',
      12: 'repeat(12, minmax(0, 1fr))',
    },
    gap: spacing,
    rowGap: spacing,
    colGap: spacing,
  },

  // Flexbox utilities
  flex: {
    direction: {
      row: 'row',
      'row-reverse': 'row-reverse',
      col: 'column',
      'col-reverse': 'column-reverse',
    },
    wrap: {
      nowrap: 'nowrap',
      wrap: 'wrap',
      'wrap-reverse': 'wrap-reverse',
    },
    justify: {
      start: 'flex-start',
      end: 'flex-end',
      center: 'center',
      between: 'space-between',
      around: 'space-around',
      evenly: 'space-evenly',
    },
    align: {
      start: 'flex-start',
      end: 'flex-end',
      center: 'center',
      baseline: 'baseline',
      stretch: 'stretch',
    },
  },
} as const;

// Responsive utilities
export const responsiveUtils = {
  /**
   * Generate responsive spacing classes
   */
  generateResponsiveSpacing: (property: string, values: Record<string, Spacing>) => {
    return Object.entries(values).reduce((acc, [breakpoint, value]) => {
      if (breakpoint === 'base') {
        acc[property] = spacing[value];
      } else {
        acc[`@media (min-width: ${breakpoint})`] = {
          [property]: spacing[value],
        };
      }
      return acc;
    }, {} as Record<string, any>);
  },

  /**
   * Create fluid sizing
   */
  createFluidSize: (minSize: string, maxSize: string, minWidth: string = '320px', maxWidth: string = '1200px') => {
    return {
      width: `clamp(${minSize}, calc(${minSize} + (${parseFloat(maxSize)} - ${parseFloat(minSize)}) * ((100vw - ${minWidth}) / (${parseFloat(maxWidth)} - ${parseFloat(minWidth)}))), ${maxSize})`,
    };
  },

  /**
   * Generate container queries
   */
  generateContainerQueries: (queries: Record<string, any>) => {
    return Object.entries(queries).reduce((acc, [size, styles]) => {
      acc[`@container (min-width: ${size})`] = styles;
      return acc;
    }, {} as Record<string, any>);
  },
};

// Spacing presets for common layouts
export const spacingPresets = {
  // Page layouts
  page: {
    container: {
      padding: spacing[4],
      maxWidth: layout.container.xl,
      margin: '0 auto',
    },
    section: {
      paddingTop: spacing[20],
      paddingBottom: spacing[20],
    },
    content: {
      padding: spacing[6],
    },
  },

  // Card layouts
  card: {
    padding: spacing[6],
    gap: spacing[4],
    borderRadius: borderRadius.lg,
  },

  // Form layouts
  form: {
    field: {
      marginBottom: spacing[4],
    },
    label: {
      marginBottom: spacing[2],
    },
    input: {
      padding: spacing[3],
      marginBottom: spacing[2],
    },
    button: {
      marginTop: spacing[4],
    },
  },

  // Navigation layouts
  navigation: {
    padding: spacing[4],
    gap: spacing[6],
  },

  // Grid layouts
  grid: {
    gap: spacing[6],
    padding: spacing[4],
  },
} as const;

// Export types
export type SizingProperty = keyof typeof sizing;
export type WidthValue = keyof typeof sizing.width;
export type HeightValue = keyof typeof sizing.height;
export type MaxWidthValue = keyof typeof sizing.maxWidth;
export type LayoutProperty = keyof typeof layout;
export type SpacingPreset = keyof typeof spacingPresets;

// Export all spacing and sizing utilities
export const spacingSystem = {
  sizing,
  layout,
  presets: spacingPresets,
  utils: spacingUtils,
  responsive: responsiveUtils,
} as const;
