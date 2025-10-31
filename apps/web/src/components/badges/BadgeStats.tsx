/**
 * BadgeStats Component
 * 
 * Display overall badge statistics and progress
 */

import React from 'react';
import { BadgeStats } from '../../lib/badges/types';
import { Trophy, Lock, Star, TrendingUp } from 'lucide-react';

interface BadgeStatsProps {
  stats: BadgeStats;
  animated?: boolean;
}

const BadgeStatsComponent: React.FC<BadgeStatsProps> = ({ stats, animated = true }) => {
  const completionPercentage = stats.total > 0 ? (stats.unlocked / stats.total) * 100 : 0;
  const pointsPercentage = stats.totalPoints > 0 ? (stats.earnedPoints / stats.totalPoints) * 100 : 0;

  return (
    <div className="matrix-card p-card-md space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-matrix-glow mb-1">
            Badge Collection
          </h2>
          <p className="text-sm text-muted">
            Track your achievements and unlock rewards
          </p>
        </div>
        <Trophy className="h-12 w-12 text-matrix animate-bounce-subtle" />
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Badges */}
        <div className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800 hover-lift">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-5 w-5 text-matrix" />
            <span className="text-sm text-muted">Total</span>
          </div>
          <div className="text-3xl font-bold text-bright">{stats.total}</div>
        </div>

        {/* Unlocked */}
        <div className="bg-neutral-900/50 rounded-lg p-4 border border-matrix/30 hover-lift">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-5 w-5 text-matrix-glow" />
            <span className="text-sm text-muted">Unlocked</span>
          </div>
          <div className="text-3xl font-bold text-matrix-glow">{stats.unlocked}</div>
        </div>

        {/* Locked */}
        <div className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800 hover-lift">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="h-5 w-5 text-dim" />
            <span className="text-sm text-muted">Locked</span>
          </div>
          <div className="text-3xl font-bold text-dim">{stats.locked}</div>
        </div>

        {/* Points */}
        <div className="bg-neutral-900/50 rounded-lg p-4 border border-cyan-500/30 hover-lift">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-cyan-400" />
            <span className="text-sm text-muted">Points</span>
          </div>
          <div className="text-3xl font-bold text-cyan-400">
            {stats.earnedPoints.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-4">
        {/* Completion Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted">Collection Progress</span>
            <span className="text-matrix-glow font-bold">
              {Math.floor(completionPercentage)}%
            </span>
          </div>
          <div className="w-full bg-neutral-800 rounded-full h-3 overflow-hidden">
            <div
              className={`
                h-full rounded-full bg-gradient-to-r from-matrix-500 to-cyan-500
                ${animated ? 'transition-all duration-1000 animate-scan-line-progress' : ''}
              `}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Points Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted">Points Collected</span>
            <span className="text-cyan-400 font-bold">
              {stats.earnedPoints.toLocaleString()} / {stats.totalPoints.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-neutral-800 rounded-full h-3 overflow-hidden">
            <div
              className={`
                h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500
                ${animated ? 'transition-all duration-1000' : ''}
              `}
              style={{ width: `${pointsPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div>
        <h3 className="text-sm font-semibold text-bright mb-3">By Category</h3>
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(stats.byCategory).map(([category, count]) => (
            <div
              key={category}
              className="bg-neutral-900/50 rounded-lg p-2 text-center border border-neutral-800"
            >
              <div className="text-xs text-muted mb-1 capitalize">{category}</div>
              <div className="text-lg font-bold text-bright">{count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tier Breakdown */}
      <div>
        <h3 className="text-sm font-semibold text-bright mb-3">By Tier</h3>
        <div className="grid grid-cols-5 gap-2">
          <div className="bg-amber-600/20 rounded-lg p-2 text-center border border-amber-600/50">
            <div className="text-xs text-amber-400 mb-1">Bronze</div>
            <div className="text-lg font-bold text-bright">{stats.byTier.bronze}</div>
          </div>
          <div className="bg-gray-400/20 rounded-lg p-2 text-center border border-gray-400/50">
            <div className="text-xs text-gray-300 mb-1">Silver</div>
            <div className="text-lg font-bold text-bright">{stats.byTier.silver}</div>
          </div>
          <div className="bg-yellow-400/20 rounded-lg p-2 text-center border border-yellow-400/50">
            <div className="text-xs text-yellow-300 mb-1">Gold</div>
            <div className="text-lg font-bold text-bright">{stats.byTier.gold}</div>
          </div>
          <div className="bg-cyan-400/20 rounded-lg p-2 text-center border border-cyan-400/50">
            <div className="text-xs text-cyan-300 mb-1">Platinum</div>
            <div className="text-lg font-bold text-bright">{stats.byTier.platinum}</div>
          </div>
          <div className="bg-pink-400/20 rounded-lg p-2 text-center border border-pink-400/50">
            <div className="text-xs text-pink-300 mb-1">Diamond</div>
            <div className="text-lg font-bold text-bright">{stats.byTier.diamond}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeStatsComponent;

