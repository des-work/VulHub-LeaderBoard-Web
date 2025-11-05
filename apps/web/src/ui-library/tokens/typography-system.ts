/**
 * Advanced Typography System
 * Provides comprehensive typography utilities and font management
 */

import { typography, type FontSize } from './design-tokens';

// Typography utility functions
export const typographyUtils = {
  /**
   * Generate responsive font sizes
   */
  generateResponsiveFontSize: (baseSize: FontSize, breakpoints: Record<string, FontSize>) => {
    return {
      base: typography.fontSize[baseSize],
      ...Object.entries(breakpoints).reduce((acc, [breakpoint, size]) => {
        acc[`@media (min-width: ${breakpoint})`] = typography.fontSize[size];
        return acc;
      }, {} as Record<string, any>),
    };
  },

  /**
   * Calculate optimal line height for font size
   */
  getOptimalLineHeight: (fontSize: string) => {
    const size = parseFloat(fontSize);
    return `${size * 1.5}px`;
  },

  /**
   * Generate font weight variations
   */
  getFontWeightVariations: (baseWeight: keyof typeof typography.fontWeight) => {
    const weights = Object.keys(typography.fontWeight) as Array<keyof typeof typography.fontWeight>;
    const baseIndex = weights.indexOf(baseWeight);
    
    return {
      lighter: weights[Math.max(0, baseIndex - 1)],
      base: baseWeight,
      bolder: weights[Math.min(weights.length - 1, baseIndex + 1)],
    };
  },
};

// Typography scales
export const typographyScales = {
  // Display scale for large headings
  display: {
    '4xl': {
      fontSize: typography.fontSize['6xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.tight,
      letterSpacing: typography.letterSpacing.tight,
    },
    '3xl': {
      fontSize: typography.fontSize['5xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.tight,
      letterSpacing: typography.letterSpacing.tight,
    },
    '2xl': {
      fontSize: typography.fontSize['4xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.tight,
      letterSpacing: typography.letterSpacing.tight,
    },
    xl: {
      fontSize: typography.fontSize['3xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.snug,
      letterSpacing: typography.letterSpacing.tight,
    },
    lg: {
      fontSize: typography.fontSize['2xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.snug,
      letterSpacing: typography.letterSpacing.tight,
    },
  },

  // Heading scale for section headings
  heading: {
    h1: {
      fontSize: typography.fontSize['3xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.tight,
      letterSpacing: typography.letterSpacing.tight,
    },
    h2: {
      fontSize: typography.fontSize['2xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.snug,
      letterSpacing: typography.letterSpacing.tight,
    },
    h3: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.snug,
      letterSpacing: typography.letterSpacing.tight,
    },
    h4: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.normal,
    },
    h5: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.normal,
    },
    h6: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.normal,
    },
  },

  // Body text scale
  body: {
    xl: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.relaxed,
      letterSpacing: typography.letterSpacing.normal,
    },
    lg: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.relaxed,
      letterSpacing: typography.letterSpacing.normal,
    },
    base: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.normal,
    },
    sm: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.normal,
    },
    xs: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.normal,
    },
  },

  // Caption and label scale
  caption: {
    lg: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      lineHeight: typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.wide,
    },
    base: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.medium,
      lineHeight: typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.wide,
    },
    sm: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.wider,
    },
  },
} as const;

// Font loading utilities
export const fontLoading = {
  /**
   * Preload critical fonts
   */
  preloadFonts: (fonts: string[]) => {
    return fonts.map(font => ({
      rel: 'preload',
      as: 'font',
      href: `/fonts/${font}.woff2`,
      type: 'font/woff2',
      crossOrigin: 'anonymous',
    }));
  },

  /**
   * Generate font face declarations
   */
  generateFontFaces: (fontFamily: string, fontWeights: number[], fontStyles: string[] = ['normal']) => {
    return fontWeights.flatMap(weight =>
      fontStyles.map(style => ({
        fontFamily,
        fontWeight: weight,
        fontStyle: style,
        fontDisplay: 'swap',
      }))
    );
  },
};

// Typography presets for common use cases
export const typographyPresets = {
  // Hero section typography
  hero: {
    title: {
      fontSize: typography.fontSize['6xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.tight,
      letterSpacing: typography.letterSpacing.tighter,
    },
    subtitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.relaxed,
      letterSpacing: typography.letterSpacing.normal,
    },
  },

  // Card typography
  card: {
    title: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.snug,
      letterSpacing: typography.letterSpacing.tight,
    },
    description: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.normal,
    },
  },

  // Navigation typography
  navigation: {
    primary: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.medium,
      lineHeight: typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.normal,
    },
    secondary: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.normal,
    },
  },

  // Form typography
  form: {
    label: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      lineHeight: typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.normal,
    },
    input: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.normal,
    },
    helper: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.normal,
    },
    error: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.medium,
      lineHeight: typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.normal,
    },
  },
} as const;

// Responsive typography utilities
export const responsiveTypography = {
  /**
   * Generate responsive typography classes
   */
  generateResponsiveClasses: (base: any, breakpoints: Record<string, any>) => {
    return {
      base,
      ...Object.entries(breakpoints).reduce((acc, [breakpoint, styles]) => {
        acc[`@media (min-width: ${breakpoint})`] = styles;
        return acc;
      }, {} as Record<string, any>),
    };
  },

  /**
   * Create fluid typography
   */
  createFluidTypography: (minSize: string, maxSize: string, minWidth: string = '320px', maxWidth: string = '1200px') => {
    return {
      fontSize: `clamp(${minSize}, calc(${minSize} + (${parseFloat(maxSize)} - ${parseFloat(minSize)}) * ((100vw - ${minWidth}) / (${parseFloat(maxWidth)} - ${parseFloat(minWidth)}))), ${maxSize})`,
    };
  },
};

// Export types
export type TypographyScale = keyof typeof typographyScales;
export type DisplaySize = keyof typeof typographyScales.display;
export type HeadingSize = keyof typeof typographyScales.heading;
export type BodySize = keyof typeof typographyScales.body;
export type CaptionSize = keyof typeof typographyScales.caption;
export type TypographyPreset = keyof typeof typographyPresets;

// Export all typography utilities
export const typographySystem = {
  scales: typographyScales,
  presets: typographyPresets,
  utils: typographyUtils,
  fontLoading,
  responsive: responsiveTypography,
} as const;
