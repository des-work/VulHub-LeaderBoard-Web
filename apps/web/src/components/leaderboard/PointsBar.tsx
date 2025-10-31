/**
 * PointsBar Component
 * 
 * Animated progress bar showing relative points
 * Uses centralized config for full customization
 */

import React from 'react';
import { 
  PROGRESS_BAR_CONFIG,
  LEADERBOARD_SIZING,
  LEADERBOARD_COLORS,
} from '../../lib/leaderboard/config';
import {
  calculatePercentage,
  createProgressBarFill,
  createScanLineEffect,
} from '../../lib/leaderboard/utils';

interface PointsBarProps {
  points: number;
  maxPoints: number;
  height?: 'thin' | 'medium' | 'thick';
  animated?: boolean;
  showScanLine?: boolean;
  className?: string;
}

const PointsBar: React.FC<PointsBarProps> = ({ 
  points, 
  maxPoints, 
  height = 'medium',
  animated = true,
  showScanLine = PROGRESS_BAR_CONFIG.showScanLine,
  className = '',
}) => {
  const percentage = calculatePercentage(points, maxPoints);
  const heightValue = LEADERBOARD_SIZING.height.progressBar[height];
  const fillStyles = createProgressBarFill(percentage, animated);
  
  return (
    <div 
      className={`relative w-full overflow-hidden ${className}`}
      style={{
        height: heightValue,
        backgroundColor: PROGRESS_BAR_CONFIG.backgroundColor,
        borderRadius: PROGRESS_BAR_CONFIG.borderRadius,
      }}
    >
      {/* Progress Fill */}
      <div 
        className="absolute inset-y-0 left-0"
        style={fillStyles}
      >
        {/* Scan Line Effect */}
        {animated && showScanLine && PROGRESS_BAR_CONFIG.scanLineAnimation && (
          <div 
            className="absolute inset-0 animate-scan-line"
            style={createScanLineEffect()}
          />
        )}
      </div>
      
      {/* Glow Overlay */}
      {animated && percentage > 0 && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to right, transparent, ${LEADERBOARD_COLORS.matrix.glow} ${percentage}%, transparent)`,
            opacity: 0.3,
          }}
        />
      )}
    </div>
  );
};

export default PointsBar;

