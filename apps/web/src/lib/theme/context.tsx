'use client';

/**
 * Theme Context and Provider
 * Provides theme management and customization capabilities
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ThemeConfig, ThemeContextType, ThemePreset } from './types';
import { themePresets } from './presets';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemePreset | ThemeConfig;
  storageKey?: string;
}

export function ThemeProvider({ 
  children, 
  defaultTheme = 'matrix',
  storageKey = 'vulhub-theme'
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeConfig>(() => {
    // Initialize theme from localStorage or default
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return parsed;
        } catch {
          // Fallback to preset if parsing fails
        }
      }
    }
    
    // Use preset or custom theme
    if (typeof defaultTheme === 'string') {
      return themePresets[defaultTheme] || themePresets.matrix;
    }
    
    return defaultTheme;
  });

  // Save theme to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(theme));
    }
  }, [theme, storageKey]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply CSS custom properties
    Object.entries(theme.colors.primary).forEach(([key, value]) => {
      root.style.setProperty(`--color-primary-${key}`, value);
    });
    
    Object.entries(theme.colors.secondary).forEach(([key, value]) => {
      root.style.setProperty(`--color-secondary-${key}`, value);
    });
    
    Object.entries(theme.colors.neutral).forEach(([key, value]) => {
      root.style.setProperty(`--color-neutral-${key}`, value);
    });
    
    // Apply semantic colors
    root.style.setProperty('--color-success', theme.colors.success);
    root.style.setProperty('--color-warning', theme.colors.warning);
    root.style.setProperty('--color-error', theme.colors.error);
    root.style.setProperty('--color-info', theme.colors.info);
    
    // Apply typography
    Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
      root.style.setProperty(`--font-size-${key}`, value);
    });
    
    Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
      root.style.setProperty(`--font-weight-${key}`, value.toString());
    });
    
    Object.entries(theme.typography.lineHeight).forEach(([key, value]) => {
      root.style.setProperty(`--line-height-${key}`, value.toString());
    });
    
    Object.entries(theme.typography.letterSpacing).forEach(([key, value]) => {
      root.style.setProperty(`--letter-spacing-${key}`, value);
    });
    
    // Apply font families
    root.style.setProperty('--font-family-sans', theme.typography.fontFamily.sans);
    root.style.setProperty('--font-family-serif', theme.typography.fontFamily.serif);
    root.style.setProperty('--font-family-mono', theme.typography.fontFamily.mono);
    root.style.setProperty('--font-family-display', theme.typography.fontFamily.display);
    
    // Apply spacing
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });
    
    // Apply border radius
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
    });
    
    // Apply shadows
    Object.entries(theme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });
    
    // Apply animations
    Object.entries(theme.animations.duration).forEach(([key, value]) => {
      root.style.setProperty(`--duration-${key}`, value);
    });
    
    Object.entries(theme.animations.easing).forEach(([key, value]) => {
      root.style.setProperty(`--easing-${key}`, value);
    });
    
    // Apply breakpoints
    Object.entries(theme.breakpoints).forEach(([key, value]) => {
      root.style.setProperty(`--breakpoint-${key}`, value);
    });
    
    // Apply theme mode
    root.setAttribute('data-theme', theme.name.toLowerCase());
    root.setAttribute('data-mode', theme.mode);
    
  }, [theme]);

  const setTheme = useCallback((newTheme: ThemeConfig) => {
    setThemeState(newTheme);
  }, []);

  const updateTheme = useCallback((updates: Partial<ThemeConfig>) => {
    setThemeState(prev => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const resetTheme = useCallback(() => {
    const preset = typeof defaultTheme === 'string' ? defaultTheme : 'matrix';
    setThemeState(themePresets[preset] || themePresets.matrix);
  }, [defaultTheme]);

  const toggleMode = useCallback(() => {
    setThemeState(prev => ({
      ...prev,
      mode: prev.mode === 'light' ? 'dark' : 'light',
    }));
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value: ThemeContextType = useMemo(() => ({
    theme,
    setTheme,
    updateTheme,
    resetTheme,
    toggleMode,
  }), [theme, setTheme, updateTheme, resetTheme, toggleMode]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Hook for accessing theme values directly
export function useThemeValue() {
  const context = useContext(ThemeContext);
  // Return a default theme if no provider is found (for SSR compatibility)
  if (context === undefined) {
    return themePresets.matrix;
  }
  return context.theme;
}

// Hook for theme customization
export function useThemeCustomization() {
  const { theme, updateTheme, resetTheme, toggleMode } = useTheme();
  
  const updateColors = useCallback((colorUpdates: Partial<ThemeConfig['colors']>) => {
    updateTheme({
      colors: {
        ...theme.colors,
        ...colorUpdates,
      },
    });
  }, [theme.colors, updateTheme]);
  
  const updateTypography = useCallback((typographyUpdates: Partial<ThemeConfig['typography']>) => {
    updateTheme({
      typography: {
        ...theme.typography,
        ...typographyUpdates,
      },
    });
  }, [theme.typography, updateTheme]);
  
  const updateSpacing = useCallback((spacingUpdates: Partial<ThemeConfig['spacing']>) => {
    updateTheme({
      spacing: {
        ...theme.spacing,
        ...spacingUpdates,
      },
    });
  }, [theme.spacing, updateTheme]);
  
  return {
    theme,
    updateColors,
    updateTypography,
    updateSpacing,
    resetTheme,
    toggleMode,
  };
}
