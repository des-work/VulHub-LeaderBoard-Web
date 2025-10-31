/**
 * RankBadge Component
 * 
 * Displays rank number with special styling for top 3
 * Uses centralized config for full customization
 */

import React from 'react';
import { Crown, Medal, Star } from 'lucide-react';
import {
  RANK_BADGE_CONFIG,
  LEADERBOARD_SIZING,
  LEADERBOARD_COLORS,
} from '../../lib/leaderboard/config';
import {
  getRankConfig,
  getBadgeSizeStyles,
  createRankBadgeBackground,
  createLeaderboardGlow,
  formatRank,
} from '../../lib/leaderboard/utils';

interface RankBadgeProps {
  rank: number;
  size?: 'small' | 'medium' | 'large';
  showGlow?: boolean;
  className?: string;
}

const RankBadge: React.FC<RankBadgeProps> = ({ 
  rank, 
  size = 'medium',
  showGlow = true,
  className = '',
}) => {
  const sizeStyles = getBadgeSizeStyles(size);
  const config = getRankConfig(rank);
  const backgroundStyles = createRankBadgeBackground(rank);
  
  // Rank 1 (Gold Crown)
  if (rank === 1) {
    return (
      <div 
        className={`relative ${className}`}
        style={{
          width: sizeStyles.width,
          height: sizeStyles.height,
          ...(showGlow && config.glowColor ? createLeaderboardGlow(1) : {}),
        }}
      >
        <div 
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${config.gradient} ${config.pulseEffect ? 'animate-matrix-pulse' : ''}`}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Crown 
            style={{ 
              width: sizeStyles.iconSize, 
              height: sizeStyles.iconSize,
              color: config.iconColor,
            }}
            className={config.bounceEffect ? 'animate-bounce' : ''}
          />
        </div>
      </div>
    );
  }
  
  // Rank 2 (Silver Medal)
  if (rank === 2) {
    return (
      <div 
        className={`relative ${className}`}
        style={{
          width: sizeStyles.width,
          height: sizeStyles.height,
          ...(showGlow && config.glowColor ? createLeaderboardGlow(2) : {}),
        }}
      >
        <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${config.gradient}`} />
        <div className="absolute inset-0 flex items-center justify-center">
          <Medal 
            style={{ 
              width: sizeStyles.iconSize, 
              height: sizeStyles.iconSize,
              color: config.iconColor,
            }}
          />
        </div>
      </div>
    );
  }
  
  // Rank 3 (Bronze Star)
  if (rank === 3) {
    return (
      <div 
        className={`relative ${className}`}
        style={{
          width: sizeStyles.width,
          height: sizeStyles.height,
          ...(showGlow && config.glowColor ? createLeaderboardGlow(3) : {}),
        }}
      >
        <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${config.gradient}`} />
        <div className="absolute inset-0 flex items-center justify-center">
          <Star 
            style={{ 
              width: sizeStyles.iconSize, 
              height: sizeStyles.iconSize,
              color: config.iconColor,
            }}
          />
        </div>
      </div>
    );
  }
  
  // Default (Rank 4+)
  return (
    <div 
      className={`rounded-full flex items-center justify-center ${className}`}
      style={{
        width: sizeStyles.width,
        height: sizeStyles.height,
        ...backgroundStyles,
      }}
    >
      <span 
        className="font-bold font-display"
        style={{ 
          fontSize: sizeStyles.fontSize,
          color: config.textColor,
        }}
      >
        {formatRank(rank) || `#${rank}`}
      </span>
    </div>
  );
};

export default RankBadge;

