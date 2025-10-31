/**
 * LeaderboardRow Component
 * 
 * Displays a single player's ranking with status, trends, and points.
 * Highly customizable via props.
 */

import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import RankBadge from './RankBadge';
import StatusIcon from './StatusIcon';
import PointsBar from './PointsBar';

export interface LeaderboardPlayer {
  id: number;
  name: string;
  points: number;
  level: number;
  completed: number;
  status: 'fire' | 'close' | 'normal';
  trend: 'up' | 'down' | 'stable';
  streak: number;
  change: number;
}

interface LeaderboardRowProps {
  player: LeaderboardPlayer;
  rank: number;
  maxPoints: number;
  isCurrentUser?: boolean;
  animationDelay?: number;
  showProgressBar?: boolean;
  showStatus?: boolean;
  showTrend?: boolean;
}

const TrendIndicator: React.FC<{ trend: string; change: number }> = ({ trend, change }) => {
  if (trend === 'up' && change > 0) {
    return (
      <div className="flex items-center space-x-1 text-matrix">
        <ChevronUp className="h-4 w-4" />
        <span className="text-xs font-semibold">+{change}</span>
      </div>
    );
  }
  if (trend === 'down' && change < 0) {
    return (
      <div className="flex items-center space-x-1 text-red-400">
        <ChevronDown className="h-4 w-4" />
        <span className="text-xs font-semibold">{change}</span>
      </div>
    );
  }
  return null;
};

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({
  player,
  rank,
  maxPoints,
  isCurrentUser = false,
  animationDelay = 0,
  showProgressBar = true,
  showStatus = true,
  showTrend = true,
}) => {
  const isTop3 = rank <= 3;
  
  return (
    <div
      className={`
        group relative overflow-hidden rounded-xl transition-all duration-300
        animate-fade-in
        ${isTop3 
          ? 'bg-gradient-to-r from-matrix-950/50 via-neutral-900/80 to-matrix-950/50 border-2 border-matrix/40 p-4' 
          : 'bg-neutral-900/30 border border-neutral-800/50 p-3'
        }
        ${isCurrentUser 
          ? 'ring-2 ring-matrix ring-offset-2 ring-offset-black' 
          : ''
        }
        hover:bg-neutral-800/50 hover:border-matrix/60 hover:scale-[1.02] hover:shadow-cyber-lg
      `}
      style={{
        animationDelay: `${animationDelay}ms`
      }}
    >
      {/* Animated background for top 3 */}
      {isTop3 && (
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-matrix/20 to-transparent animate-scan-line" />
        </div>
      )}
      
      <div className="relative flex items-center justify-between gap-4">
        {/* Left Side: Rank + Name */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Rank Badge */}
          <div className="flex-shrink-0">
            <RankBadge rank={rank} />
          </div>
          
          {/* Player Info */}
          <div className="flex-1 min-w-0">
            {/* Name and Trend */}
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`
                font-display font-bold truncate
                ${isTop3 ? 'text-xl text-matrix-glow' : 'text-lg text-bright'}
              `}>
                {player.name}
              </h3>
              {showTrend && <TrendIndicator trend={player.trend} change={player.change} />}
            </div>
            
            {/* Level and Status */}
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-sm text-muted whitespace-nowrap">
                Level {player.level} • {player.completed} completed
              </p>
              {showStatus && <StatusIcon status={player.status} streak={player.streak} />}
            </div>
            
            {/* Progress Bar */}
            {showProgressBar && (
              <div className="mt-2">
                <PointsBar points={player.points} maxPoints={maxPoints} />
              </div>
            )}
          </div>
        </div>
        
        {/* Right Side: Points */}
        <div className="flex-shrink-0 text-right">
          <div className={`
            font-display font-black tracking-tight
            ${isTop3 ? 'text-3xl text-matrix-glow' : 'text-2xl text-matrix'}
          `}>
            {player.points.toLocaleString()}
          </div>
          <div className="text-xs text-muted uppercase tracking-wider whitespace-nowrap">
            points
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardRow;

