'use client';

import React from 'react';
import { User } from '../../lib/auth/types';
import { LeaderboardConfig } from './LeaderboardConfig';
import { Card, CardContent } from '../../lib/ui/card';
import { Trophy, Crown, Medal, Award, Clock, Target, CheckCircle } from 'lucide-react';

interface LeaderboardDisplayProps {
  users: User[];
  config: LeaderboardConfig;
  currentUserId?: string;
}

export const LeaderboardDisplay: React.FC<LeaderboardDisplayProps> = ({
  users,
  config,
  currentUserId,
}) => {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-amber-600" />;
    return <span className="text-gray-400 font-mono text-lg font-bold">#{rank}</span>;
  };

  const getLevelColor = (level: number) => {
    if (level >= 10) return 'text-purple-400';
    if (level >= 5) return 'text-blue-400';
    if (level >= 3) return 'text-green-400';
    return 'text-yellow-400';
  };

  const getProgressPercentage = (user: User) => {
    // Calculate progress based on points (simplified)
    const maxPoints = 5000; // Adjust based on your system
    return Math.min((user.points / maxPoints) * 100, 100);
  };

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const renderUserCard = (user: User, rank: number) => {
    const isCurrentUser = currentUserId === user.id;
    const progressPercentage = getProgressPercentage(user);

    if (config.displayMode === 'progress') {
      return (
        <Card
          key={user.id}
          variant={isCurrentUser ? 'matrix' : 'default'}
          className={`p-4 ${isCurrentUser ? 'ring-2 ring-green-400' : ''}`}
        >
          <CardContent className="p-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 font-mono font-bold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-green-400 font-mono font-bold">
                    {user.name}
                    {isCurrentUser && <span className="text-xs ml-2">(You)</span>}
                  </h3>
                  <p className="text-gray-400 font-mono text-sm">
                    Level {user.level} • {user.points} points
                  </p>
                </div>
              </div>
              {config.showPoints && (
                <div className="text-right">
                  <div className="text-2xl font-mono font-bold text-green-400">
                    {user.points.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400 font-mono">points</div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-gray-400">
                <span>Progress</span>
                <span>{progressPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {config.showSubmissionCount && (
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-700">
                <div className="flex items-center space-x-4 text-xs font-mono text-gray-400">
                  <span>{user.completedActivities.length} completed</span>
                  <span>{user.pendingSubmissions.length} pending</span>
                </div>
                {config.showLastActive && (
                  <div className="flex items-center space-x-1 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    <span>{formatLastActive(user.lastActive)}</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      );
    }

    if (config.displayMode === 'list') {
      return (
        <div
          key={user.id}
          className={`flex items-center justify-between p-4 rounded-lg border ${
            isCurrentUser
              ? 'border-green-500 bg-green-500/10'
              : 'border-gray-600 bg-gray-800/30'
          }`}
        >
          <div className="flex items-center space-x-4">
            {config.showRank && (
              <div className="flex items-center justify-center w-8">
                {getRankIcon(rank)}
              </div>
            )}
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 font-mono font-bold">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="text-green-400 font-mono font-bold">
                {user.name}
                {isCurrentUser && <span className="text-xs ml-2">(You)</span>}
              </h3>
              {config.showLevel && (
                <p className={`font-mono text-sm ${getLevelColor(user.level)}`}>
                  Level {user.level}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {config.showPoints && (
              <div className="text-right">
                <div className="text-xl font-mono font-bold text-green-400">
                  {user.points.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400 font-mono">points</div>
              </div>
            )}
            {config.showLastActive && (
              <div className="flex items-center space-x-1 text-xs text-gray-400">
                <Clock className="h-3 w-3" />
                <span>{formatLastActive(user.lastActive)}</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Grid mode (default)
    return (
      <Card
        key={user.id}
        variant={isCurrentUser ? 'matrix' : 'default'}
        className={`p-6 ${isCurrentUser ? 'ring-2 ring-green-400' : ''}`}
      >
        <CardContent className="p-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {config.showRank && (
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(rank)}
                </div>
              )}
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 font-mono font-bold text-lg">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
            {config.showAchievements && (
              <div className="flex space-x-1">
                {user.completedActivities.length > 0 && (
                  <Award className="h-4 w-4 text-yellow-400" />
                )}
                {user.pendingSubmissions.length > 0 && (
                  <Target className="h-4 w-4 text-blue-400" />
                )}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="text-green-400 font-mono font-bold text-lg">
                {user.name}
                {isCurrentUser && <span className="text-sm ml-2">(You)</span>}
              </h3>
              {config.showLevel && (
                <p className={`font-mono text-sm ${getLevelColor(user.level)}`}>
                  Level {user.level}
                </p>
              )}
            </div>

            {config.showPoints && (
              <div className="text-center">
                <div className="text-3xl font-mono font-bold text-green-400">
                  {user.points.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400 font-mono">points</div>
              </div>
            )}

            {config.showProgress && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-gray-400">
                  <span>Progress</span>
                  <span>{progressPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between items-center text-xs font-mono text-gray-400">
              {config.showSubmissionCount && (
                <div className="flex space-x-3">
                  <span>{user.completedActivities.length} completed</span>
                  <span>{user.pendingSubmissions.length} pending</span>
                </div>
              )}
              {config.showLastActive && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatLastActive(user.lastActive)}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const sortedUsers = [...users]
    .filter(user => !config.showOnlyActive || user.lastActive > new Date(Date.now() - 24 * 60 * 60 * 1000))
    .sort((a, b) => {
      let comparison = 0;
      switch (config.sortBy) {
        case 'points':
          comparison = a.points - b.points;
          break;
        case 'level':
          comparison = a.level - b.level;
          break;
        case 'lastActive':
          comparison = a.lastActive.getTime() - b.lastActive.getTime();
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
      }
      return config.sortOrder === 'desc' ? -comparison : comparison;
    })
    .slice(0, config.maxItems);

  if (config.displayMode === 'progress') {
    return (
      <div className="space-y-4">
        {sortedUsers.map((user, index) => renderUserCard(user, index + 1))}
      </div>
    );
  }

  if (config.displayMode === 'list') {
    return (
      <div className="space-y-3">
        {sortedUsers.map((user, index) => renderUserCard(user, index + 1))}
      </div>
    );
  }

  // Grid mode
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedUsers.map((user, index) => renderUserCard(user, index + 1))}
    </div>
  );
};
