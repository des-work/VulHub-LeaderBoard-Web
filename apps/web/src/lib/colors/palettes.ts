import { ColorPalette, ColorTheme } from './types';

export const colorPalettes: ColorPalette[] = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Neon red, purple, and green with high contrast',
    primary: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444', // Main red
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a'
    },
    secondary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7', // Main purple
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87',
      950: '#3b0764'
    },
    accent: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e', // Main green
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#052e16'
    },
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617'
    },
    semantic: {
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    },
    background: {
      primary: '#0a0a0a',
      secondary: '#1a1a1a',
      tertiary: '#2a2a2a',
      overlay: 'rgba(0, 0, 0, 0.8)'
    },
    text: {
      primary: '#ffffff',
      secondary: '#e2e8f0',
      tertiary: '#94a3b8',
      inverse: '#0a0a0a'
    },
    border: {
      primary: '#374151',
      secondary: '#4b5563',
      accent: '#a855f7'
    }
  },
  {
    id: 'matrix',
    name: 'Matrix',
    description: 'Classic green monochrome with red accents',
    primary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#00ff00', // Matrix green
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#052e16'
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617'
    },
    accent: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ff0000', // Matrix red
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a'
    },
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617'
    },
    semantic: {
      success: '#00ff00',
      warning: '#ffff00',
      error: '#ff0000',
      info: '#00ffff'
    },
    background: {
      primary: '#000000',
      secondary: '#0a0a0a',
      tertiary: '#1a1a1a',
      overlay: 'rgba(0, 0, 0, 0.9)'
    },
    text: {
      primary: '#00ff00',
      secondary: '#00cc00',
      tertiary: '#009900',
      inverse: '#000000'
    },
    border: {
      primary: '#004d00',
      secondary: '#006600',
      accent: '#00ff00'
    }
  },
  {
    id: 'neon',
    name: 'Neon',
    description: 'Bright neon colors with electric feel',
    primary: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ff0080', // Neon pink
      600: '#e60073',
      700: '#cc0066',
      800: '#b30059',
      900: '#99004d',
      950: '#660033'
    },
    secondary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#8b5cf6', // Neon purple
      600: '#7c3aed',
      700: '#6d28d9',
      800: '#5b21b6',
      900: '#4c1d95',
      950: '#2e1065'
    },
    accent: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#00ff41', // Neon green
      600: '#00e639',
      700: '#00cc31',
      800: '#00b329',
      900: '#009921',
      950: '#006614'
    },
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617'
    },
    semantic: {
      success: '#00ff41',
      warning: '#ffaa00',
      error: '#ff0080',
      info: '#00aaff'
    },
    background: {
      primary: '#0a0a0a',
      secondary: '#1a0a1a',
      tertiary: '#2a0a2a',
      overlay: 'rgba(0, 0, 0, 0.85)'
    },
    text: {
      primary: '#ffffff',
      secondary: '#e2e8f0',
      tertiary: '#94a3b8',
      inverse: '#0a0a0a'
    },
    border: {
      primary: '#374151',
      secondary: '#4b5563',
      accent: '#ff0080'
    }
  },
  {
    id: 'terminal',
    name: 'Terminal',
    description: 'Classic terminal colors with amber and green',
    primary: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b', // Terminal amber
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#451a03'
    },
    secondary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e', // Terminal green
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#052e16'
    },
    accent: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444', // Terminal red
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a'
    },
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617'
    },
    semantic: {
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    },
    background: {
      primary: '#000000',
      secondary: '#0a0a0a',
      tertiary: '#1a1a1a',
      overlay: 'rgba(0, 0, 0, 0.9)'
    },
    text: {
      primary: '#f59e0b',
      secondary: '#e2e8f0',
      tertiary: '#94a3b8',
      inverse: '#000000'
    },
    border: {
      primary: '#374151',
      secondary: '#4b5563',
      accent: '#f59e0b'
    }
  }
];

export const colorThemes: ColorTheme[] = colorPalettes.map(palette => ({
  id: palette.id,
  name: palette.name,
  description: palette.description,
  palette,
  cssVariables: {
    // Primary colors
    '--color-primary-50': palette.primary[50],
    '--color-primary-100': palette.primary[100],
    '--color-primary-200': palette.primary[200],
    '--color-primary-300': palette.primary[300],
    '--color-primary-400': palette.primary[400],
    '--color-primary-500': palette.primary[500],
    '--color-primary-600': palette.primary[600],
    '--color-primary-700': palette.primary[700],
    '--color-primary-800': palette.primary[800],
    '--color-primary-900': palette.primary[900],
    '--color-primary-950': palette.primary[950],
    
    // Secondary colors
    '--color-secondary-50': palette.secondary[50],
    '--color-secondary-100': palette.secondary[100],
    '--color-secondary-200': palette.secondary[200],
    '--color-secondary-300': palette.secondary[300],
    '--color-secondary-400': palette.secondary[400],
    '--color-secondary-500': palette.secondary[500],
    '--color-secondary-600': palette.secondary[600],
    '--color-secondary-700': palette.secondary[700],
    '--color-secondary-800': palette.secondary[800],
    '--color-secondary-900': palette.secondary[900],
    '--color-secondary-950': palette.secondary[950],
    
    // Accent colors
    '--color-accent-50': palette.accent[50],
    '--color-accent-100': palette.accent[100],
    '--color-accent-200': palette.accent[200],
    '--color-accent-300': palette.accent[300],
    '--color-accent-400': palette.accent[400],
    '--color-accent-500': palette.accent[500],
    '--color-accent-600': palette.accent[600],
    '--color-accent-700': palette.accent[700],
    '--color-accent-800': palette.accent[800],
    '--color-accent-900': palette.accent[900],
    '--color-accent-950': palette.accent[950],
    
    // Neutral colors
    '--color-neutral-50': palette.neutral[50],
    '--color-neutral-100': palette.neutral[100],
    '--color-neutral-200': palette.neutral[200],
    '--color-neutral-300': palette.neutral[300],
    '--color-neutral-400': palette.neutral[400],
    '--color-neutral-500': palette.neutral[500],
    '--color-neutral-600': palette.neutral[600],
    '--color-neutral-700': palette.neutral[700],
    '--color-neutral-800': palette.neutral[800],
    '--color-neutral-900': palette.neutral[900],
    '--color-neutral-950': palette.neutral[950],
    
    // Semantic colors
    '--color-success': palette.semantic.success,
    '--color-warning': palette.semantic.warning,
    '--color-error': palette.semantic.error,
    '--color-info': palette.semantic.info,
    
    // Background colors
    '--color-bg-primary': palette.background.primary,
    '--color-bg-secondary': palette.background.secondary,
    '--color-bg-tertiary': palette.background.tertiary,
    '--color-bg-overlay': palette.background.overlay,
    
    // Text colors
    '--color-text-primary': palette.text.primary,
    '--color-text-secondary': palette.text.secondary,
    '--color-text-tertiary': palette.text.tertiary,
    '--color-text-inverse': palette.text.inverse,
    
    // Border colors
    '--color-border-primary': palette.border.primary,
    '--color-border-secondary': palette.border.secondary,
    '--color-border-accent': palette.border.accent
  }
}));
