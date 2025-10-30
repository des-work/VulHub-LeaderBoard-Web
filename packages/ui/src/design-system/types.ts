/**
 * Unified Design System Types and Default Configuration
 */

// Unified Design System Configuration
export interface DesignConfig {
  // Color Schemes
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  
  // Visual Effects
  effects: {
    glow: boolean;
    neon: boolean;
    gradient: boolean;
    shadows: boolean;
    animations: boolean;
  };
  
  // Typography
  typography: {
    fontFamily: 'modern' | 'monospace' | 'serif';
    fontSize: 'small' | 'medium' | 'large';
    weight: 'light' | 'normal' | 'bold';
  };
  
  // Layout
  layout: {
    spacing: 'compact' | 'comfortable' | 'spacious';
    borderRadius: 'none' | 'subtle' | 'rounded' | 'pill';
    density: 'compact' | 'normal' | 'relaxed';
  };
  
  // Theme Elements
  elements: {
    icons: 'modern' | 'medieval' | 'cyberpunk' | 'terminal';
    terminology: 'standard' | 'medieval' | 'hacker' | 'cyberpunk';
    backgrounds: 'solid' | 'gradient' | 'pattern' | 'animated';
  };
}

// Default configuration combining best elements from all themes
export const defaultDesignConfig: DesignConfig = {
  colors: {
    primary: '#3b82f6', // Modern blue
    secondary: '#8b5cf6', // Purple accent
    accent: '#10b981', // Emerald green
    background: '#0f172a', // Dark slate
    surface: '#1e293b', // Slate
    text: '#f8fafc', // Light text
    muted: '#64748b', // Muted gray
    border: '#334155', // Border gray
    success: '#22c55e', // Green
    warning: '#f59e0b', // Amber
    error: '#ef4444', // Red
  },
  
  effects: {
    glow: true,
    neon: false,
    gradient: true,
    shadows: true,
    animations: true,
  },
  
  typography: {
    fontFamily: 'modern',
    fontSize: 'medium',
    weight: 'normal',
  },
  
  layout: {
    spacing: 'comfortable',
    borderRadius: 'rounded',
    density: 'normal',
  },
  
  elements: {
    icons: 'modern',
    terminology: 'standard',
    backgrounds: 'gradient',
  },
};



