'use client';

import React, { useEffect, useRef, useState } from 'react';
import { User } from '../../lib/auth/types';
import { Card, CardContent, CardHeader, CardTitle } from '../../lib/ui/card';
import { BarChart3, Crown, Medal, Trophy, Zap, Star, Flame, Target } from 'lucide-react';
import { leaderboardAnimationManager } from '../../lib/animations/leaderboard-animations';

interface SpectacularLeaderboardProps {
  users: User[];
  currentUser?: User | null;
  title?: string;
  showLiveIndicator?: boolean;
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="h-6 w-6 text-yellow-400" />;
  if (rank === 2) return <Medal className="h-6 w-6 text-gray-300" />;
  if (rank === 3) return <Medal className="h-6 w-6 text-amber-600" />;
  return <Trophy className="h-5 w-5 text-purple-500" />;
};

const getRankColor = (rank: number) => {
  if (rank === 1) return 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30';
  if (rank === 2) return 'from-gray-500/20 to-gray-600/10 border-gray-500/30';
  if (rank === 3) return 'from-amber-500/20 to-amber-600/10 border-amber-500/30';
  return 'from-purple-500/20 to-purple-600/10 border-purple-500/30';
};

const getProgressColor = (rank: number) => {
  if (rank === 1) return 'from-yellow-400 via-yellow-500 to-green-400';
  if (rank === 2) return 'from-gray-300 via-gray-400 to-blue-400';
  if (rank === 3) return 'from-amber-400 via-orange-500 to-red-400';
  return 'from-purple-400 via-pink-500 to-purple-600';
};

const getAvatarColor = (rank: number) => {
  if (rank === 1) return 'bg-gradient-to-br from-yellow-400 to-yellow-600';
  if (rank === 2) return 'bg-gradient-to-br from-gray-300 to-gray-500';
  if (rank === 3) return 'bg-gradient-to-br from-amber-400 to-orange-500';
  return 'bg-gradient-to-br from-purple-400 to-pink-500';
};

export const SpectacularLeaderboard: React.FC<SpectacularLeaderboardProps> = ({ 
  users, 
  currentUser, 
  title = 'Live Leaderboard',
  showLiveIndicator = true 
}) => {
  const [sortedUsers, setSortedUsers] = useState<User[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const entryRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Sort users by points
  useEffect(() => {
    const sorted = [...users].sort((a, b) => b.points - a.points);
    setSortedUsers(sorted);
  }, [users]);

  // Initialize animations
  useEffect(() => {
    if (sortedUsers.length === 0) return;

    // Add elements to animation manager
    sortedUsers.forEach((user, index) => {
      const element = entryRefs.current.get(user.id);
      if (element) {
        leaderboardAnimationManager.addElement(user.id, element);
      }
    });

    // Start animation sequence
    const elementIds = sortedUsers.map(user => user.id);
    leaderboardAnimationManager.startAnimationSequence(elementIds);

    // Animate progress bars
    sortedUsers.forEach((user, index) => {
      setTimeout(() => {
        const maxPoints = Math.max(...sortedUsers.map(u => u.points), 1);
        const progress = (user.points / maxPoints) * 100;
        leaderboardAnimationManager.animateProgress(user.id, progress, index * 200);
      }, index * 300);
    });

    return () => {
      leaderboardAnimationManager.cleanup();
    };
  }, [sortedUsers]);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of update
        const randomUser = sortedUsers[Math.floor(Math.random() * sortedUsers.length)];
        if (randomUser) {
          leaderboardAnimationManager.animateLiveUpdate(randomUser.id);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [sortedUsers]);

  const maxPoints = Math.max(...sortedUsers.map(user => user.points), 1);

  return (
    <div ref={containerRef} className="w-full">
      <Card className="spectacular-leaderboard">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-purple-400 font-display flex items-center">
              <div className="leaderboard-ranking mr-3">
                <BarChart3 className="h-7 w-7" />
              </div>
              {title}
            </CardTitle>
            <div className="flex items-center space-x-4">
              {showLiveIndicator && (
                <div className="spectacular-live flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400 text-sm font-mono">LIVE</span>
                </div>
              )}
              <div className="text-neutral-400 text-sm font-mono">
                {sortedUsers.length} Players
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {sortedUsers.map((user, index) => {
            const rank = index + 1;
            const isCurrentUser = currentUser && user.id === currentUser.id;
            const progressWidth = (user.points / maxPoints) * 100;
            
            return (
              <div
                key={user.id}
                ref={(el) => {
                  if (el) entryRefs.current.set(user.id, el);
                }}
                className={`
                  spectacular-entry spectacular-entry-enter spectacular-float
                  ${isCurrentUser ? 'ring-2 ring-purple-400/50 shadow-lg shadow-purple-400/20' : ''}
                  spectacular-hover-lift
                `}
                style={{
                  animationDelay: `${index * 200}ms`
                }}
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-purple-900/20 opacity-50" />
                
                {/* Main content */}
                <div className="relative z-10 p-4">
                  <div className="flex items-center space-x-4">
                    {/* Ranking */}
                    <div className="leaderboard-ranking flex items-center space-x-2">
                      <div className="text-2xl font-bold text-purple-400 font-mono">
                        #{rank}
                      </div>
                      <div className="leaderboard-avatar">
                        {getRankIcon(rank)}
                      </div>
                    </div>

                    {/* Avatar */}
                    <div className={`
                      spectacular-avatar w-12 h-12 rounded-full flex items-center justify-center text-white font-mono font-bold text-lg
                      ${getAvatarColor(rank)}
                    `}>
                      {getInitials(user.name)}
                    </div>

                    {/* User info */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`
                        text-lg font-bold font-display
                        ${isCurrentUser ? 'text-purple-300' : 'text-white'}
                      `}>
                        {user.name}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs bg-purple-500/20 px-2 py-1 rounded-full">
                            YOU
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-neutral-400 font-mono">
                        Level {user.level} • {user.completedActivities.length} completed
                      </p>
                    </div>

                    {/* Progress bar */}
                    <div className="flex-1 max-w-xs">
                      <div className="spectacular-progress">
                        <div
                          className={`
                            spectacular-progress-fill bg-gradient-to-r ${getProgressColor(rank)}
                          `}
                          style={{
                            width: `${progressWidth}%`,
                            animation: 'spectacular-progress-fill 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                        />
                      </div>
                    </div>

                    {/* Score */}
                    <div className="spectacular-score text-right">
                      <div className="text-2xl font-bold text-purple-400 font-mono spectacular-text-glow">
                        {user.points.toLocaleString()}
                      </div>
                      <div className="text-xs text-neutral-400 font-mono">
                        points
                      </div>
                    </div>
                  </div>

                  {/* Special effects for top 3 */}
                  {rank <= 3 && (
                    <div className="absolute top-0 right-0 w-20 h-20 opacity-20">
                      {rank === 1 && <Star className="w-full h-full text-yellow-400 animate-pulse" />}
                      {rank === 2 && <Medal className="w-full h-full text-gray-300 animate-pulse" />}
                      {rank === 3 && <Trophy className="w-full h-full text-amber-500 animate-pulse" />}
                    </div>
                  )}

                  {/* Live update indicator */}
                  {Math.random() > 0.8 && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-ping" />
                  )}
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              </div>
            );
          })}
        </CardContent>

        {/* Footer with live stats */}
        <div className="px-6 py-4 border-t border-purple-500/20 bg-purple-900/10">
          <div className="flex items-center justify-between text-sm text-neutral-400 font-mono">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Crown className="h-4 w-4 text-yellow-400" />
                <span>1st Place</span>
              </div>
              <div className="flex items-center space-x-1">
                <Medal className="h-4 w-4 text-gray-300" />
                <span>2nd Place</span>
              </div>
              <div className="flex items-center space-x-1">
                <Medal className="h-4 w-4 text-amber-500" />
                <span>3rd Place</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Live Updates</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
