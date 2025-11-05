'use client';

import React from 'react';
import { useDesign } from './context';
import { DesignConfig } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '../primitives';
import { Button } from '../primitives';

interface CustomizationPanelProps {
  className?: string;
}

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({ className = '' }) => {
  const { config, updateConfig, resetConfig } = useDesign();

  const handleColorChange = (colorKey: keyof DesignConfig['colors'], value: string) => {
    updateConfig({
      colors: {
        ...config.colors,
        [colorKey]: value,
      },
    });
  };

  const handleEffectToggle = (effectKey: keyof DesignConfig['effects'], value: boolean) => {
    updateConfig({
      effects: {
        ...config.effects,
        [effectKey]: value,
      },
    });
  };

  const handleTypographyChange = (typographyKey: keyof DesignConfig['typography'], value: any) => {
    updateConfig({
      typography: {
        ...config.typography,
        [typographyKey]: value,
      },
    });
  };

  const handleLayoutChange = (layoutKey: keyof DesignConfig['layout'], value: any) => {
    updateConfig({
      layout: {
        ...config.layout,
        [layoutKey]: value,
      },
    });
  };

  const handleElementChange = (elementKey: keyof DesignConfig['elements'], value: any) => {
    updateConfig({
      elements: {
        ...config.elements,
        [elementKey]: value,
      },
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Design Customization</h2>
        <Button variant="outline" onClick={resetConfig}>
          Reset to Default
        </Button>
      </div>

      {/* Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Colors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(config.colors).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <label className="text-sm font-medium capitalize">{key}</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => handleColorChange(key as keyof DesignConfig['colors'], e.target.value)}
                    className="w-8 h-8 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleColorChange(key as keyof DesignConfig['colors'], e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Effects */}
      <Card>
        <CardHeader>
          <CardTitle>Visual Effects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(config.effects).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-sm font-medium capitalize">{key}</label>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handleEffectToggle(key as keyof DesignConfig['effects'], e.target.checked)}
                  className="rounded"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Font Family</label>
            <select
              value={config.typography.fontFamily}
              onChange={(e) => handleTypographyChange('fontFamily', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="modern">Modern</option>
              <option value="monospace">Monospace</option>
              <option value="serif">Serif</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Font Size</label>
            <select
              value={config.typography.fontSize}
              onChange={(e) => handleTypographyChange('fontSize', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Font Weight</label>
            <select
              value={config.typography.weight}
              onChange={(e) => handleTypographyChange('weight', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="light">Light</option>
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Layout */}
      <Card>
        <CardHeader>
          <CardTitle>Layout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Spacing</label>
            <select
              value={config.layout.spacing}
              onChange={(e) => handleLayoutChange('spacing', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="compact">Compact</option>
              <option value="comfortable">Comfortable</option>
              <option value="spacious">Spacious</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Border Radius</label>
            <select
              value={config.layout.borderRadius}
              onChange={(e) => handleLayoutChange('borderRadius', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="none">None</option>
              <option value="subtle">Subtle</option>
              <option value="rounded">Rounded</option>
              <option value="pill">Pill</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Density</label>
            <select
              value={config.layout.density}
              onChange={(e) => handleLayoutChange('density', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="compact">Compact</option>
              <option value="normal">Normal</option>
              <option value="relaxed">Relaxed</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Elements */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Elements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Icon Style</label>
            <select
              value={config.elements.icons}
              onChange={(e) => handleElementChange('icons', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="modern">Modern</option>
              <option value="medieval">Medieval</option>
              <option value="cyberpunk">Cyberpunk</option>
              <option value="terminal">Terminal</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Terminology</label>
            <select
              value={config.elements.terminology}
              onChange={(e) => handleElementChange('terminology', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="standard">Standard</option>
              <option value="medieval">Medieval</option>
              <option value="hacker">Hacker</option>
              <option value="cyberpunk">Cyberpunk</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Background Style</label>
            <select
              value={config.elements.backgrounds}
              onChange={(e) => handleElementChange('backgrounds', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="solid">Solid</option>
              <option value="gradient">Gradient</option>
              <option value="pattern">Pattern</option>
              <option value="animated">Animated</option>
            </select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
