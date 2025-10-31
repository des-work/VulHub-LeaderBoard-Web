/**
 * TrendIndicator Component
 * 
 * Displays ranking trend (up/down) with change value
 * Uses centralized config for full customization
 */

import React from 'react';
import { ChevronUp, ChevronDown, Minus } from 'lucide-react';
import {
  TREND_INDICATOR_CONFIG,
  LEADERBOARD_TYPOGRAPHY,
} from '../../lib/leaderboard/config';
import {
  createTrendIndicatorStyles,
} from '../../lib/leaderboard/utils';

interface TrendIndicatorProps {
  trend: 'up' | 'down' | 'stable';
  change: number;
  showIcon?: boolean;
  showChange?: boolean;
  className?: string;
}

const TrendIndicator: React.FC<TrendIndicatorProps> = ({
  trend,
  change,
  showIcon = true,
  showChange = true,
  className = '',
}) => {
  const styles = createTrendIndicatorStyles(trend);
  const config = TREND_INDICATOR_CONFIG[trend];
  
  // Don't show stable trend if configured
  if (trend === 'stable' && !config.show) {
    return null;
  }
  
  // Up Trend
  if (trend === 'up' && change > 0) {
    return (
      <div 
        className={`flex items-center gap-1 ${className}`}
        style={{
          color: config.iconColor,
          ...(config.glowEffect ? { filter: `drop-shadow(0 0 4px ${config.iconColor})` } : {}),
        }}
      >
        {showIcon && (
          <ChevronUp 
            style={{ 
              width: TREND_INDICATOR_CONFIG.iconSize, 
              height: TREND_INDICATOR_CONFIG.iconSize,
              color: config.iconColor,
            }}
          />
        )}
        {showChange && (
          <span 
            className="font-semibold"
            style={{ 
              fontSize: TREND_INDICATOR_CONFIG.fontSize,
              fontWeight: TREND_INDICATOR_CONFIG.fontWeight,
              color: config.textColor,
            }}
          >
            +{change}
          </span>
        )}
      </div>
    );
  }
  
  // Down Trend
  if (trend === 'down' && change < 0) {
    return (
      <div 
        className={`flex items-center gap-1 ${className}`}
        style={{ color: config.iconColor }}
      >
        {showIcon && (
          <ChevronDown 
            style={{ 
              width: TREND_INDICATOR_CONFIG.iconSize, 
              height: TREND_INDICATOR_CONFIG.iconSize,
              color: config.iconColor,
            }}
          />
        )}
        {showChange && (
          <span 
            className="font-semibold"
            style={{ 
              fontSize: TREND_INDICATOR_CONFIG.fontSize,
              fontWeight: TREND_INDICATOR_CONFIG.fontWeight,
              color: config.textColor,
            }}
          >
            {change}
          </span>
        )}
      </div>
    );
  }
  
  // Stable (no change)
  if (trend === 'stable' && change === 0 && config.show) {
    return (
      <div 
        className={`flex items-center gap-1 ${className}`}
        style={{ color: styles.color }}
      >
        {showIcon && (
          <Minus 
            style={{ 
              width: TREND_INDICATOR_CONFIG.iconSize, 
              height: TREND_INDICATOR_CONFIG.iconSize,
              color: styles.iconColor,
            }}
          />
        )}
        {showChange && (
          <span 
            className="font-semibold"
            style={{ 
              fontSize: TREND_INDICATOR_CONFIG.fontSize,
              fontWeight: TREND_INDICATOR_CONFIG.fontWeight,
              color: styles.color,
            }}
          >
            0
          </span>
        )}
      </div>
    );
  }
  
  return null;
};

export default TrendIndicator;

