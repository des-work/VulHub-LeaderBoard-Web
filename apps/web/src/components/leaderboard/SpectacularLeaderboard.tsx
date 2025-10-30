'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { User } from '../../lib/auth/types';
import { Card, CardContent, CardHeader, CardTitle } from '../../lib/ui/card';
import { BarChart3, Crown, Medal, Trophy, Zap, Star, Flame, Target, Swords, TrendingUp } from 'lucide-react';
import { leaderboardAnimationManager } from '../../lib/animations/leaderboard-animations';

interface SpectacularLeaderboardProps {
  users: User[];
  currentUser?: User | null;
  title?: string;
  showLiveIndicator?: boolean;
  topN?: number; // new: limit display
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
  showLiveIndicator = true,
  topN = 15,
}) => {
  const [sortedUsers, setSortedUsers] = useState<User[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const entryRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Sort and limit
  useEffect(() => {
    const sorted = [...users].sort((a, b) => b.points - a.points).slice(0, topN);
    setSortedUsers(sorted);
  }, [users, topN]);

  // Animation wiring
  useEffect(() => {
    if (sortedUsers.length === 0) return;
    sortedUsers.forEach((user) => {
      const element = entryRefs.current.get(user.id);
      if (element) leaderboardAnimationManager.addElement(user.id, element);
    });
    const ids = sortedUsers.map(u => u.id);
    leaderboardAnimationManager.startAnimationSequence(ids);
    sortedUsers.forEach((user, index) => {
      const maxPoints = Math.max(...sortedUsers.map(u => u.points), 1);
      const progress = (user.points / maxPoints) * 100;
      leaderboardAnimationManager.animateProgress(user.id, progress, index * 150);
    });
    return () => leaderboardAnimationManager.cleanup();
  }, [sortedUsers]);

  const maxPoints = useMemo(() => Math.max(...sortedUsers.map(user => user.points), 1), [sortedUsers]);

  // Compute dynamic indicators
  const isOnFire = (user: User) => user.points >= maxPoints * 0.9; // top 10%
  const isStreaking = (user: User) => (user.points % 300 === 0) || (user.level > 3 && user.points % 250 < 20);
  const isCloseMatch = (idx: number) => {
    if (idx === 0) return false;
    const diff = sortedUsers[idx - 1].points - sortedUsers[idx].points;
    return diff > 0 && diff <= Math.max(50, Math.round(maxPoints * 0.02));
  };

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
                Top {sortedUsers.length} Players
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {sortedUsers.map((user, index) => {
            const rank = index + 1;
            const isCurrentUser = currentUser && user.id === currentUser.id;
            const progressWidth = (user.points / maxPoints) * 100;
            const fire = isOnFire(user);
            const streak = isStreaking(user);
            const close = isCloseMatch(index);
            
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
                  animationDelay: `${index * 150}ms`
                }}
              >
                {/* subtle bg */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-purple-900/20 opacity-50" />
                
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
                    <div className="min-w-0 w-[22%]">
                      <h3 className={`
                        text-lg font-bold font-display truncate
                        ${isCurrentUser ? 'text-purple-300' : 'text-white'}
                      }`}>
                        {user.name}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs bg-purple-500/20 px-2 py-1 rounded-full">
                            YOU
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-neutral-400 font-mono truncate">
                        Level {user.level} • {user.completedActivities.length} completed
                      </p>
                    </div>

                    {/* Progress bar - give it breathing room on the right */}
                    <div className="flex-1 mr-8">
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

                    {/* Right column: badges + score (fixed width to prevent overlap) */}
                    <div className="w-64 flex items-center justify-end gap-4">
                      {/* badges row */}
                      <div className="flex items-center gap-2 flex-wrap justify-end max-w-[12rem]">
                        {fire && (
                          <span title="On Fire" className="inline-flex items-center text-orange-400 animate-pulse">
                            <Flame className="h-4 w-4 mr-1"/> Fire
                          </span>
                        )}
                        {streak && (
                          <span title="Streak" className="inline-flex items-center text-green-300">
                            <TrendingUp className="h-4 w-4 mr-1"/> Streak
                          </span>
                        )}
                        {close && (
                          <span title="Close Match" className="inline-flex items-center text-yellow-300">
                            <Swords className="h-4 w-4 mr-1"/> Close
                          </span>
                        )}
                      </div>
                      {/* score */}
                      <div className="text-right min-w-[5.5rem]">
                        <div className="text-2xl font-bold text-purple-400 font-mono spectacular-text-glow leading-none">
                          {user.points.toLocaleString()}
                        </div>
                        <div className="text-xs text-neutral-400 font-mono">points</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};
