/**
 * UserRankCard Component
 * 
 * Special card highlighting the current user's rank (shown when outside top 15)
 */

import React from 'react';
import { ArrowUp } from 'lucide-react';

interface UserRankCardProps {
  rank: number;
  name: string;
  points: number;
  avatar?: string;
}

const UserRankCard: React.FC<UserRankCardProps> = ({ rank, name, points, avatar }) => {
  return (
    <div className="mt-6 pt-6 border-t border-matrix/30">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-matrix-950/50 via-neutral-900/80 to-matrix-950/50 border-2 border-matrix/60 p-4 animate-matrix-pulse">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-matrix/30 to-transparent animate-scan-line" />
        </div>
        
        {/* Content */}
        <div className="relative flex items-center justify-between gap-4">
          {/* Left Side */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Rank Badge */}
            <div className="flex-shrink-0 w-14 h-14 bg-neutral-800/50 rounded-full flex items-center justify-center border-2 border-matrix matrix-glow">
              <span className="text-xl font-bold font-display text-matrix">
                #{rank}
              </span>
            </div>
            
            {/* Name and Label */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-display font-bold text-matrix-glow truncate">
                  {name} <span className="text-cyan-400">(You)</span>
                </h3>
                <ArrowUp className="flex-shrink-0 h-5 w-5 text-matrix animate-bounce" />
              </div>
              <p className="text-sm text-muted">Your current rank</p>
            </div>
          </div>
          
          {/* Right Side: Points */}
          <div className="flex-shrink-0 text-right">
            <div className="text-3xl font-display font-black text-matrix-glow">
              {points.toLocaleString()}
            </div>
            <div className="text-xs text-muted uppercase tracking-wider whitespace-nowrap">
              points
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRankCard;

