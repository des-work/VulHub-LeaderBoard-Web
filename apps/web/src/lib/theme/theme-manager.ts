import { fontThemes, fontConfigs } from '../fonts/configs';
import { colorThemes } from '../colors/palettes';
import { FontTheme } from '../fonts/types';
import { ColorTheme } from '../colors/types';

export interface AppTheme {
  id: string;
  name: string;
  description: string;
  fontTheme: FontTheme;
  colorTheme: ColorTheme;
  cssVariables: Record<string, string>;
}

export const appThemes: AppTheme[] = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Futuristic red, purple, and green with dramatic fonts',
    fontTheme: fontThemes.find(f => f.id === 'cyberpunk')!,
    colorTheme: colorThemes.find(c => c.id === 'cyberpunk')!,
    cssVariables: {}
  },
  {
    id: 'matrix',
    name: 'Matrix',
    description: 'Classic green monochrome with hacker aesthetics',
    fontTheme: fontThemes.find(f => f.id === 'matrix')!,
    colorTheme: colorThemes.find(c => c.id === 'matrix')!,
    cssVariables: {}
  },
  {
    id: 'neon',
    name: 'Neon',
    description: 'Bright neon colors with electric fonts',
    fontTheme: fontThemes.find(f => f.id === 'neon')!,
    colorTheme: colorThemes.find(c => c.id === 'neon')!,
    cssVariables: {}
  },
  {
    id: 'terminal',
    name: 'Terminal',
    description: 'Classic terminal amber and green',
    fontTheme: fontThemes.find(f => f.id === 'technical')!,
    colorTheme: colorThemes.find(c => c.id === 'terminal')!,
    cssVariables: {}
  },
  {
    id: 'futuristic',
    name: 'Futuristic',
    description: 'Sci-fi inspired with space-age aesthetics',
    fontTheme: fontThemes.find(f => f.id === 'futuristic')!,
    colorTheme: colorThemes.find(c => c.id === 'cyberpunk')!,
    cssVariables: {}
  }
];

// Generate CSS variables for each theme
appThemes.forEach(theme => {
  theme.cssVariables = {
    ...theme.colorTheme.cssVariables,
    // Font families
    '--font-primary': theme.fontTheme.primary.cssFamily,
    '--font-secondary': theme.fontTheme.secondary.cssFamily,
    '--font-accent': theme.fontTheme.accent.cssFamily,
    '--font-mono': theme.fontTheme.mono.cssFamily,
    
    // Font weights
    '--font-weight-light': '300',
    '--font-weight-normal': '400',
    '--font-weight-medium': '500',
    '--font-weight-semibold': '600',
    '--font-weight-bold': '700',
    '--font-weight-extrabold': '800',
    '--font-weight-black': '900',
    
    // Font sizes
    '--font-size-xs': '0.75rem',
    '--font-size-sm': '0.875rem',
    '--font-size-base': '1rem',
    '--font-size-lg': '1.125rem',
    '--font-size-xl': '1.25rem',
    '--font-size-2xl': '1.5rem',
    '--font-size-3xl': '1.875rem',
    '--font-size-4xl': '2.25rem',
    '--font-size-5xl': '3rem',
    '--font-size-6xl': '3.75rem',
    '--font-size-7xl': '4.5rem',
    '--font-size-8xl': '6rem',
    '--font-size-9xl': '8rem',
    
    // Line heights
    '--line-height-none': '1',
    '--line-height-tight': '1.25',
    '--line-height-snug': '1.375',
    '--line-height-normal': '1.5',
    '--line-height-relaxed': '1.625',
    '--line-height-loose': '2',
    
    // Letter spacing
    '--letter-spacing-tighter': '-0.05em',
    '--letter-spacing-tight': '-0.025em',
    '--letter-spacing-normal': '0em',
    '--letter-spacing-wide': '0.025em',
    '--letter-spacing-wider': '0.05em',
    '--letter-spacing-widest': '0.1em'
  };
});

export const getThemeById = (id: string): AppTheme | undefined => {
  return appThemes.find(theme => theme.id === id);
};

export const getDefaultTheme = (): AppTheme => {
  return appThemes.find(theme => theme.id === 'cyberpunk') || appThemes[0];
};

export const applyTheme = (theme: AppTheme): void => {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  
  // Apply CSS variables
  Object.entries(theme.cssVariables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
  
  // Add theme class for additional styling
  root.className = root.className.replace(/theme-\w+/g, '');
  root.classList.add(`theme-${theme.id}`);
  
  // Store theme in localStorage
  localStorage.setItem('app-theme', theme.id);
};

export const getStoredTheme = (): AppTheme => {
  if (typeof window === 'undefined') return getDefaultTheme();
  
  const stored = localStorage.getItem('app-theme');
  if (stored) {
    const theme = getThemeById(stored);
    if (theme) return theme;
  }
  
  return getDefaultTheme();
};

export const loadGoogleFonts = (theme: AppTheme): void => {
  if (typeof document === 'undefined') return;
  
  const fonts = [
    theme.fontTheme.primary,
    theme.fontTheme.secondary,
    theme.fontTheme.accent,
    theme.fontTheme.mono
  ];
  
  const uniqueFonts = fonts.filter((font, index, self) => 
    index === self.findIndex(f => f.name === font.name)
  );
  
  uniqueFonts.forEach(font => {
    if (font.googleFonts) {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = 'https://fonts.googleapis.com';
      document.head.appendChild(link);
      
      const link2 = document.createElement('link');
      link2.rel = 'preconnect';
      link2.href = 'https://fonts.gstatic.com';
      link2.crossOrigin = 'anonymous';
      document.head.appendChild(link2);
      
      const fontLink = document.createElement('link');
      fontLink.rel = 'stylesheet';
      fontLink.href = `https://fonts.googleapis.com/css2?family=${font.googleFonts.family}:wght@${font.googleFonts.weights.join(';')}&display=swap`;
      document.head.appendChild(fontLink);
    }
  });
};
