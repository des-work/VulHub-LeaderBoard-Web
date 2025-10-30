'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { cssManager } from '../lib/css/manager';
import { CSSDebugInfo } from '../lib/css/debugger';
import CSSHealthCheck from './CSSHealthCheck';

interface CSSContextType {
  isHealthy: boolean;
  isFallbackActive: boolean;
  debugInfo: CSSDebugInfo | null;
  retryCSS: () => Promise<void>;
  status: ReturnType<typeof cssManager.getStatus>;
}

const CSSContext = createContext<CSSContextType | undefined>(undefined);

interface CSSProviderProps {
  children: React.ReactNode;
  showDebugPanel?: boolean;
  enableFallback?: boolean;
  enableDebugging?: boolean;
}

export const CSSProvider: React.FC<CSSProviderProps> = ({
  children,
  showDebugPanel = false,
  enableFallback = true,
  enableDebugging = true,
}) => {
  const [isHealthy, setIsHealthy] = useState<boolean>(false);
  const [isFallbackActive, setIsFallbackActive] = useState<boolean>(false);
  const [debugInfo, setDebugInfo] = useState<CSSDebugInfo | null>(null);

  useEffect(() => {
    // Update CSS manager config
    cssManager.updateConfig({
      enableFallback,
      enableDebugging,
    });

    // Initialize CSS manager
    const initializeCSS = async () => {
      try {
        await cssManager.initialize();
        const status = cssManager.getStatus();
        setIsFallbackActive(status.fallbackInjected);
      } catch (error) {
        console.error('CSS Provider initialization failed:', error);
      }
    };

    initializeCSS();

    // Set up health monitoring
    const handleStatusChange = (healthy: boolean) => {
      setIsHealthy(healthy);
      const status = cssManager.getStatus();
      setIsFallbackActive(status.fallbackInjected);
    };

    // Subscribe to debug info updates
    const unsubscribe = cssManager.subscribe?.((info: CSSDebugInfo) => {
      setDebugInfo(info);
      setIsHealthy(info.hasTailwind && info.errors.length === 0);
      const status = cssManager.getStatus();
      setIsFallbackActive(status.fallbackInjected);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [enableFallback, enableDebugging]);

  const retryCSS = async (): Promise<void> => {
    try {
      await cssManager.retryCSS();
      const status = cssManager.getStatus();
      setIsFallbackActive(status.fallbackInjected);
    } catch (error) {
      console.error('CSS retry failed:', error);
    }
  };

  const contextValue: CSSContextType = {
    isHealthy,
    isFallbackActive,
    debugInfo,
    retryCSS,
    status: cssManager.getStatus(),
  };

  return (
    <CSSContext.Provider value={contextValue}>
      {children}
      <CSSHealthCheck 
        showDebugPanel={showDebugPanel} 
        onStatusChange={setIsHealthy}
      />
    </CSSContext.Provider>
  );
};

export const useCSS = (): CSSContextType => {
  const context = useContext(CSSContext);
  if (context === undefined) {
    throw new Error('useCSS must be used within a CSSProvider');
  }
  return context;
};

export default CSSProvider;
