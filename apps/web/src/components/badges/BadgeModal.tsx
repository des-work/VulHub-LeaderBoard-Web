/**
 * BadgeModal Component
 * 
 * Detailed modal view for a single badge
 */

import React from 'react';
import { Badge } from '../../lib/badges/types';
import { calculateBadgeProgress } from '../../lib/badges/utils';
import { TIER_COLORS, RARITY_COLORS, CATEGORY_ICONS } from '../../lib/badges/data';
import { X, Lock, Check, Trophy, Target } from 'lucide-react';

interface BadgeModalProps {
  badge: Badge | null;
  isOpen: boolean;
  onClose: () => void;
}

const BadgeModal: React.FC<BadgeModalProps> = ({ badge, isOpen, onClose }) => {
  if (!isOpen || !badge) return null;

  const progress = calculateBadgeProgress(badge);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl matrix-card animate-slide-up p-0 overflow-hidden">
        {/* Header */}
        <div className={`
          relative p-6 border-b border-neutral-800
          ${badge.isUnlocked ? 'bg-gradient-to-r from-matrix/10 to-cyan/10' : 'bg-neutral-900/50'}
        `}>
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted hover:text-bright transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Badge Icon */}
          <div className="text-center mb-4">
            <div className="text-8xl mb-2 inline-block relative">
              {badge.icon}
              {badge.isUnlocked && (
                <div className="absolute -top-2 -right-2 bg-matrix rounded-full p-2 animate-bounce-subtle">
                  <Check className="h-6 w-6 text-black" />
                </div>
              )}
              {!badge.isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full">
                  <Lock className="h-12 w-12 text-neutral-600" />
                </div>
              )}
            </div>
          </div>

          {/* Badge Name */}
          <h2 className={`
            text-3xl font-display font-bold text-center mb-2
            ${badge.isUnlocked ? 'text-matrix-glow' : 'text-bright'}
          `}>
            {badge.name}
          </h2>

          {/* Badges (Tier, Rarity, Category) */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className={`
              px-3 py-1 rounded-full text-sm font-semibold text-black
              ${TIER_COLORS[badge.tier]}
            `}>
              {badge.tier}
            </span>
            <span className={`
              px-3 py-1 rounded-full text-sm font-semibold text-white
              ${RARITY_COLORS[badge.rarity]}
            `}>
              {badge.rarity}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-neutral-800 text-bright border border-neutral-700">
              {CATEGORY_ICONS[badge.category]} {badge.category}
            </span>
          </div>

          {/* Points */}
          <div className="text-center">
            <span className={`
              text-2xl font-bold
              ${badge.isUnlocked ? 'text-matrix' : 'text-dim'}
            `}>
              +{badge.points} Points
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-lg font-display font-bold text-bright mb-2 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-matrix" />
              Description
            </h3>
            <p className="text-muted leading-relaxed">
              {badge.description}
            </p>
          </div>

          {/* Requirements */}
          <div>
            <h3 className="text-lg font-display font-bold text-bright mb-3 flex items-center gap-2">
              <Target className="h-5 w-5 text-matrix" />
              Requirements
            </h3>
            <div className="space-y-3">
              {badge.requirements.map(req => {
                const reqProgress = Math.min((req.progress / req.target) * 100, 100);
                const isComplete = req.progress >= req.target;

                return (
                  <div key={req.id} className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-semibold ${isComplete ? 'text-matrix' : 'text-bright'}`}>
                        {req.description}
                      </span>
                      {isComplete && <Check className="h-5 w-5 text-matrix" />}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-neutral-800 rounded-full h-2 overflow-hidden">
                        <div
                          className={`
                            h-full rounded-full transition-all duration-500
                            ${isComplete 
                              ? 'bg-matrix animate-scan-line-progress' 
                              : 'bg-gradient-to-r from-matrix-500 to-cyan-500'
                            }
                          `}
                          style={{ width: `${reqProgress}%` }}
                        />
                      </div>
                      <span className={`text-sm font-mono ${isComplete ? 'text-matrix' : 'text-muted'}`}>
                        {req.progress} / {req.target}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Overall Progress */}
          {!badge.isUnlocked && (
            <div className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-bright">Overall Progress</span>
                <span className="text-sm font-bold text-matrix">{Math.floor(progress)}%</span>
              </div>
              <div className="w-full bg-neutral-800 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-matrix-500 to-cyan-500 transition-all duration-1000 animate-scan-line-progress"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Unlock Info */}
          {badge.isUnlocked && badge.unlockedAt && (
            <div className="bg-matrix/10 rounded-lg p-4 border border-matrix/30 text-center">
              <p className="text-sm text-muted mb-1">Unlocked on</p>
              <p className="text-lg font-bold text-matrix-glow">
                {badge.unlockedAt.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-800 bg-neutral-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="matrix-button matrix-button-primary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BadgeModal;

