/**
 * RankBadge Component
 * 
 * Displays rank number with special styling for top 3
 */

import React from 'react';
import { Crown, Medal, Star } from 'lucide-react';

interface RankBadgeProps {
  rank: number;
  size?: 'small' | 'medium' | 'large';
}

const RankBadge: React.FC<RankBadgeProps> = ({ rank, size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-10 h-10',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };
  
  const iconSizes = {
    small: 'h-5 w-5',
    medium: 'h-6 w-6',
    large: 'h-8 w-8'
  };
  
  const fontSize = {
    small: 'text-base',
    medium: 'text-lg',
    large: 'text-2xl'
  };
  
  if (rank === 1) {
    return (
      <div className={`relative ${sizeClasses[size]}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full animate-matrix-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Crown className={`${iconSizes[size]} text-black animate-bounce`} />
        </div>
      </div>
    );
  }
  
  if (rank === 2) {
    return (
      <div className={`relative ${sizeClasses[size]}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Medal className={`${iconSizes[size]} text-black`} />
        </div>
      </div>
    );
  }
  
  if (rank === 3) {
    return (
      <div className={`relative ${sizeClasses[size]}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Star className={`${iconSizes[size]} text-black`} />
        </div>
      </div>
    );
  }
  
  return (
    <div className={`${sizeClasses[size]} bg-neutral-800/50 rounded-full flex items-center justify-center border border-matrix/30`}>
      <span className={`${fontSize[size]} font-bold font-display text-matrix`}>
        #{rank}
      </span>
    </div>
  );
};

export default RankBadge;

