'use client';

import React, { useState, useEffect } from 'react';
import { User } from '../../lib/auth/types';
import { LeaderboardConfig, defaultLeaderboardConfig, leaderboardPresets } from './LeaderboardConfig';
import { LeaderboardDisplay } from './LeaderboardDisplay';
import { StackedBarChart } from './StackedBarChart';
import { LeaderboardConfigPanel } from './LeaderboardConfigPanel';
import { Card, CardContent, CardHeader, CardTitle } from '../../lib/ui/card';
import { Button } from '../../lib/ui/button';
import { Trophy, RefreshCw, Settings, BarChart3, List, Eye } from 'lucide-react';

interface LeaderboardProps {
  users: User[];
  currentUserId?: string;
  onRefresh?: () => void;
  isLoading?: boolean;
  title?: string;
  showConfig?: boolean;
  initialConfig?: Partial<LeaderboardConfig>;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  users,
  currentUserId,
  onRefresh,
  isLoading = false,
  title = 'Live Rankings',
  showConfig = true,
  initialConfig = {},
}) => {
  const [config, setConfig] = useState<LeaderboardConfig>({
    ...defaultLeaderboardConfig,
    displayMode: 'progress', // Default to stacked bar chart
    ...initialConfig,
  });
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (onRefresh) {
        onRefresh();
        setLastUpdated(new Date());
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [onRefresh]);

  const handleConfigChange = (newConfig: LeaderboardConfig) => {
    setConfig(newConfig);
  };

  const handlePresetApply = (preset: LeaderboardConfig) => {
    setConfig(preset);
  };

  const handleReset = () => {
    setConfig(defaultLeaderboardConfig);
  };

  const getDisplayModeIcon = () => {
    switch (config.displayMode) {
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

  const formatLastUpdated = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="matrix">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Trophy className="h-6 w-6 text-green-400" />
              <div>
                <CardTitle className="text-2xl font-mono text-green-400">
                  {title}
                </CardTitle>
                <div className="flex items-center space-x-4 text-sm font-mono text-gray-400">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>Live</span>
                  </div>
                  <span>•</span>
                  <span>{users.length} students</span>
                  <span>•</span>
                  <span>Updated {formatLastUpdated(lastUpdated)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {showConfig && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsConfigOpen(!isConfigOpen)}
                  className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isLoading}
                className="border-green-500/50 text-green-400 hover:bg-green-500/10"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Configuration Panel */}
      {showConfig && (
        <LeaderboardConfigPanel
          config={config}
          onConfigChange={handleConfigChange}
          onPresetApply={handlePresetApply}
          onReset={handleReset}
          isOpen={isConfigOpen}
          onToggle={() => setIsConfigOpen(!isConfigOpen)}
        />
      )}

      {/* Display Mode Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm font-mono text-gray-400">
          {getDisplayModeIcon()}
          <span>Display: {config.displayMode}</span>
          <span>•</span>
          <span>Sort: {config.sortBy} ({config.sortOrder})</span>
          <span>•</span>
          <span>Showing {Math.min(users.length, config.maxItems)} of {users.length}</span>
        </div>
        
        {config.groupByLevel && (
          <div className="text-sm font-mono text-gray-400">
            Grouped by level
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <Card variant="matrix">
          <CardContent className="p-12 text-center">
            <div className="flex items-center justify-center space-x-3 text-green-400 font-mono">
              <RefreshCw className="h-6 w-6 animate-spin" />
              <span>Loading leaderboard...</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Leaderboard Display */
        config.displayMode === 'progress' ? (
          <StackedBarChart
            users={users}
            currentUser={users.find(user => user.id === currentUserId)}
          />
        ) : (
          <LeaderboardDisplay
            users={users}
            config={config}
            currentUserId={currentUserId}
          />
        )
      )}

      {/* Empty State */}
      {!isLoading && users.length === 0 && (
        <Card variant="matrix">
          <CardContent className="p-12 text-center">
            <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-mono text-gray-400 mb-2">
              No students found
            </h3>
            <p className="text-gray-500 font-mono text-sm">
              No students match your current filter criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
