/**
 * Theme Presets
 * Pre-configured themes for different aesthetics
 */

import { ThemeConfig } from './types';

export const matrixTheme: ThemeConfig = {
  name: 'Matrix',
  mode: 'dark',
  
  colors: {
    primary: {
      50: '240 255 244',
      100: '220 252 231',
      200: '187 247 208',
      300: '134 239 172',
      400: '74 222 128',
      500: '0 255 0', // Matrix green
      600: '22 163 74',
      700: '21 128 61',
      800: '22 101 52',
      900: '20 83 45',
      950: '5 46 22',
    },
    secondary: {
      50: '240 249 255',
      100: '224 242 254',
      200: '186 230 253',
      300: '125 211 252',
      400: '56 189 248',
      500: '0 128 255', // Cyber blue
      600: '2 132 199',
      700: '3 105 161',
      800: '7 89 133',
      900: '12 74 110',
      950: '8 47 73',
    },
    neutral: {
      50: '250 250 250',
      100: '240 240 240',
      200: '220 220 220',
      300: '200 200 200',
      400: '160 160 160',
      500: '120 120 120',
      600: '90 90 90',
      700: '70 70 70',
      800: '40 40 40',
      900: '20 20 20',
      950: '10 10 10',
    },
    success: '0 255 0',
    warning: '255 255 0',
    error: '255 0 0',
    info: '0 128 255',
  },
  
  typography: {
    fontFamily: {
      sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
      serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
      mono: '"Courier New", Courier, "Lucida Console", Monaco, monospace',
      display: '"Courier New", Courier, "Lucida Console", Monaco, monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      '7xl': '4.5rem',
      '8xl': '6rem',
      '9xl': '8rem',
    },
    fontWeight: {
      thin: 100,
      extralight: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },
  
  spacing: {
    px: '1px',
    0: '0px',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    11: '2.75rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem',
  },
  
  borderRadius: {
    none: '0px',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '3xl': '0 35px 60px -12px rgb(0 0 0 / 0.3)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: '0 0 #0000',
  },
  
  animations: {
    duration: {
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms',
    },
    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    delay: {
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms',
    },
  },
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  components: {
    button: {
      base: 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      variants: {
        default: 'bg-primary-500 text-primary-950 hover:bg-primary-600',
        destructive: 'bg-error text-white hover:bg-error/90',
        outline: 'border border-primary-500 text-primary-500 hover:bg-primary-500/10',
        secondary: 'bg-secondary-500 text-white hover:bg-secondary-600',
        ghost: 'hover:bg-primary-500/10 hover:text-primary-500',
        link: 'text-primary-500 underline-offset-4 hover:underline',
      },
      sizes: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    card: {
      base: 'rounded-lg border bg-card text-card-foreground shadow-sm',
      variants: {
        default: 'bg-neutral-900 border-neutral-800',
        matrix: 'bg-black/80 border-primary-500/30 shadow-primary-500/20',
        neon: 'bg-black/90 border-primary-500 shadow-lg shadow-primary-500/30',
      },
    },
    input: {
      base: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    },
    badge: {
      base: 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      variants: {
        default: 'border-transparent bg-primary-500 text-primary-950 hover:bg-primary-500/80',
        secondary: 'border-transparent bg-secondary-500 text-white hover:bg-secondary-500/80',
        destructive: 'border-transparent bg-error text-white hover:bg-error/80',
        outline: 'text-primary-500 border-primary-500',
      },
    },
    avatar: {
      base: 'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
    },
  },
};

export const cyberpunkTheme: ThemeConfig = {
  ...matrixTheme,
  name: 'Cyberpunk',
  colors: {
    ...matrixTheme.colors,
    primary: {
      ...matrixTheme.colors.primary,
      500: '255 0 128', // Cyber pink
    },
    secondary: {
      ...matrixTheme.colors.secondary,
      500: '0 255 255', // Cyan
    },
  },
};

export const terminalTheme: ThemeConfig = {
  ...matrixTheme,
  name: 'Terminal',
  colors: {
    ...matrixTheme.colors,
    primary: {
      ...matrixTheme.colors.primary,
      500: '0 255 0', // Green
    },
    neutral: {
      ...matrixTheme.colors.neutral,
      900: '0 0 0', // Pure black
      800: '0 17 0', // Dark green
    },
  },
};

export const defaultTheme: ThemeConfig = {
  name: 'Default',
  mode: 'light',
  
  colors: {
    primary: {
      50: '239 246 255',
      100: '219 234 254',
      200: '191 219 254',
      300: '147 197 253',
      400: '96 165 250',
      500: '59 130 246',
      600: '37 99 235',
      700: '29 78 216',
      800: '30 64 175',
      900: '30 58 138',
      950: '23 37 84',
    },
    secondary: {
      50: '248 250 252',
      100: '241 245 249',
      200: '226 232 240',
      300: '203 213 225',
      400: '148 163 184',
      500: '100 116 139',
      600: '71 85 105',
      700: '51 65 85',
      800: '30 41 59',
      900: '15 23 42',
      950: '2 6 23',
    },
    neutral: {
      50: '248 250 252',
      100: '241 245 249',
      200: '226 232 240',
      300: '203 213 225',
      400: '148 163 184',
      500: '100 116 139',
      600: '71 85 105',
      700: '51 65 85',
      800: '30 41 59',
      900: '15 23 42',
      950: '2 6 23',
    },
    success: '16 185 129',
    warning: '245 158 11',
    error: '239 68 68',
    info: '59 130 246',
  },
  
  typography: matrixTheme.typography,
  spacing: matrixTheme.spacing,
  borderRadius: matrixTheme.borderRadius,
  shadows: matrixTheme.shadows,
  animations: matrixTheme.animations,
  breakpoints: matrixTheme.breakpoints,
  components: matrixTheme.components,
};

export const themePresets: Record<string, ThemeConfig> = {
  default: defaultTheme,
  matrix: matrixTheme,
  cyberpunk: cyberpunkTheme,
  terminal: terminalTheme,
};
