/**
 * Advanced Shadow and Elevation System
 * Provides comprehensive shadow utilities and elevation management
 */

import { shadows, type Shadow } from './design-tokens';

// Shadow utility functions
export const shadowUtils = {
  /**
   * Generate custom shadow
   */
  generateShadow: (x: number, y: number, blur: number, spread: number, color: string, opacity: number = 0.1) => {
    return `${x}px ${y}px ${blur}px ${spread}px ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
  },

  /**
   * Generate multiple shadows
   */
  generateMultipleShadows: (shadowDefinitions: Array<{
    x: number;
    y: number;
    blur: number;
    spread: number;
    color: string;
    opacity?: number;
  }>) => {
    return shadowDefinitions
      .map(({ x, y, blur, spread, color, opacity = 0.1 }) =>
        shadowUtils.generateShadow(x, y, blur, spread, color, opacity)
      )
      .join(', ');
  },

  /**
   * Convert shadow to CSS
   */
  toCSS: (value: Shadow | string) => {
    if (typeof value === 'string') return value;
    return shadows[value] || value;
  },
};

// Elevation system
export const elevation = {
  // Material Design elevation levels
  level0: {
    shadow: 'none',
    elevation: 0,
    description: 'No elevation - flat surfaces',
  },
  
  level1: {
    shadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    elevation: 1,
    description: 'Subtle elevation - cards, buttons',
  },
  
  level2: {
    shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    elevation: 2,
    description: 'Low elevation - dropdowns, tooltips',
  },
  
  level3: {
    shadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    elevation: 3,
    description: 'Medium elevation - modals, popovers',
  },
  
  level4: {
    shadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    elevation: 4,
    description: 'High elevation - navigation bars, floating action buttons',
  },
  
  level5: {
    shadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    elevation: 5,
    description: 'Maximum elevation - dialogs, sheets',
  },
} as const;

// Shadow presets for common components
export const shadowPresets = {
  // Button shadows
  button: {
    default: elevation.level1.shadow,
    hover: elevation.level2.shadow,
    active: elevation.level0.shadow,
    disabled: 'none',
  },

  // Card shadows
  card: {
    default: elevation.level1.shadow,
    hover: elevation.level2.shadow,
    selected: elevation.level3.shadow,
  },

  // Modal shadows
  modal: {
    backdrop: '0 0 0 1000px rgb(0 0 0 / 0.5)',
    content: elevation.level5.shadow,
  },

  // Dropdown shadows
  dropdown: {
    menu: elevation.level2.shadow,
    item: 'none',
    itemHover: elevation.level1.shadow,
  },

  // Tooltip shadows
  tooltip: {
    default: elevation.level2.shadow,
  },

  // Navigation shadows
  navigation: {
    header: elevation.level1.shadow,
    sidebar: elevation.level2.shadow,
  },

  // Form shadows
  form: {
    input: {
      default: 'inset 0 1px 2px 0 rgb(0 0 0 / 0.05)',
      focus: '0 0 0 3px rgb(59 130 246 / 0.1)',
      error: '0 0 0 3px rgb(239 68 68 / 0.1)',
    },
  },
} as const;

// Color-specific shadows
export const coloredShadows = {
  primary: {
    sm: '0 1px 2px 0 rgb(59 130 246 / 0.05)',
    md: '0 4px 6px -1px rgb(59 130 246 / 0.1), 0 2px 4px -2px rgb(59 130 246 / 0.1)',
    lg: '0 10px 15px -3px rgb(59 130 246 / 0.1), 0 4px 6px -4px rgb(59 130 246 / 0.1)',
    xl: '0 20px 25px -5px rgb(59 130 246 / 0.1), 0 8px 10px -6px rgb(59 130 246 / 0.1)',
  },
  
  success: {
    sm: '0 1px 2px 0 rgb(34 197 94 / 0.05)',
    md: '0 4px 6px -1px rgb(34 197 94 / 0.1), 0 2px 4px -2px rgb(34 197 94 / 0.1)',
    lg: '0 10px 15px -3px rgb(34 197 94 / 0.1), 0 4px 6px -4px rgb(34 197 94 / 0.1)',
    xl: '0 20px 25px -5px rgb(34 197 94 / 0.1), 0 8px 10px -6px rgb(34 197 94 / 0.1)',
  },
  
  warning: {
    sm: '0 1px 2px 0 rgb(245 158 11 / 0.05)',
    md: '0 4px 6px -1px rgb(245 158 11 / 0.1), 0 2px 4px -2px rgb(245 158 11 / 0.1)',
    lg: '0 10px 15px -3px rgb(245 158 11 / 0.1), 0 4px 6px -4px rgb(245 158 11 / 0.1)',
    xl: '0 20px 25px -5px rgb(245 158 11 / 0.1), 0 8px 10px -6px rgb(245 158 11 / 0.1)',
  },
  
  error: {
    sm: '0 1px 2px 0 rgb(239 68 68 / 0.05)',
    md: '0 4px 6px -1px rgb(239 68 68 / 0.1), 0 2px 4px -2px rgb(239 68 68 / 0.1)',
    lg: '0 10px 15px -3px rgb(239 68 68 / 0.1), 0 4px 6px -4px rgb(239 68 68 / 0.1)',
    xl: '0 20px 25px -5px rgb(239 68 68 / 0.1), 0 8px 10px -6px rgb(239 68 68 / 0.1)',
  },
} as const;

// Interactive shadow utilities
export const interactiveShadows = {
  /**
   * Generate hover shadow transition
   */
  generateHoverTransition: (baseShadow: string, hoverShadow: string, duration: string = '150ms') => {
    return {
      boxShadow: baseShadow,
      transition: `box-shadow ${duration} ease-in-out`,
      '&:hover': {
        boxShadow: hoverShadow,
      },
    };
  },

  /**
   * Generate focus shadow
   */
  generateFocusShadow: (color: string, size: string = '3px') => {
    return `0 0 0 ${size} ${color}`;
  },

  /**
   * Generate active shadow
   */
  generateActiveShadow: (baseShadow: string) => {
    return {
      '&:active': {
        boxShadow: baseShadow,
        transform: 'translateY(1px)',
      },
    };
  },
};

// Responsive shadow utilities
export const responsiveShadows = {
  /**
   * Generate responsive shadows
   */
  generateResponsiveShadows: (shadows: Record<string, Shadow | string>) => {
    return Object.entries(shadows).reduce((acc, [breakpoint, shadow]) => {
      if (breakpoint === 'base') {
        acc.boxShadow = shadowUtils.toCSS(shadow);
      } else {
        acc[`@media (min-width: ${breakpoint})`] = {
          boxShadow: shadowUtils.toCSS(shadow),
        };
      }
      return acc;
    }, {} as Record<string, any>);
  },
};

// Shadow animation utilities
export const shadowAnimations = {
  /**
   * Generate shadow animation keyframes
   */
  generateShadowKeyframes: (name: string, fromShadow: string, toShadow: string) => {
    return {
      [`@keyframes ${name}`]: {
        '0%': { boxShadow: fromShadow },
        '100%': { boxShadow: toShadow },
      },
    };
  },

  /**
   * Generate pulsing shadow animation
   */
  generatePulseShadow: (baseShadow: string, pulseShadow: string, duration: string = '2s') => {
    return {
      animation: `pulse-shadow ${duration} ease-in-out infinite`,
      ...shadowAnimations.generateShadowKeyframes('pulse-shadow', baseShadow, pulseShadow),
    };
  },
};

// Export types
export type ElevationLevel = keyof typeof elevation;
export type ShadowPreset = keyof typeof shadowPresets;
export type ColoredShadowSize = keyof typeof coloredShadows.primary;
export type ColoredShadowColor = keyof typeof coloredShadows;

// Export all shadow and elevation utilities
export const shadowSystem = {
  elevation,
  presets: shadowPresets,
  colored: coloredShadows,
  interactive: interactiveShadows,
  responsive: responsiveShadows,
  animations: shadowAnimations,
  utils: shadowUtils,
} as const;
