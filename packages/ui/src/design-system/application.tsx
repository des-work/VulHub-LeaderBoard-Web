'use client';

import { useEffect } from 'react';
import { useDesign } from './index';

// Hook to apply design configuration to the DOM
export const useDesignApplication = () => {
  const { config } = useDesign();

  useEffect(() => {
    const root = document.documentElement;
    
    // Apply color variables
    Object.entries(config.colors).forEach(([key, value]) => {
      // Convert hex to RGB values
      const hex = value.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      
      root.style.setProperty(`--color-${key}`, `${r} ${g} ${b}`);
    });

    // Apply layout attributes
    root.setAttribute('data-layout-spacing', config.layout.spacing);
    root.setAttribute('data-layout-radius', config.layout.borderRadius);
    root.setAttribute('data-layout-density', config.layout.density);

    // Apply typography attributes
    root.setAttribute('data-typography-family', config.typography.fontFamily);
    root.setAttribute('data-typography-size', config.typography.fontSize);
    root.setAttribute('data-typography-weight', config.typography.weight);

    // Apply element attributes
    root.setAttribute('data-icon-style', config.elements.icons);
    root.setAttribute('data-terminology', config.elements.terminology);
    root.setAttribute('data-background-style', config.elements.backgrounds);

    // Apply effect attributes
    Object.entries(config.effects).forEach(([key, value]) => {
      root.setAttribute(`data-effect-${key}`, value.toString());
    });

    // Apply font family
    const fontFamilyMap = {
      modern: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
      monospace: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
      serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    };
    
    root.style.setProperty('--font-family-current', fontFamilyMap[config.typography.fontFamily]);

  }, [config]);
};

// Component to apply design configuration
export const DesignApplication: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useDesignApplication();
  return <>{children}</>;
};
