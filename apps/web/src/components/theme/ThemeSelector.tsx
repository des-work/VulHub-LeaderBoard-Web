'use client';

import React, { useState } from 'react';
import { appThemes, getThemeById, applyTheme, loadGoogleFonts } from '../../lib/theme/theme-manager';
import { Button } from '../../lib/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../lib/ui/card';
import { Palette, Type, Eye, Settings, Check } from 'lucide-react';

interface ThemeSelectorProps {
  currentThemeId: string;
  onThemeChange: (themeId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentThemeId,
  onThemeChange,
  isOpen,
  onToggle
}) => {
  const [previewTheme, setPreviewTheme] = useState<string | null>(null);

  const handleThemeSelect = (themeId: string) => {
    const theme = getThemeById(themeId);
    if (!theme) return;

    // Apply theme immediately
    applyTheme(theme);
    loadGoogleFonts(theme);
    onThemeChange(themeId);
  };

  const handlePreview = (themeId: string) => {
    const theme = getThemeById(themeId);
    if (!theme) return;

    setPreviewTheme(themeId);
    applyTheme(theme);
    loadGoogleFonts(theme);
  };

  const handlePreviewEnd = () => {
    if (previewTheme) {
      // Restore original theme
      const originalTheme = getThemeById(currentThemeId);
      if (originalTheme) {
        applyTheme(originalTheme);
        loadGoogleFonts(originalTheme);
      }
      setPreviewTheme(null);
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        onClick={onToggle}
        className="fixed top-20 left-4 z-40 border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
      >
        <Palette className="h-4 w-4 mr-2" />
        Themes
      </Button>
    );
  }

  return (
    <Card variant="matrix" className="fixed top-20 left-4 z-40 w-96 max-h-[80vh] overflow-y-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-mono text-green-400 flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Theme Selector
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onToggle}
            className="border-gray-500/50 text-gray-400 hover:bg-gray-500/10"
          >
            ×
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {appThemes.map((theme) => (
          <div
            key={theme.id}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              currentThemeId === theme.id
                ? 'border-green-500 bg-green-500/10'
                : 'border-gray-600 hover:border-purple-500/50'
            }`}
            onClick={() => handleThemeSelect(theme.id)}
            onMouseEnter={() => handlePreview(theme.id)}
            onMouseLeave={handlePreviewEnd}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-green-400 font-mono">
                  {theme.name}
                </h3>
                <p className="text-sm text-gray-400 font-mono">
                  {theme.description}
                </p>
              </div>
              {currentThemeId === theme.id && (
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
            </div>

            {/* Color Preview */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: theme.colorTheme.palette.primary[500] }} />
                <span className="text-xs font-mono text-gray-400">Primary</span>
                <div className="w-4 h-4 rounded" style={{ backgroundColor: theme.colorTheme.palette.secondary[500] }} />
                <span className="text-xs font-mono text-gray-400">Secondary</span>
                <div className="w-4 h-4 rounded" style={{ backgroundColor: theme.colorTheme.palette.accent[500] }} />
                <span className="text-xs font-mono text-gray-400">Accent</span>
              </div>
            </div>

            {/* Font Preview */}
            <div className="mt-3 space-y-1">
              <div className="text-sm font-mono" style={{ fontFamily: theme.fontTheme.primary.cssFamily }}>
                {theme.fontTheme.primary.displayName} - Primary
              </div>
              <div className="text-xs font-mono" style={{ fontFamily: theme.fontTheme.secondary.cssFamily }}>
                {theme.fontTheme.secondary.displayName} - Secondary
              </div>
              <div className="text-xs font-mono" style={{ fontFamily: theme.fontTheme.accent.cssFamily }}>
                {theme.fontTheme.accent.displayName} - Accent
              </div>
            </div>

            {/* Theme Characteristics */}
            <div className="mt-3 flex flex-wrap gap-1">
              {theme.fontTheme.primary.characteristics.dramatic && (
                <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded font-mono">
                  Dramatic
                </span>
              )}
              {theme.fontTheme.primary.characteristics.futuristic && (
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded font-mono">
                  Futuristic
                </span>
              )}
              {theme.fontTheme.primary.characteristics.technical && (
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded font-mono">
                  Technical
                </span>
              )}
            </div>
          </div>
        ))}

        {/* Quick Actions */}
        <div className="pt-4 border-t border-gray-600">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const randomTheme = appThemes[Math.floor(Math.random() * appThemes.length)];
                handleThemeSelect(randomTheme.id);
              }}
              className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 text-xs"
            >
              <Eye className="h-3 w-3 mr-1" />
              Random
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const cyberpunkTheme = appThemes.find(t => t.id === 'cyberpunk');
                if (cyberpunkTheme) handleThemeSelect(cyberpunkTheme.id);
              }}
              className="border-red-500/50 text-red-400 hover:bg-red-500/10 text-xs"
            >
              <Settings className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </div>
        </div>

        {/* Current Theme Info */}
        <div className="pt-4 border-t border-gray-600">
          <h4 className="text-sm font-mono text-gray-400 mb-2">Current Theme</h4>
          <div className="text-xs font-mono text-gray-300">
            <div>Font: {appThemes.find(t => t.id === currentThemeId)?.fontTheme.primary.displayName}</div>
            <div>Colors: {appThemes.find(t => t.id === currentThemeId)?.colorTheme.name}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
