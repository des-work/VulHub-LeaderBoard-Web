'use client';

import React, { useState } from 'react';
import RippleGridV2 from '../../components/RippleGrid/RippleGridV2';
import { Button } from '../../lib/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../lib/ui/card';

export default function RippleTestPage() {
  const [config, setConfig] = useState({
    enableRainbow: false,
    gridColor: '#00ff00',
    rippleIntensity: 0.05,
    gridSize: 10,
    gridThickness: 15,
    fadeDistance: 1.5,
    vignetteStrength: 2.0,
    glowIntensity: 0.1,
    opacity: 0.8,
    gridRotation: 0,
    mouseInteraction: true,
    mouseInteractionRadius: 1.2
  });

  const presets = {
    matrix: {
      enableRainbow: false,
      gridColor: '#00ff00',
      rippleIntensity: 0.05,
      gridSize: 10,
      gridThickness: 15,
      opacity: 0.8
    },
    cyberpunk: {
      enableRainbow: false,
      gridColor: '#ff00ff',
      rippleIntensity: 0.08,
      gridSize: 12,
      gridThickness: 20,
      opacity: 0.9
    },
    terminal: {
      enableRainbow: false,
      gridColor: '#00ff00',
      rippleIntensity: 0.03,
      gridSize: 8,
      gridThickness: 12,
      opacity: 0.6
    },
    rainbow: {
      enableRainbow: true,
      gridColor: '#ffffff',
      rippleIntensity: 0.1,
      gridSize: 15,
      gridThickness: 25,
      opacity: 1.0
    }
  };

  const applyPreset = (presetName: keyof typeof presets) => {
    setConfig(prev => ({ ...prev, ...presets[presetName] }));
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Fixed RippleGrid Background */}
      <div className="fixed inset-0 z-0">
        <RippleGridV2
          enableRainbow={config.enableRainbow}
          gridColor={config.gridColor}
          rippleIntensity={config.rippleIntensity}
          gridSize={config.gridSize}
          gridThickness={config.gridThickness}
          fadeDistance={config.fadeDistance}
          vignetteStrength={config.vignetteStrength}
          glowIntensity={config.glowIntensity}
          opacity={config.opacity}
          gridRotation={config.gridRotation}
          mouseInteraction={config.mouseInteraction}
          mouseInteractionRadius={config.mouseInteractionRadius}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-green-400 font-mono mb-8 text-center">
            RippleGrid Test Page
          </h1>

          {/* Preset Buttons */}
          <Card variant="matrix" className="mb-8">
            <CardHeader>
              <CardTitle className="text-green-400 font-mono">Presets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="matrix"
                  onClick={() => applyPreset('matrix')}
                  className="w-full"
                >
                  Matrix
                </Button>
                <Button
                  variant="outline"
                  onClick={() => applyPreset('cyberpunk')}
                  className="w-full border-pink-500 text-pink-400 hover:bg-pink-500/10"
                >
                  Cyberpunk
                </Button>
                <Button
                  variant="outline"
                  onClick={() => applyPreset('terminal')}
                  className="w-full border-green-500 text-green-400 hover:bg-green-500/10"
                >
                  Terminal
                </Button>
                <Button
                  variant="outline"
                  onClick={() => applyPreset('rainbow')}
                  className="w-full border-yellow-500 text-yellow-400 hover:bg-yellow-500/10"
                >
                  Rainbow
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Configuration Controls */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Basic Settings */}
            <Card variant="matrix">
              <CardHeader>
                <CardTitle className="text-green-400 font-mono">Basic Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-mono text-green-300 mb-2">
                    Grid Color: {config.gridColor}
                  </label>
                  <input
                    type="color"
                    value={config.gridColor}
                    onChange={(e) => setConfig(prev => ({ ...prev, gridColor: e.target.value }))}
                    className="w-full h-10 rounded border border-green-500/50 bg-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-mono text-green-300 mb-2">
                    Opacity: {config.opacity.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={config.opacity}
                    onChange={(e) => setConfig(prev => ({ ...prev, opacity: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-mono text-green-300 mb-2">
                    Ripple Intensity: {config.rippleIntensity.toFixed(3)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="0.2"
                    step="0.001"
                    value={config.rippleIntensity}
                    onChange={(e) => setConfig(prev => ({ ...prev, rippleIntensity: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-mono text-green-300 mb-2">
                    Grid Size: {config.gridSize}
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="20"
                    step="1"
                    value={config.gridSize}
                    onChange={(e) => setConfig(prev => ({ ...prev, gridSize: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-mono text-green-300 mb-2">
                    Grid Thickness: {config.gridThickness}
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="1"
                    value={config.gridThickness}
                    onChange={(e) => setConfig(prev => ({ ...prev, gridThickness: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Advanced Settings */}
            <Card variant="matrix">
              <CardHeader>
                <CardTitle className="text-green-400 font-mono">Advanced Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-mono text-green-300 mb-2">
                    Fade Distance: {config.fadeDistance.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={config.fadeDistance}
                    onChange={(e) => setConfig(prev => ({ ...prev, fadeDistance: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-mono text-green-300 mb-2">
                    Vignette Strength: {config.vignetteStrength.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.1"
                    value={config.vignetteStrength}
                    onChange={(e) => setConfig(prev => ({ ...prev, vignetteStrength: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-mono text-green-300 mb-2">
                    Glow Intensity: {config.glowIntensity.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="0.5"
                    step="0.01"
                    value={config.glowIntensity}
                    onChange={(e) => setConfig(prev => ({ ...prev, glowIntensity: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-mono text-green-300 mb-2">
                    Grid Rotation: {config.gridRotation}°
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="1"
                    value={config.gridRotation}
                    onChange={(e) => setConfig(prev => ({ ...prev, gridRotation: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-mono text-green-300 mb-2">
                    Mouse Interaction Radius: {config.mouseInteractionRadius.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={config.mouseInteractionRadius}
                    onChange={(e) => setConfig(prev => ({ ...prev, mouseInteractionRadius: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={config.enableRainbow}
                      onChange={(e) => setConfig(prev => ({ ...prev, enableRainbow: e.target.checked }))}
                      className="rounded border-green-500 bg-black text-green-400"
                    />
                    <span className="text-sm font-mono text-green-300">Enable Rainbow</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={config.mouseInteraction}
                      onChange={(e) => setConfig(prev => ({ ...prev, mouseInteraction: e.target.checked }))}
                      className="rounded border-green-500 bg-black text-green-400"
                    />
                    <span className="text-sm font-mono text-green-300">Mouse Interaction</span>
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Configuration Display */}
          <Card variant="matrix" className="mt-8">
            <CardHeader>
              <CardTitle className="text-green-400 font-mono">Current Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs font-mono text-gray-300 overflow-x-auto">
{`<RippleGridV2
  enableRainbow={${config.enableRainbow}}
  gridColor="${config.gridColor}"
  rippleIntensity={${config.rippleIntensity}}
  gridSize={${config.gridSize}}
  gridThickness={${config.gridThickness}}
  fadeDistance={${config.fadeDistance}}
  vignetteStrength={${config.vignetteStrength}}
  glowIntensity={${config.glowIntensity}}
  opacity={${config.opacity}}
  gridRotation={${config.gridRotation}}
  mouseInteraction={${config.mouseInteraction}}
  mouseInteractionRadius={${config.mouseInteractionRadius}}
/>`}
              </pre>
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <Button variant="matrix" size="lg" onClick={() => window.location.href = '/'}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
