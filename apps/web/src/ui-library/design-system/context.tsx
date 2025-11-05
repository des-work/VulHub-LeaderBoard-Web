'use client';

/**
 * Design Context - Provider and Hook
 */

import React from 'react';
import { DesignConfig, defaultDesignConfig } from './types';

// Design Context
interface DesignContextType {
  config: DesignConfig;
  updateConfig: (updates: Partial<DesignConfig>) => void;
  resetConfig: () => void;
}

export const DesignContext = React.createContext<DesignContextType | undefined>(undefined);

export const DesignProvider: React.FC<{
  children: React.ReactNode;
  initialConfig?: Partial<DesignConfig>;
}> = ({ children, initialConfig }) => {
  const [config, setConfig] = React.useState<DesignConfig>({
    ...defaultDesignConfig,
    ...initialConfig,
  });

  const updateConfig = React.useCallback((updates: Partial<DesignConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const resetConfig = React.useCallback(() => {
    setConfig(defaultDesignConfig);
  }, []);

  return (
    <DesignContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </DesignContext.Provider>
  );
};

export const useDesign = () => {
  const context = React.useContext(DesignContext);
  if (!context) {
    throw new Error('useDesign must be used within a DesignProvider');
  }
  return context;
};

