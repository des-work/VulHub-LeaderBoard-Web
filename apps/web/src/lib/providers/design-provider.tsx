'use client';

import React from 'react';
import { DesignProvider, DesignApplication } from '@vulhub/ui';

// 90s Hacker/Matrix theme configuration
const hackerTheme = {
  colors: {
    primary: '#00ff00', // Matrix green
    secondary: '#0080ff', // Cyber blue
    accent: '#ff0080', // Cyber pink
    background: '#000000', // Pure black
    surface: '#001100', // Dark green
    text: '#00ff00', // Matrix green
    muted: '#00aa00', // Dim green
    border: '#00ff00', // Matrix green
    success: '#00ff00', // Matrix green
    warning: '#ffff00', // Yellow
    error: '#ff0000', // Red
  },
  effects: {
    glow: true,
    neon: true,
    gradient: true,
    shadows: true,
    animations: true,
  },
  typography: {
    fontFamily: 'monospace',
    fontSize: 'medium',
    weight: 'bold',
  },
  layout: {
    spacing: 'comfortable',
    borderRadius: 'none',
    density: 'normal',
  },
  elements: {
    icons: 'terminal',
    terminology: 'hacker',
    backgrounds: 'animated',
  },
};

export function ClientDesignProvider({ children }: { children: React.ReactNode }) {
  return (
    <DesignProvider initialConfig={hackerTheme}>
      <DesignApplication>
        {children}
      </DesignApplication>
    </DesignProvider>
  );
}

