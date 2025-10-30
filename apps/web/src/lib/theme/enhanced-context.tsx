'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { appThemes, getThemeById, getDefaultTheme, applyTheme, loadGoogleFonts, getStoredTheme, AppTheme } from './theme-manager';

interface EnhancedThemeContextType {
  currentTheme: AppTheme;
  setTheme: (themeId: string) => void;
  isThemeSelectorOpen: boolean;
  toggleThemeSelector: () => void;
  availableThemes: AppTheme[];
}

const EnhancedThemeContext = createContext<EnhancedThemeContextType | undefined>(undefined);

export const EnhancedThemeProvider: React.FC<{
  children: ReactNode;
  defaultTheme?: string;
}> = ({ children, defaultTheme = 'cyberpunk' }) => {
  const [currentTheme, setCurrentTheme] = useState<AppTheme>(getDefaultTheme());
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);

  useEffect(() => {
    // Load theme from storage or use default
    const storedTheme = getStoredTheme();
    const theme = getThemeById(defaultTheme) || storedTheme;
    
    if (theme) {
      setCurrentTheme(theme);
      applyTheme(theme);
      loadGoogleFonts(theme);
    }
  }, [defaultTheme]);

  const setTheme = (themeId: string) => {
    const theme = getThemeById(themeId);
    if (theme) {
      setCurrentTheme(theme);
      applyTheme(theme);
      loadGoogleFonts(theme);
    }
  };

  const toggleThemeSelector = () => {
    setIsThemeSelectorOpen(prev => !prev);
  };

  return (
    <EnhancedThemeContext.Provider
      value={{
        currentTheme,
        setTheme,
        isThemeSelectorOpen,
        toggleThemeSelector,
        availableThemes: appThemes,
      }}
    >
      {children}
    </EnhancedThemeContext.Provider>
  );
};

export const useEnhancedTheme = () => {
  const context = useContext(EnhancedThemeContext);
  if (context === undefined) {
    throw new Error('useEnhancedTheme must be used within an EnhancedThemeProvider');
  }
  return context;
};
