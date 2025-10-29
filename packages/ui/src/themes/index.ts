'use client';

/**
 * Theme System
 * Dynamic theme switching and management
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

// Theme types
export type Theme = 'light' | 'dark' | 'cyber' | 'ocean' | 'medieval' | 'hacker90s' | 'matrix';

// Theme context
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider
export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'light',
  storageKey = 'vulhub-theme',
}) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey) as Theme;
    if (stored) {
      setTheme(stored);
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme, storageKey]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return React.createElement(ThemeContext.Provider, {
    value: { theme, setTheme, toggleTheme }
  }, children);
};

// Theme hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme toggle button
export interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { theme, toggleTheme } = useTheme();

  return React.createElement('button', {
    onClick: toggleTheme,
    className: className,
    'aria-label': 'Toggle theme'
  }, theme === 'light' ? React.createElement('svg', {
    className: 'h-5 w-5',
    fill: 'none',
    viewBox: '0 0 24 24',
    stroke: 'currentColor'
  }, React.createElement('path', {
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 2,
    d: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
  })) : React.createElement('svg', {
    className: 'h-5 w-5',
    fill: 'none',
    viewBox: '0 0 24 24',
    stroke: 'currentColor'
  }, React.createElement('path', {
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 2,
    d: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
  })));
};

// Theme selector
export interface ThemeSelectorProps {
  className?: string;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ className }) => {
  const { theme, setTheme } = useTheme();

  const themes: Array<{ value: Theme; label: string; description: string }> = [
    { value: 'light', label: 'Light', description: 'Clean and bright' },
    { value: 'dark', label: 'Dark', description: 'Easy on the eyes' },
    { value: 'cyber', label: 'Cyber', description: 'Neon and futuristic' },
    { value: 'ocean', label: 'Ocean', description: 'Calm and serene' },
    { value: 'medieval', label: 'Medieval', description: 'Castle and knights' },
    { value: 'matrix', label: 'Matrix', description: 'Green code rain' },
    { value: 'hacker90s', label: '90s Hacker', description: 'Retro terminal vibes' },
  ];

  return React.createElement('div', { className }, [
    React.createElement('label', {
      key: 'label',
      className: 'block text-sm font-medium mb-2'
    }, 'Choose Theme'),
    React.createElement('div', {
      key: 'grid',
      className: 'grid grid-cols-2 gap-2'
    }, themes.map((t) => React.createElement('button', {
      key: t.value,
      onClick: () => setTheme(t.value),
      className: `p-3 rounded-lg border text-left transition-colors ${
        theme === t.value
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border hover:bg-accent'
      }`
    }, [
      React.createElement('div', {
        key: 'label',
        className: 'font-medium'
      }, t.label),
      React.createElement('div', {
        key: 'description',
        className: 'text-xs text-muted-foreground'
      }, t.description)
    ])))
  ]);
};

// Export all theme components
export const Themes = {
  Provider: ThemeProvider,
  Toggle: ThemeToggle,
  Selector: ThemeSelector,
  useTheme,
} as const;