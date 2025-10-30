'use client';

import React from 'react';
import RippleGrid from './RippleGrid';

interface MatrixRippleGridProps {
  intensity?: 'low' | 'medium' | 'high';
  enableMouseInteraction?: boolean;
  opacity?: number;
}

const MatrixRippleGrid: React.FC<MatrixRippleGridProps> = ({
  intensity = 'medium',
  enableMouseInteraction = true,
  opacity = 0.6
}) => {
  const getIntensitySettings = (level: string) => {
    switch (level) {
      case 'low':
        return {
          rippleIntensity: 0.02,
          gridSize: 8.0,
          gridThickness: 12.0,
          glowIntensity: 0.05,
          opacity: opacity * 0.5
        };
      case 'high':
        return {
          rippleIntensity: 0.08,
          gridSize: 12.0,
          gridThickness: 18.0,
          glowIntensity: 0.15,
          opacity: opacity * 1.2
        };
      default: // medium
        return {
          rippleIntensity: 0.05,
          gridSize: 10.0,
          gridThickness: 15.0,
          glowIntensity: 0.1,
          opacity: opacity
        };
    }
  };

  const settings = getIntensitySettings(intensity);

  return (
    <RippleGrid
      enableRainbow={false}
      gridColor="#00ff00" // Matrix green
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

export default MatrixRippleGrid;
