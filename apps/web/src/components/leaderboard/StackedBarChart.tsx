'use client';

import React from 'react';
import { User } from '../../lib/auth/types';
import { Card, CardContent, CardHeader, CardTitle } from '../../lib/ui/card';
import { Trophy, Crown, Medal, Award, Zap } from 'lucide-react';

interface StackedBarChartProps {
  users: User[];
  currentUser?: User | null;
}

export const StackedBarChart: React.FC<StackedBarChartProps> = ({ users, currentUser }) => {
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);
  const maxPoints = Math.max(...users.map(u => u.points));
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="h-5 w-5 text-yellow-400" />;
    if (index === 1) return <Medal className="h-5 w-5 text-gray-400" />;
    if (index === 2) return <Medal className="h-5 w-5 text-amber-600" />;
    return <Trophy className="h-4 w-4 text-purple-400" />;
  };

  const getBarColor = (index: number) => {
    if (index === 0) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
    if (index === 1) return 'bg-gradient-to-r from-gray-300 to-gray-500';
    if (index === 2) return 'bg-gradient-to-r from-amber-500 to-amber-700';
    if (index % 3 === 0) return 'bg-gradient-to-r from-purple-500 to-purple-700';
    if (index % 3 === 1) return 'bg-gradient-to-r from-red-500 to-red-700';
    return 'bg-gradient-to-r from-green-500 to-green-700';
  };

  const getGlowColor = (index: number) => {
    if (index === 0) return 'shadow-yellow-400/50';
    if (index === 1) return 'shadow-gray-400/50';
    if (index === 2) return 'shadow-amber-500/50';
    if (index % 3 === 0) return 'shadow-purple-500/50';
    if (index % 3 === 1) return 'shadow-red-500/50';
    return 'shadow-green-500/50';
  };

  return (
    <Card variant="matrix" className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-purple-400 font-mono flex items-center neon-glow-purple">
          <Trophy className="h-6 w-6 mr-3" />
          Live Leaderboard
          <span className="ml-auto text-sm text-gray-400 font-normal">
            {users.length} Players
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedUsers.map((user, index) => {
          const isCurrentUser = currentUser && user.id === currentUser.id;
          const percentage = (user.points / maxPoints) * 100;
          
          return (
            <div
              key={user.id}
              className={`relative group transition-all duration-300 ${
                isCurrentUser 
                  ? 'bg-purple-500/10 border border-purple-500/50 rounded-lg p-3' 
                  : 'hover:bg-gray-800/30 rounded-lg p-2'
              }`}
            >
              {/* User Info */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {getRankIcon(index)}
                    <span className="text-sm font-mono text-gray-400">#{index + 1}</span>
                  </div>
                  
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {getInitials(user.name)}
                  </div>
                  
                  <div>
                    <h3 className={`font-mono font-bold ${
                      isCurrentUser ? 'text-purple-400 neon-glow-purple' : 'text-white'
                    }`}>
                      {user.name}
                    </h3>
                    <p className="text-xs text-gray-400 font-mono">
                      Level {user.level} • {user.completedActivities.length} completed
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-2xl font-bold font-mono ${
                    isCurrentUser ? 'text-purple-400 neon-glow-purple' : 'text-green-400'
                  }`}>
                    {user.points.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400 font-mono">points</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="relative">
                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full ${getBarColor(index)} transition-all duration-1000 ease-out relative`}
                    style={{ width: `${percentage}%` }}
                  >
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  </div>
                </div>
                
                {/* Glow effect */}
                <div 
                  className={`absolute inset-0 rounded-full shadow-lg ${getGlowColor(index)}`}
                  style={{ 
                    width: `${percentage}%`,
                    boxShadow: `0 0 20px currentColor`
                  }}
                />
                
                {/* Percentage label */}
                <div className="absolute right-0 top-0 -mt-6 text-xs font-mono text-gray-400">
                  {percentage.toFixed(1)}%
                </div>
              </div>
              
              {/* Hover effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
            </div>
          );
        })}
        
        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-center space-x-6 text-xs font-mono text-gray-400">
            <div className="flex items-center space-x-2">
              <Crown className="h-4 w-4 text-yellow-400" />
              <span>1st Place</span>
            </div>
            <div className="flex items-center space-x-2">
              <Medal className="h-4 w-4 text-gray-400" />
              <span>2nd Place</span>
            </div>
            <div className="flex items-center space-x-2">
              <Medal className="h-4 w-4 text-amber-600" />
              <span>3rd Place</span>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="h-4 w-4 text-purple-400" />
              <span>Others</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
