/**
 * ChallengeStats Component
 * 
 * Display overall challenge statistics and breakdowns
 */

import React from 'react';
import { ChallengeStats } from '../../lib/challenges/utils';
import { Trophy, Target, Flame, TrendingUp } from 'lucide-react';

interface ChallengeStatsProps {
  stats: ChallengeStats;
  animated?: boolean;
}

const ChallengeStatsComponent: React.FC<ChallengeStatsProps> = ({ stats, animated = true }) => {
  return (
    <div className="matrix-card p-card-md space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-matrix-glow mb-1">
            Challenge Catalog
          </h2>
          <p className="text-sm text-muted">
            Mapped to official VulHub environments
          </p>
        </div>
        <Trophy className="h-12 w-12 text-matrix animate-bounce-subtle" />
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Challenges */}
        <div className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800 hover-lift">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-5 w-5 text-matrix" />
            <span className="text-sm text-muted">Total</span>
          </div>
          <div className="text-3xl font-bold text-bright">{stats.total}</div>
        </div>

        {/* Total Points */}
        <div className="bg-neutral-900/50 rounded-lg p-4 border border-yellow-500/30 hover-lift">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="h-5 w-5 text-yellow-400" />
            <span className="text-sm text-muted">Total Points</span>
          </div>
          <div className="text-3xl font-bold text-yellow-400">{stats.totalPoints.toLocaleString()}</div>
        </div>

        {/* Average Points */}
        <div className="bg-neutral-900/50 rounded-lg p-4 border border-cyan-500/30 hover-lift">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-cyan-400" />
            <span className="text-sm text-muted">Avg Points</span>
          </div>
          <div className="text-3xl font-bold text-cyan-400">{stats.averagePoints}</div>
        </div>

        {/* Categories */}
        <div className="bg-neutral-900/50 rounded-lg p-4 border border-purple-500/30 hover-lift">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-5 w-5 text-purple-400" />
            <span className="text-sm text-muted">Categories</span>
          </div>
          <div className="text-3xl font-bold text-purple-400">
            {Object.keys(stats.byCategory).length}
          </div>
        </div>
      </div>

      {/* Difficulty Breakdown */}
      <div>
        <h3 className="text-sm font-semibold text-bright mb-3">By Difficulty</h3>
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-green-500/10 rounded-lg p-3 text-center border border-green-500/30">
            <div className="text-xs text-green-400 mb-1">Beginner</div>
            <div className="text-2xl font-bold text-bright">{stats.byDifficulty.beginner}</div>
          </div>
          <div className="bg-yellow-500/10 rounded-lg p-3 text-center border border-yellow-500/30">
            <div className="text-xs text-yellow-400 mb-1">Intermediate</div>
            <div className="text-2xl font-bold text-bright">{stats.byDifficulty.intermediate}</div>
          </div>
          <div className="bg-orange-500/10 rounded-lg p-3 text-center border border-orange-500/30">
            <div className="text-xs text-orange-400 mb-1">Advanced</div>
            <div className="text-2xl font-bold text-bright">{stats.byDifficulty.advanced}</div>
          </div>
          <div className="bg-red-500/10 rounded-lg p-3 text-center border border-red-500/30">
            <div className="text-xs text-red-400 mb-1">Expert</div>
            <div className="text-2xl font-bold text-bright">{stats.byDifficulty.expert}</div>
          </div>
        </div>
      </div>

      {/* Top Categories */}
      <div>
        <h3 className="text-sm font-semibold text-bright mb-3">Top Categories</h3>
        <div className="space-y-2">
          {Object.entries(stats.byCategory)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([category, count]) => (
              <div key={category} className="flex items-center justify-between bg-neutral-900/50 rounded-lg p-2 border border-neutral-800">
                <span className="text-sm text-bright truncate">{category}</span>
                <span className="text-sm font-bold text-matrix">{count}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ChallengeStatsComponent;

