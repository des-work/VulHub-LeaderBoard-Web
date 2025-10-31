/**
 * StatusIcon Component
 * 
 * Displays player status (On Fire, Close, etc.) with animated icons
 */

import React from 'react';
import { Flame, TrendingUp } from 'lucide-react';

interface StatusIconProps {
  status: 'fire' | 'close' | 'normal';
  streak?: number;
  compact?: boolean;
}

const StatusIcon: React.FC<StatusIconProps> = ({ status, streak = 0, compact = false }) => {
  if (status === 'fire') {
    return (
      <div className={`
        flex items-center gap-1 bg-gradient-to-r from-red-500/20 to-orange-500/20 
        rounded-full border border-red-500/30 animate-matrix-pulse
        ${compact ? 'px-2 py-0.5' : 'px-3 py-1.5'}
      `}>
        <Flame className={`${compact ? 'h-3 w-3' : 'h-4 w-4'} text-red-500 animate-pulse`} />
        <span className={`${compact ? 'text-2xs' : 'text-xs'} font-bold text-red-400 uppercase tracking-wider whitespace-nowrap`}>
          On Fire
        </span>
        {streak > 0 && (
          <span className={`${compact ? 'text-2xs' : 'text-xs'} font-bold text-red-300`}>
            {streak}🔥
          </span>
        )}
      </div>
    );
  }
  
  if (status === 'close') {
    return (
      <div className={`
        flex items-center gap-1 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 
        rounded-full border border-yellow-500/30
        ${compact ? 'px-2 py-0.5' : 'px-3 py-1.5'}
      `}>
        <TrendingUp className={`${compact ? 'h-3 w-3' : 'h-4 w-4'} text-yellow-500`} />
        <span className={`${compact ? 'text-2xs' : 'text-xs'} font-bold text-yellow-400 uppercase tracking-wider whitespace-nowrap`}>
          Close
        </span>
      </div>
    );
  }
  
  return null;
};

export default StatusIcon;

