'use client';

import React, { useState } from 'react';
import { Button } from '../../lib/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../lib/ui/card';
import { RippleGrid, MatrixRippleGrid, ThemeRippleGrid } from '../../components/RippleGrid';
import { useThemeValue } from '../../lib/theme/context';

export default function RippleGridDemo() {
  const theme = useThemeValue();
  const [intensity, setIntensity] = useState<'low' | 'medium' | 'high'>('medium');
  const [enableMouse, setEnableMouse] = useState(true);
  const [opacity, setOpacity] = useState(0.6);

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* OGL RippleGrid Background */}
      <ThemeRippleGrid 
        intensity={intensity} 
        enableMouseInteraction={enableMouse} 
        opacity={opacity} 
      />
      
      <div className="relative z-10 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-green-400 font-mono mb-8 text-center">
            RippleGrid Demo
          </h1>
          
          {/* Controls */}
          <Card variant="matrix" className="mb-8">
            <CardHeader>
              <CardTitle className="text-green-400 font-mono">Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-mono text-green-300 mb-2">
                    Intensity
                  </label>
                  <div className="flex space-x-2">
                    {(['low', 'medium', 'high'] as const).map((level) => (
                      <Button
                        key={level}
                        variant={intensity === level ? 'matrix' : 'outline'}
                        size="sm"
                        onClick={() => setIntensity(level)}
                        className="capitalize"
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-mono text-green-300 mb-2">
                    Mouse Interaction
                  </label>
                  <Button
                    variant={enableMouse ? 'matrix' : 'outline'}
                    size="sm"
                    onClick={() => setEnableMouse(!enableMouse)}
                  >
                    {enableMouse ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                
                <div>
                  <label className="block text-sm font-mono text-green-300 mb-2">
                    Opacity: {opacity.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.1"
                    value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grid Variants */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card variant="matrix" className="text-center">
              <CardHeader>
                <CardTitle className="text-green-400 font-mono">Matrix Theme</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 font-mono text-sm mb-4">
                  Classic Matrix green grid with cyberpunk aesthetics
                </p>
                <div className="space-y-2">
                  <div className="text-xs font-mono text-gray-400">
                    Color: #00ff00
                  </div>
                  <div className="text-xs font-mono text-gray-400">
                    Intensity: {intensity}
                  </div>
                  <div className="text-xs font-mono text-gray-400">
                    Mouse: {enableMouse ? 'Yes' : 'No'}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="matrix" className="text-center">
              <CardHeader>
                <CardTitle className="text-green-400 font-mono">Custom Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 font-mono text-sm mb-4">
                  Fully customizable grid with all parameters
                </p>
                <div className="space-y-2">
                  <div className="text-xs font-mono text-gray-400">
                    Grid Size: 10.0
                  </div>
                  <div className="text-xs font-mono text-gray-400">
                    Ripple: 0.05
                  </div>
                  <div className="text-xs font-mono text-gray-400">
                    Glow: 0.1
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="matrix" className="text-center">
              <CardHeader>
                <CardTitle className="text-green-400 font-mono">Theme Aware</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 font-mono text-sm mb-4">
                  Automatically adapts to current theme
                </p>
                <div className="space-y-2">
                  <div className="text-xs font-mono text-gray-400">
                    Current: {theme.name}
                  </div>
                  <div className="text-xs font-mono text-gray-400">
                    Mode: {theme.mode}
                  </div>
                  <div className="text-xs font-mono text-gray-400">
                    Auto-adapting
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features */}
          <Card variant="matrix" className="mt-8">
            <CardHeader>
              <CardTitle className="text-green-400 font-mono">Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-mono font-bold text-green-400 mb-3">
                    Interactive Effects
                  </h3>
                  <ul className="space-y-2 text-sm font-mono text-gray-300">
                    <li>• Mouse-responsive ripples</li>
                    <li>• Real-time parameter updates</li>
                    <li>• Smooth animations</li>
                    <li>• Performance optimized</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-mono font-bold text-green-400 mb-3">
                    Customization
                  </h3>
                  <ul className="space-y-2 text-sm font-mono text-gray-300">
                    <li>• Multiple intensity levels</li>
                    <li>• Theme-aware colors</li>
                    <li>• Adjustable opacity</li>
                    <li>• Responsive design</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Back to Home */}
          <div className="text-center mt-8">
            <Button 
              variant="matrix" 
              size="lg"
              onClick={() => window.location.href = '/'}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
