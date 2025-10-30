'use client';

import React from 'react';
import { useEnhancedTheme } from '../../lib/theme/enhanced-context';
import { ThemeSelector } from '../../components/theme/ThemeSelector';
import { Button } from '../../lib/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../lib/ui/card';
import { Palette, Type, Zap, Star, Crown } from 'lucide-react';

export default function ThemeTestPage() {
  const { currentTheme, setTheme, isThemeSelectorOpen, toggleThemeSelector } = useEnhancedTheme();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Theme Selector */}
      <ThemeSelector
        currentThemeId={currentTheme.id}
        onThemeChange={setTheme}
        isOpen={isThemeSelectorOpen}
        onToggle={toggleThemeSelector}
      />

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 
            className="text-6xl font-bold"
            style={{ 
              fontFamily: `var(--font-primary)`,
              color: `rgb(var(--color-primary-500))`,
              textShadow: `0 0 20px rgb(var(--color-primary-500) / 0.5)`
            }}
          >
            Theme Showcase
          </h1>
          <p 
            className="text-xl"
            style={{ 
              fontFamily: `var(--font-secondary)`,
              color: `rgb(var(--color-secondary-500))`
            }}
          >
            Experience the power of dramatic fonts and vibrant colors
          </p>
        </div>

        {/* Current Theme Info */}
        <Card variant="matrix" className="p-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="h-6 w-6" />
              <span>Current Theme: {currentTheme.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400 mb-4">{currentTheme.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: `rgb(var(--color-primary-500))` }}
                />
                <p className="text-xs font-mono">Primary</p>
              </div>
              <div className="text-center">
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: `rgb(var(--color-secondary-500))` }}
                />
                <p className="text-xs font-mono">Secondary</p>
              </div>
              <div className="text-center">
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: `rgb(var(--color-accent-500))` }}
                />
                <p className="text-xs font-mono">Accent</p>
              </div>
              <div className="text-center">
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-2 border-2"
                  style={{ 
                    backgroundColor: `rgb(var(--color-neutral-800))`,
                    borderColor: `rgb(var(--color-primary-500))`
                  }}
                />
                <p className="text-xs font-mono">Background</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Font Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="matrix" className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Type className="h-6 w-6" />
                <span>Font Showcase</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 
                  className="text-2xl font-bold mb-2"
                  style={{ 
                    fontFamily: `var(--font-primary)`,
                    color: `rgb(var(--color-primary-500))`
                  }}
                >
                  Primary Font
                </h3>
                <p 
                  className="text-sm"
                  style={{ fontFamily: `var(--font-primary)` }}
                >
                  {currentTheme.fontTheme.primary.displayName} - {currentTheme.fontTheme.primary.description}
                </p>
              </div>
              
              <div>
                <h3 
                  className="text-xl font-bold mb-2"
                  style={{ 
                    fontFamily: `var(--font-secondary)`,
                    color: `rgb(var(--color-secondary-500))`
                  }}
                >
                  Secondary Font
                </h3>
                <p 
                  className="text-sm"
                  style={{ fontFamily: `var(--font-secondary)` }}
                >
                  {currentTheme.fontTheme.secondary.displayName} - {currentTheme.fontTheme.secondary.description}
                </p>
              </div>
              
              <div>
                <h3 
                  className="text-lg font-bold mb-2"
                  style={{ 
                    fontFamily: `var(--font-accent)`,
                    color: `rgb(var(--color-accent-500))`
                  }}
                >
                  Accent Font
                </h3>
                <p 
                  className="text-sm"
                  style={{ fontFamily: `var(--font-accent)` }}
                >
                  {currentTheme.fontTheme.accent.displayName} - {currentTheme.fontTheme.accent.description}
                </p>
              </div>
              
              <div>
                <h3 
                  className="text-base font-bold mb-2"
                  style={{ 
                    fontFamily: `var(--font-mono)`,
                    color: `rgb(var(--color-primary-500))`
                  }}
                >
                  Monospace Font
                </h3>
                <p 
                  className="text-sm"
                  style={{ fontFamily: `var(--font-mono)` }}
                >
                  {currentTheme.fontTheme.mono.displayName} - {currentTheme.fontTheme.mono.description}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card variant="matrix" className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-6 w-6" />
                <span>Typography Examples</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h1 
                  className="text-4xl font-bold mb-2"
                  style={{ 
                    fontFamily: `var(--font-primary)`,
                    color: `rgb(var(--color-primary-500))`,
                    textShadow: `0 0 10px rgb(var(--color-primary-500) / 0.5)`
                  }}
                >
                  H1 Heading
                </h1>
                <h2 
                  className="text-3xl font-bold mb-2"
                  style={{ 
                    fontFamily: `var(--font-secondary)`,
                    color: `rgb(var(--color-secondary-500))`
                  }}
                >
                  H2 Heading
                </h2>
                <h3 
                  className="text-2xl font-bold mb-2"
                  style={{ 
                    fontFamily: `var(--font-accent)`,
                    color: `rgb(var(--color-accent-500))`
                  }}
                >
                  H3 Heading
                </h3>
                <p 
                  className="text-base"
                  style={{ 
                    fontFamily: `var(--font-mono)`,
                    color: `rgb(var(--color-text-primary))`
                  }}
                >
                  This is a paragraph with monospace font. Perfect for code and technical content.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Button Showcase */}
        <Card variant="matrix" className="p-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-6 w-6" />
              <span>Interactive Elements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="matrix" 
                className="w-full"
                style={{ 
                  fontFamily: `var(--font-primary)`,
                  backgroundColor: `rgb(var(--color-primary-500))`,
                  color: `rgb(var(--color-text-inverse))`
                }}
              >
                Primary Button
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                style={{ 
                  fontFamily: `var(--font-secondary)`,
                  borderColor: `rgb(var(--color-secondary-500))`,
                  color: `rgb(var(--color-secondary-500))`
                }}
              >
                Secondary Button
              </Button>
              <Button 
                variant="ghost" 
                className="w-full"
                style={{ 
                  fontFamily: `var(--font-accent)`,
                  color: `rgb(var(--color-accent-500))`
                }}
              >
                Accent Button
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                style={{ 
                  fontFamily: `var(--font-mono)`,
                  borderColor: `rgb(var(--color-primary-500))`,
                  color: `rgb(var(--color-primary-500))`
                }}
              >
                Mono Button
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Theme Toggle Button */}
        <div className="text-center">
          <Button
            variant="matrix"
            onClick={toggleThemeSelector}
            className="px-8 py-3 text-lg"
            style={{ 
              fontFamily: `var(--font-primary)`,
              backgroundColor: `rgb(var(--color-primary-500))`,
              color: `rgb(var(--color-text-inverse))`,
              boxShadow: `0 0 20px rgb(var(--color-primary-500) / 0.5)`
            }}
          >
            <Palette className="h-5 w-5 mr-2" />
            Change Theme
          </Button>
        </div>
      </div>
    </div>
  );
}
