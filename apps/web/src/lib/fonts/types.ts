export interface FontConfig {
  name: string;
  displayName: string;
  category: 'monospace' | 'sans-serif' | 'serif' | 'display' | 'cyber';
  cssFamily: string;
  googleFonts?: {
    family: string;
    weights: number[];
    subsets?: string[];
  };
  fallbacks: string[];
  description: string;
  characteristics: {
    dramatic: boolean;
    readable: boolean;
    futuristic: boolean;
    technical: boolean;
  };
}

export interface FontTheme {
  id: string;
  name: string;
  description: string;
  primary: FontConfig;
  secondary: FontConfig;
  accent: FontConfig;
  mono: FontConfig;
}

export const fontCategories = {
  monospace: 'Monospace',
  'sans-serif': 'Sans Serif',
  serif: 'Serif',
  display: 'Display',
  cyber: 'Cyber/Tech'
} as const;

export type FontCategory = keyof typeof fontCategories;
