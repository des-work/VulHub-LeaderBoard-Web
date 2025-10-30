'use client';

import React from 'react';
import RippleGrid from './RippleGrid';
import { useThemeValue } from '../../lib/theme/context';

interface ThemeRippleGridProps {
  intensity?: 'low' | 'medium' | 'high';
  enableMouseInteraction?: boolean;
  opacity?: number;
}

const ThemeRippleGrid: React.FC<ThemeRippleGridProps> = ({
  intensity = 'medium',
  enableMouseInteraction = true,
  opacity = 0.6
}) => {
  const theme = useThemeValue();

  const getThemeSettings = () => {
    switch (theme.name.toLowerCase()) {
      case 'matrix':
        return {
          gridColor: '#00ff00',
          rippleIntensity: intensity === 'high' ? 0.08 : intensity === 'low' ? 0.02 : 0.05,
          gridSize: intensity === 'high' ? 12.0 : intensity === 'low' ? 8.0 : 10.0,
          gridThickness: intensity === 'high' ? 18.0 : intensity === 'low' ? 12.0 : 15.0,
          glowIntensity: intensity === 'high' ? 0.15 : intensity === 'low' ? 0.05 : 0.1,
          opacity: opacity * (intensity === 'high' ? 1.2 : intensity === 'low' ? 0.5 : 1.0)
        };
      case 'cyberpunk':
        return {
          gridColor: '#ff0080',
          rippleIntensity: intensity === 'high' ? 0.1 : intensity === 'low' ? 0.03 : 0.06,
          gridSize: intensity === 'high' ? 14.0 : intensity === 'low' ? 9.0 : 11.0,
          gridThickness: intensity === 'high' ? 20.0 : intensity === 'low' ? 14.0 : 17.0,
          glowIntensity: intensity === 'high' ? 0.2 : intensity === 'low' ? 0.08 : 0.12,
          opacity: opacity * (intensity === 'high' ? 1.3 : intensity === 'low' ? 0.6 : 1.0)
        };
      case 'terminal':
        return {
          gridColor: '#00ff00',
          rippleIntensity: intensity === 'high' ? 0.06 : intensity === 'low' ? 0.01 : 0.03,
          gridSize: intensity === 'high' ? 11.0 : intensity === 'low' ? 7.0 : 9.0,
          gridThickness: intensity === 'high' ? 16.0 : intensity === 'low' ? 10.0 : 13.0,
          glowIntensity: intensity === 'high' ? 0.12 : intensity === 'low' ? 0.03 : 0.08,
          opacity: opacity * (intensity === 'high' ? 1.1 : intensity === 'low' ? 0.4 : 0.8)
        };
      default:
        return {
          gridColor: '#3b82f6',
          rippleIntensity: intensity === 'high' ? 0.07 : intensity === 'low' ? 0.02 : 0.04,
          gridSize: intensity === 'high' ? 11.0 : intensity === 'low' ? 8.0 : 9.5,
          gridThickness: intensity === 'high' ? 17.0 : intensity === 'low' ? 11.0 : 14.0,
          glowIntensity: intensity === 'high' ? 0.13 : intensity === 'low' ? 0.06 : 0.09,
          opacity: opacity * (intensity === 'high' ? 1.1 : intensity === 'low' ? 0.6 : 0.9)
        };
    }
  };

  const settings = getThemeSettings();

  return (
    <RippleGrid
      enableRainbow={false}
      gridColor={settings.gridColor}
      rippleIntensity={settings.rippleIntensity}
      gridSize={settings.gridSize}
      gridThickness={settings.gridThickness}
      fadeDistance={1.5}
      vignetteStrength={2.0}
      glowIntensity={settings.glowIntensity}
      opacity={settings.opacity}
      gridRotation={0}
      mouseInteraction={enableMouseInteraction}
      mouseInteractionRadius={1.2}
    />
  );
};

export default ThemeRippleGrid;
