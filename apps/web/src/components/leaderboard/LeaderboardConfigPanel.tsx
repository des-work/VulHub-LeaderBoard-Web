'use client';

import React from 'react';
import { LeaderboardConfig, leaderboardPresets } from './LeaderboardConfig';
import { Button } from '../../lib/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../lib/ui/card';
import { Settings, RotateCcw, Eye, List, BarChart3 } from 'lucide-react';

interface LeaderboardConfigPanelProps {
  config: LeaderboardConfig;
  onConfigChange: (config: LeaderboardConfig) => void;
  onPresetApply: (preset: LeaderboardConfig) => void;
  onReset: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const LeaderboardConfigPanel: React.FC<LeaderboardConfigPanelProps> = ({
  config,
  onConfigChange,
  onPresetApply,
  onReset,
  isOpen,
  onToggle,
}) => {
  const handleConfigChange = (key: keyof LeaderboardConfig, value: any) => {
    onConfigChange({ ...config, [key]: value });
  };

  const getDisplayModeIcon = (mode: string) => {
    switch (mode) {
      case 'grid':
        return <Eye className="h-4 w-4" />;
      case 'list':
        return <List className="h-4 w-4" />;
      case 'progress':
        return <BarChart3 className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        onClick={onToggle}
        className="fixed top-20 right-4 z-40 border-green-500/50 text-green-400 hover:bg-green-500/10"
      >
        <Settings className="h-4 w-4 mr-2" />
        Configure
      </Button>
    );
  }

  return (
    <Card variant="matrix" className="fixed top-20 right-4 z-40 w-80 max-h-[80vh] overflow-y-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-mono text-green-400 flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Leaderboard Config
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="border-gray-500/50 text-gray-400 hover:bg-gray-500/10"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onToggle}
              className="border-gray-500/50 text-gray-400 hover:bg-gray-500/10"
            >
              ×
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Presets */}
        <div>
          <h3 className="text-green-400 font-mono font-bold mb-3">Quick Presets</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(leaderboardPresets).map(([name, preset]) => (
              <Button
                key={name}
                variant="outline"
                size="sm"
                onClick={() => onPresetApply(preset)}
                className="border-green-500/50 text-green-400 hover:bg-green-500/10 text-xs"
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Display Mode */}
        <div>
          <h3 className="text-green-400 font-mono font-bold mb-3">Display Mode</h3>
          <div className="grid grid-cols-3 gap-2">
            {(['grid', 'list', 'progress'] as const).map((mode) => (
              <Button
                key={mode}
                variant={config.displayMode === mode ? 'matrix' : 'outline'}
                size="sm"
                onClick={() => handleConfigChange('displayMode', mode)}
                className="text-xs"
              >
                {getDisplayModeIcon(mode)}
                <span className="ml-1">{mode}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Display Options */}
        <div>
          <h3 className="text-green-400 font-mono font-bold mb-3">Display Options</h3>
          <div className="space-y-3">
            {[
              { key: 'showRank' as const, label: 'Show Rank' },
              { key: 'showPoints' as const, label: 'Show Points' },
              { key: 'showLevel' as const, label: 'Show Level' },
              { key: 'showLastActive' as const, label: 'Show Last Active' },
              { key: 'showProgress' as const, label: 'Show Progress' },
              { key: 'showAchievements' as const, label: 'Show Achievements' },
              { key: 'showSubmissionCount' as const, label: 'Show Submission Count' },
              { key: 'showCompletionRate' as const, label: 'Show Completion Rate' },
              { key: 'showOnlyActive' as const, label: 'Show Only Active Users' },
              { key: 'groupByLevel' as const, label: 'Group By Level' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config[key]}
                  onChange={(e) => handleConfigChange(key, e.target.checked)}
                  className="rounded border-green-500 bg-black text-green-400 focus:ring-green-400"
                />
                <span className="text-gray-300 font-mono text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sorting */}
        <div>
          <h3 className="text-green-400 font-mono font-bold mb-3">Sorting</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-gray-300 font-mono text-sm mb-2">Sort By</label>
              <select
                value={config.sortBy}
                onChange={(e) => handleConfigChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 bg-black/50 border border-green-500/30 rounded text-green-400 font-mono text-sm focus:border-green-400 focus:outline-none"
              >
                <option value="points">Points</option>
                <option value="level">Level</option>
                <option value="lastActive">Last Active</option>
                <option value="name">Name</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 font-mono text-sm mb-2">Order</label>
              <select
                value={config.sortOrder}
                onChange={(e) => handleConfigChange('sortOrder', e.target.value)}
                className="w-full px-3 py-2 bg-black/50 border border-green-500/30 rounded text-green-400 font-mono text-sm focus:border-green-400 focus:outline-none"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Max Items */}
        <div>
          <h3 className="text-green-400 font-mono font-bold mb-3">Max Items</h3>
          <input
            type="range"
            min="3"
            max="50"
            value={config.maxItems}
            onChange={(e) => handleConfigChange('maxItems', parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs font-mono text-gray-400 mt-1">
            <span>3</span>
            <span className="text-green-400">{config.maxItems}</span>
            <span>50</span>
          </div>
        </div>

        {/* Current Config Display */}
        <div className="pt-4 border-t border-green-500/30">
          <h3 className="text-green-400 font-mono font-bold mb-3">Current Config</h3>
          <pre className="text-xs font-mono text-gray-300 bg-black/50 p-3 rounded overflow-x-auto">
{JSON.stringify(config, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};
