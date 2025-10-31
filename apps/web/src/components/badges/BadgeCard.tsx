/**
 * BadgeCard Component
 * 
 * Individual badge display card with unlock status and progress
 */

import React from 'react';
import { Badge } from '../../lib/badges/types';
import { calculateBadgeProgress, formatBadgeProgress } from '../../lib/badges/utils';
import { TIER_COLORS, RARITY_COLORS } from '../../lib/badges/data';
import { Lock, Check, TrendingUp } from 'lucide-react';

interface BadgeCardProps {
  badge: Badge;
  onClick?: (badge: Badge) => void;
  showProgress?: boolean;
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
}

const BadgeCard: React.FC<BadgeCardProps> = ({
  badge,
  onClick,
  showProgress = true,
  size = 'medium',
  animated = true
}) => {
  const progress = calculateBadgeProgress(badge);
  const isNearCompletion = !badge.isUnlocked && progress >= 75;

  // Size classes
  const sizeClasses = {
    small: {
      card: 'p-3',
      icon: 'text-3xl',
      title: 'text-sm',
      description: 'text-xs',
      points: 'text-xs'
    },
    medium: {
      card: 'p-4',
      icon: 'text-5xl',
      title: 'text-base',
      description: 'text-sm',
      points: 'text-sm'
    },
    large: {
      card: 'p-6',
      icon: 'text-6xl',
      title: 'text-lg',
      description: 'text-base',
      points: 'text-base'
    }
  }[size];

  return (
    <div
      className={`
        relative matrix-card hover-lift cursor-pointer transition-all
        ${badge.isUnlocked ? 'border-matrix' : 'border-neutral-800'}
        ${isNearCompletion ? 'animate-matrix-pulse-border' : ''}
        ${animated ? 'animate-fade-in' : ''}
        ${!badge.isUnlocked ? 'opacity-70' : ''}
        ${sizeClasses.card}
      `}
      onClick={() => onClick?.(badge)}
    >
      {/* Locked Overlay */}
      {!badge.isUnlocked && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] rounded-lg flex items-center justify-center z-10 pointer-events-none">
          <Lock className="h-8 w-8 text-neutral-600" />
        </div>
      )}

      {/* Unlocked Badge */}
      {badge.isUnlocked && (
        <div className="absolute top-2 right-2 bg-matrix/20 border border-matrix rounded-full p-1 animate-bounce-subtle">
          <Check className="h-4 w-4 text-matrix-glow" />
        </div>
      )}

      {/* Near Completion Indicator */}
      {isNearCompletion && (
        <div className="absolute top-2 right-2 bg-yellow-500/20 border border-yellow-500 rounded-full p-1 animate-pulse">
          <TrendingUp className="h-4 w-4 text-yellow-400" />
        </div>
      )}

      {/* Badge Content */}
      <div className="relative z-0">
        {/* Icon */}
        <div className={`text-center mb-3 ${sizeClasses.icon}`}>
          {badge.icon}
        </div>

        {/* Name */}
        <h3 className={`
          font-display font-bold text-center mb-2 truncate
          ${badge.isUnlocked ? 'text-matrix-glow' : 'text-bright'}
          ${sizeClasses.title}
        `}>
          {badge.name}
        </h3>

        {/* Description */}
        <p className={`
          text-center text-muted mb-3 line-clamp-2
          ${sizeClasses.description}
        `}>
          {badge.description}
        </p>

        {/* Tier & Rarity Badges */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className={`
            px-2 py-1 rounded-full text-xs font-semibold text-black
            ${TIER_COLORS[badge.tier]}
          `}>
            {badge.tier}
          </span>
          <span className={`
            px-2 py-1 rounded-full text-xs font-semibold text-white
            ${RARITY_COLORS[badge.rarity]}
          `}>
            {badge.rarity}
          </span>
        </div>

        {/* Points */}
        <div className={`
          text-center font-bold mb-3
          ${badge.isUnlocked ? 'text-matrix' : 'text-dim'}
          ${sizeClasses.points}
        `}>
          +{badge.points} pts
        </div>

        {/* Progress Bar */}
        {showProgress && !badge.isUnlocked && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted">
              <span>{formatBadgeProgress(badge)}</span>
              <span>{Math.floor(progress)}%</span>
            </div>
            <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
              <div
                className={`
                  h-full rounded-full transition-all duration-1000
                  ${isNearCompletion 
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 animate-scan-line-progress' 
                    : 'bg-gradient-to-r from-matrix-500 to-cyan-500'
                  }
                `}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Requirements (hover detail) */}
        {showProgress && badge.requirements.length > 0 && (
          <div className="mt-3 pt-3 border-t border-neutral-800">
            {badge.requirements.map(req => (
              <div key={req.id} className="flex justify-between text-xs text-muted mb-1">
                <span className="truncate mr-2">{req.description}</span>
                <span className="flex-shrink-0">
                  {req.progress}/{req.target}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Unlocked Date */}
      {badge.isUnlocked && badge.unlockedAt && (
        <div className="mt-3 pt-3 border-t border-matrix/30 text-center">
          <p className="text-xs text-dim">
            Unlocked {badge.unlockedAt.toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default BadgeCard;

