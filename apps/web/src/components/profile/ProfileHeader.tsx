/**
 * ProfileHeader Component
 * 
 * User profile header with avatar, name, and key stats
 */

import React from 'react';
import { User } from '../../lib/auth/types';
import { ProfileStats } from '../../lib/profile/types';
import { Crown, TrendingUp, Calendar, Flame } from 'lucide-react';

interface ProfileHeaderProps {
  user: User;
  stats: ProfileStats;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, stats }) => {
  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="matrix-card hover-lift">
      <div className="matrix-card-content p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-matrix-500 to-cyan-500 flex items-center justify-center text-4xl font-bold text-black">
              {initials}
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-display font-bold text-matrix-glow mb-1">
              {user.name}
            </h1>
            <p className="text-muted mb-4">
              {user.schoolId} • {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Rank */}
              <div className="bg-neutral-900/50 rounded-lg p-3 border border-yellow-500/30">
                <div className="flex items-center gap-1 mb-1">
                  <Crown className="h-4 w-4 text-yellow-400" />
                  <span className="text-xs text-muted">Rank</span>
                </div>
                <div className="text-2xl font-bold text-yellow-400">
                  #{stats.currentRank}
                </div>
              </div>

              {/* Level */}
              <div className="bg-neutral-900/50 rounded-lg p-3 border border-matrix/30">
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp className="h-4 w-4 text-matrix" />
                  <span className="text-xs text-muted">Level</span>
                </div>
                <div className="text-2xl font-bold text-matrix-glow">
                  {stats.level}
                </div>
              </div>

              {/* Streak */}
              <div className="bg-neutral-900/50 rounded-lg p-3 border border-orange-500/30">
                <div className="flex items-center gap-1 mb-1">
                  <Flame className="h-4 w-4 text-orange-400" />
                  <span className="text-xs text-muted">Streak</span>
                </div>
                <div className="text-2xl font-bold text-orange-400">
                  {stats.currentStreak}d
                </div>
              </div>

              {/* Member Since */}
              <div className="bg-neutral-900/50 rounded-lg p-3 border border-cyan-500/30">
                <div className="flex items-center gap-1 mb-1">
                  <Calendar className="h-4 w-4 text-cyan-400" />
                  <span className="text-xs text-muted">Member</span>
                </div>
                <div className="text-2xl font-bold text-cyan-400">
                  {stats.daysSinceMemberJoin}d
                </div>
              </div>
            </div>
          </div>

          {/* Points Card */}
          <div className="flex-shrink-0">
            <div className="bg-gradient-to-br from-matrix/20 to-cyan/20 rounded-lg p-6 border-2 border-matrix animate-matrix-pulse-border text-center min-w-[160px]">
              <p className="text-sm text-muted mb-1">Total Points</p>
              <p className="text-4xl font-bold text-matrix-glow">{stats.totalPoints.toLocaleString()}</p>
              <div className="mt-3 pt-3 border-t border-matrix/30">
                <p className="text-xs text-dim">Next Level: {stats.nextLevelPoints}</p>
                <div className="mt-2 bg-neutral-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-matrix-500 to-cyan-500 transition-all duration-1000"
                    style={{ width: `${((stats.totalPoints % 500) / 500) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;

