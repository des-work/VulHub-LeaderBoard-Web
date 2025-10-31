/**
 * StatusIcon Component
 * 
 * Displays player status (On Fire, Close, etc.) with animated icons
 * Uses centralized config for full customization
 */

import React from 'react';
import { Flame, TrendingUp, Zap } from 'lucide-react';
import {
  STATUS_BADGE_CONFIG,
  LEADERBOARD_TYPOGRAPHY,
} from '../../lib/leaderboard/config';
import {
  createStatusBadgeStyles,
} from '../../lib/leaderboard/utils';

interface StatusIconProps {
  status: 'fire' | 'close' | 'trending' | 'normal';
  streak?: number;
  compact?: boolean;
  showLabel?: boolean;
  className?: string;
}

const StatusIcon: React.FC<StatusIconProps> = ({ 
  status, 
  streak = 0, 
  compact = false,
  showLabel = true,
  className = '',
}) => {
  if (status === 'normal') return null;
  
  const styles = createStatusBadgeStyles(status, compact);
  const config = STATUS_BADGE_CONFIG[status];
  const iconSize = compact ? '0.75rem' : '1rem';
  const fontSize = compact ? LEADERBOARD_TYPOGRAPHY.sizes.label.small : LEADERBOARD_TYPOGRAPHY.sizes.label.medium;
  
  // Fire Status
  if (status === 'fire') {
    return (
      <div 
        className={`flex items-center gap-1 rounded-full border whitespace-nowrap ${config.pulseEffect ? 'animate-matrix-pulse' : ''} ${className}`}
        style={{
          ...styles,
          ...(config.glowEffect ? { boxShadow: `0 0 10px ${config.iconColor}` } : {}),
        }}
      >
        <Flame 
          style={{ 
            width: iconSize, 
            height: iconSize,
            color: config.iconColor,
          }}
          className={config.pulseEffect ? 'animate-pulse' : ''}
        />
        {showLabel && (
          <span 
            className="font-bold uppercase tracking-wider"
            style={{ 
              fontSize,
              color: config.textColor,
              fontWeight: LEADERBOARD_TYPOGRAPHY.weights.bold,
              letterSpacing: LEADERBOARD_TYPOGRAPHY.tracking.widest,
            }}
          >
            On Fire
          </span>
        )}
        {streak > 0 && (
          <span 
            className="font-bold"
            style={{ 
              fontSize,
              color: config.textColor,
              fontWeight: LEADERBOARD_TYPOGRAPHY.weights.bold,
            }}
          >
            {streak}🔥
          </span>
        )}
      </div>
    );
  }
  
  // Close Status
  if (status === 'close') {
    return (
      <div 
        className={`flex items-center gap-1 rounded-full border whitespace-nowrap ${className}`}
        style={styles}
      >
        <TrendingUp 
          style={{ 
            width: iconSize, 
            height: iconSize,
            color: config.iconColor,
          }}
        />
        {showLabel && (
          <span 
            className="font-bold uppercase tracking-wider"
            style={{ 
              fontSize,
              color: config.textColor,
              fontWeight: LEADERBOARD_TYPOGRAPHY.weights.bold,
              letterSpacing: LEADERBOARD_TYPOGRAPHY.tracking.widest,
            }}
          >
            Close
          </span>
        )}
      </div>
    );
  }
  
  // Trending Status
  if (status === 'trending') {
    return (
      <div 
        className={`flex items-center gap-1 rounded-full border whitespace-nowrap ${className}`}
        style={styles}
      >
        <Zap 
          style={{ 
            width: iconSize, 
            height: iconSize,
            color: config.iconColor,
          }}
        />
        {showLabel && (
          <span 
            className="font-bold uppercase tracking-wider"
            style={{ 
              fontSize,
              color: config.textColor,
              fontWeight: LEADERBOARD_TYPOGRAPHY.weights.bold,
              letterSpacing: LEADERBOARD_TYPOGRAPHY.tracking.widest,
            }}
          >
            Trending
          </span>
        )}
      </div>
    );
  }
  
  return null;
};

export default StatusIcon;

