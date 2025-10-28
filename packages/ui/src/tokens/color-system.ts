/**
 * Advanced Color Palette System
 * Provides dynamic color generation and theme management
 */

import { colors, type ColorScale } from './design-tokens';

// Color utility functions
export const colorUtils = {
  /**
   * Generate color variations based on a base color
   */
  generateScale: (baseColor: string, steps: number = 9) => {
    // This would integrate with a color manipulation library like chroma-js
    // For now, we'll return a placeholder structure
    return Array.from({ length: steps }, (_, i) => ({
      [`${(i + 1) * 100}`]: baseColor,
    }));
  },

  /**
   * Convert hex to HSL
   */
  hexToHsl: (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  },

  /**
   * Get contrast ratio between two colors
   */
  getContrastRatio: (color1: string, color2: string) => {
    // Simplified contrast calculation
    // In production, use a proper color contrast library
    return 4.5; // Placeholder
  },

  /**
   * Check if color meets WCAG contrast requirements
   */
  meetsContrast: (foreground: string, background: string, level: 'AA' | 'AAA' = 'AA') => {
    const ratio = colorUtils.getContrastRatio(foreground, background);
    return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
  },
};

// Theme definitions
export const themes = {
  light: {
    name: 'Light',
    colors: {
      background: colors.white,
      foreground: colors.gray[900],
      primary: colors.primary[500],
      secondary: colors.secondary[500],
      accent: colors.accent[500],
      muted: colors.gray[100],
      border: colors.gray[200],
      input: colors.gray[200],
      ring: colors.primary[500],
      success: colors.success[500],
      warning: colors.warning[500],
      error: colors.error[500],
    },
  },
  
  dark: {
    name: 'Dark',
    colors: {
      background: colors.gray[900],
      foreground: colors.gray[50],
      primary: colors.primary[400],
      secondary: colors.secondary[400],
      accent: colors.accent[400],
      muted: colors.gray[800],
      border: colors.gray[700],
      input: colors.gray[700],
      ring: colors.primary[400],
      success: colors.success[400],
      warning: colors.warning[400],
      error: colors.error[400],
    },
  },
  
  cyber: {
    name: 'Cyber',
    colors: {
      background: '#0a0a0a',
      foreground: '#00ff00',
      primary: '#00ff00',
      secondary: '#0080ff',
      accent: '#ff0080',
      muted: '#1a1a1a',
      border: '#333333',
      input: '#333333',
      ring: '#00ff00',
      success: '#00ff00',
      warning: '#ffff00',
      error: '#ff0000',
    },
  },
  
  ocean: {
    name: 'Ocean',
    colors: {
      background: '#f0f9ff',
      foreground: '#0c4a6e',
      primary: '#0284c7',
      secondary: '#0891b2',
      accent: '#0ea5e9',
      muted: '#e0f2fe',
      border: '#bae6fd',
      input: '#bae6fd',
      ring: '#0284c7',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
    },
  },
} as const;

// Color palette presets
export const colorPalettes = {
  monochrome: {
    name: 'Monochrome',
    colors: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
      950: '#09090b',
    },
  },
  
  vibrant: {
    name: 'Vibrant',
    colors: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a',
    },
  },
  
  pastel: {
    name: 'Pastel',
    colors: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6',
      500: '#ec4899',
      600: '#db2777',
      700: '#be185d',
      800: '#9d174d',
      900: '#831843',
      950: '#500724',
    },
  },
} as const;

// CSS custom properties generator
export const generateCSSVariables = (theme: keyof typeof themes) => {
  const themeColors = themes[theme].colors;
  
  return Object.entries(themeColors).reduce((acc, [key, value]) => {
    acc[`--color-${key}`] = value;
    return acc;
  }, {} as Record<string, string>);
};

// Color accessibility utilities
export const accessibility = {
  /**
   * Get accessible text color for a background
   */
  getAccessibleTextColor: (backgroundColor: string) => {
    // Simplified logic - in production use proper contrast calculation
    const isLight = backgroundColor.includes('#fff') || backgroundColor.includes('#f');
    return isLight ? colors.gray[900] : colors.gray[50];
  },

  /**
   * Generate accessible color combinations
   */
  generateAccessibleCombinations: (baseColor: string) => {
    return {
      text: colorUtils.getContrastRatio(baseColor, colors.white) > 4.5 ? colors.white : colors.gray[900],
      background: baseColor,
      border: baseColor,
    };
  },
};

// Export types
export type Theme = keyof typeof themes;
export type ColorPalette = keyof typeof colorPalettes;
export type ThemeColors = typeof themes.light.colors;

// Export all color utilities
export const colorSystem = {
  themes,
  colorPalettes,
  colorUtils,
  accessibility,
  generateCSSVariables,
} as const;
