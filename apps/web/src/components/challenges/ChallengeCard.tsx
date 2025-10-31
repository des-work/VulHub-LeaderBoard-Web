/**
 * ChallengeCard Component
 * 
 * Individual challenge display card with details and actions
 */

import React from 'react';
import { Challenge } from '../../lib/challenges/types';
import { getDifficultyColor, getDifficultyBg, getRouteInfo } from '../../lib/challenges/utils';
import { Flame, Tag, ExternalLink, Play } from 'lucide-react';

interface ChallengeCardProps {
  challenge: Challenge;
  onStart?: (challenge: Challenge) => void;
  showRoutes?: boolean;
  showTags?: boolean;
  animated?: boolean;
  animationDelay?: number;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onStart,
  showRoutes = true,
  showTags = true,
  animated = true,
  animationDelay = 0
}) => {
  const difficultyColor = getDifficultyColor(challenge.difficulty);
  const difficultyBg = getDifficultyBg(challenge.difficulty);

  return (
    <div
      className={`
        matrix-card hover-lift cursor-pointer transition-all
        ${animated ? 'animate-fade-in animate-slide-up' : ''}
      `}
      style={animated ? { animationDelay: `${animationDelay}ms` } : undefined}
    >
      {/* Header */}
      <div className="matrix-card-header">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display font-bold text-matrix text-lg flex-1">
            {challenge.title}
          </h3>
          <div className="flex items-center gap-1 text-yellow-400 flex-shrink-0">
            <Flame className="h-4 w-4" />
            <span className="text-sm font-bold">{challenge.defaultPoints}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="matrix-card-content space-y-3">
        {/* Category & CVE */}
        <div className="text-sm text-muted">
          <span className="text-bright">{challenge.category}</span>
          {challenge.cve && (
            <>
              <span className="mx-2">•</span>
              <span className="text-matrix font-mono">{challenge.cve}</span>
            </>
          )}
        </div>

        {/* Difficulty Badge */}
        <div>
          <span className={`
            inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border
            ${difficultyBg} ${difficultyColor}
          `}>
            {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
          </span>
        </div>

        {/* Routes */}
        {showRoutes && challenge.routeIds.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {challenge.routeIds.map(routeId => {
              const route = getRouteInfo(routeId);
              return (
                <span
                  key={routeId}
                  className={`
                    inline-flex items-center px-2 py-1 rounded-full text-xs
                    bg-${route.color}-500/10 text-${route.color}-300 border border-${route.color}-500/30
                  `}
                >
                  <span className="mr-1">{route.icon}</span>
                  {route.label}
                </span>
              );
            })}
          </div>
        )}

        {/* Tags */}
        {showTags && challenge.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {challenge.tags.slice(0, 4).map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-neutral-800 text-bright border border-matrix/30"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
            {challenge.tags.length > 4 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs text-dim">
                +{challenge.tags.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* VulHub Link */}
        <a
          href={challenge.vulhub.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-matrix hover:text-matrix-bright transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <span>View VulHub Docs</span>
          <ExternalLink className="h-3 w-3" />
        </a>

        {/* Start Button */}
        <button
          onClick={() => onStart?.(challenge)}
          className="matrix-button matrix-button-primary w-full flex items-center justify-center gap-2"
        >
          <Play className="h-4 w-4" />
          <span>Start Challenge</span>
        </button>
      </div>
    </div>
  );
};

export default ChallengeCard;

