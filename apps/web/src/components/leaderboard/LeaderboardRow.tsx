/**
 * LeaderboardRow Component
 * 
 * Displays a single player's ranking with status, trends, and points.
 * Uses centralized config for full customization
 */

import React from 'react';
import RankBadge from './RankBadge';
import StatusIcon from './StatusIcon';
import PointsBar from './PointsBar';
import TrendIndicator from './TrendIndicator';
import {
  LEADERBOARD_ROW_CONFIG,
  LEADERBOARD_COLORS,
  LEADERBOARD_TYPOGRAPHY,
  LEADERBOARD_SIZING,
} from '../../lib/leaderboard/config';
import {
  getRowConfig,
  createRowGradient,
  createCurrentUserRing,
  getStaggerDelay,
  formatPoints,
  createTextGlow,
  createBorderGlow,
} from '../../lib/leaderboard/utils';

export interface LeaderboardPlayer {
  id: number;
  name: string;
  points: number;
  level: number;
  completed: number;
  status: 'fire' | 'close' | 'trending' | 'normal';
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
  className?: string;
}

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({
  player,
  rank,
  maxPoints,
  isCurrentUser = false,
  animationDelay,
  showProgressBar = true,
  showStatus = true,
  showTrend = true,
  className = '',
}) => {
  const isTop3 = rank <= 3;
  const config = getRowConfig(rank, isCurrentUser);
  const rowGradient = createRowGradient(rank);
  const borderGlow = createBorderGlow(rank);
  const delay = animationDelay !== undefined ? animationDelay : getStaggerDelay(rank - 1);
  
  return (
    <div
      className={`
        group relative overflow-hidden transition-all animate-fade-in ${className}
      `}
      style={{
        ...rowGradient,
        ...borderGlow,
        padding: config.padding,
        borderRadius: LEADERBOARD_SIZING.borderRadius.large,
        animationDelay: `${delay}ms`,
        ...(isCurrentUser ? createCurrentUserRing() : {}),
      }}
      onMouseEnter={(e) => {
        const target = e.currentTarget as HTMLElement;
        target.style.transform = `scale(${config.hoverScale}) translateY(-2px)`;
        target.style.backgroundColor = config.hoverBackground || LEADERBOARD_COLORS.background.cardHover;
        target.style.borderColor = config.hoverBorderColor || LEADERBOARD_COLORS.border.hover;
      }}
      onMouseLeave={(e) => {
        const target = e.currentTarget as HTMLElement;
        target.style.transform = 'scale(1) translateY(0)';
        target.style.backgroundColor = config.backgroundColor || '';
        target.style.borderColor = config.borderColor || '';
      }}
    >
      {/* Scan Line Animation for Top 3 */}
      {isTop3 && config.showScanLine && (
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div 
            className="absolute inset-0 animate-scan-line"
            style={{
              background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3), transparent)',
            }}
          />
        </div>
      )}
      
      <div className="relative flex items-center justify-between gap-4">
        {/* Left Side: Rank + Player Info */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Rank Badge */}
          <div className="flex-shrink-0">
            <RankBadge rank={rank} showGlow={isTop3} />
          </div>
          
          {/* Player Info */}
          <div className="flex-1 min-w-0">
            {/* Name and Trend */}
            <div className="flex items-center gap-2 mb-1">
              <h3 
                className="font-display font-bold truncate"
                style={{
                  fontSize: isTop3 
                    ? LEADERBOARD_TYPOGRAPHY.sizes.playerName.top3 
                    : LEADERBOARD_TYPOGRAPHY.sizes.playerName.default,
                  color: isTop3 
                    ? LEADERBOARD_COLORS.matrix.primary 
                    : LEADERBOARD_COLORS.text.bright,
                  fontWeight: LEADERBOARD_TYPOGRAPHY.weights.bold,
                  ...(isTop3 ? createTextGlow(LEADERBOARD_COLORS.matrix.primary, 'low') : {}),
                }}
              >
                {player.name}
              </h3>
              {showTrend && (
                <TrendIndicator 
                  trend={player.trend} 
                  change={player.change}
                />
              )}
            </div>
            
            {/* Level and Status */}
            <div className="flex items-center gap-3 flex-wrap">
              <p 
                className="whitespace-nowrap"
                style={{
                  fontSize: LEADERBOARD_TYPOGRAPHY.sizes.label.medium,
                  color: LEADERBOARD_COLORS.text.muted,
                }}
              >
                Level {player.level} • {player.completed} completed
              </p>
              {showStatus && (
                <StatusIcon 
                  status={player.status} 
                  streak={player.streak}
                  compact={!isTop3}
                />
              )}
            </div>
            
            {/* Progress Bar */}
            {showProgressBar && (
              <div className="mt-2">
                <PointsBar 
                  points={player.points} 
                  maxPoints={maxPoints}
                  height={isTop3 ? 'medium' : 'thin'}
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Right Side: Points */}
        <div className="flex-shrink-0 text-right">
          <div 
            className="font-display font-black tracking-tight"
            style={{
              fontSize: isTop3 
                ? LEADERBOARD_TYPOGRAPHY.sizes.points.top3 
                : LEADERBOARD_TYPOGRAPHY.sizes.points.default,
              color: isTop3 
                ? LEADERBOARD_COLORS.matrix.primary 
                : LEADERBOARD_COLORS.matrix.medium,
              fontWeight: LEADERBOARD_TYPOGRAPHY.weights.black,
              letterSpacing: LEADERBOARD_TYPOGRAPHY.tracking.tight,
              ...(isTop3 ? createTextGlow(LEADERBOARD_COLORS.matrix.primary, 'medium') : {}),
            }}
          >
            {formatPoints(player.points)}
          </div>
          <div 
            className="uppercase tracking-wider whitespace-nowrap"
            style={{
              fontSize: LEADERBOARD_TYPOGRAPHY.sizes.label.small,
              color: LEADERBOARD_COLORS.text.muted,
              letterSpacing: LEADERBOARD_TYPOGRAPHY.tracking.wider,
            }}
          >
            points
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardRow;

