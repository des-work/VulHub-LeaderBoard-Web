/**
 * PointsBar Component
 * 
 * Animated progress bar showing relative points
 */

import React from 'react';

interface PointsBarProps {
  points: number;
  maxPoints: number;
  height?: 'small' | 'medium' | 'large';
  animated?: boolean;
}

const PointsBar: React.FC<PointsBarProps> = ({ 
  points, 
  maxPoints, 
  height = 'medium',
  animated = true 
}) => {
  const percentage = Math.min((points / maxPoints) * 100, 100);
  
  const heightClasses = {
    small: 'h-1',
    medium: 'h-2',
    large: 'h-3'
  };
  
  return (
    <div className={`relative w-full ${heightClasses[height]} bg-neutral-900 rounded-full overflow-hidden`}>
      <div 
        className={`
          absolute inset-y-0 left-0 bg-gradient-to-r from-matrix-500 via-cyan-500 to-matrix-500 rounded-full
          ${animated ? 'transition-all duration-1000 ease-out' : ''}
        `}
        style={{ width: `${percentage}%` }}
      >
        {animated && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-scan-line" />
        )}
      </div>
    </div>
  );
};

export default PointsBar;

