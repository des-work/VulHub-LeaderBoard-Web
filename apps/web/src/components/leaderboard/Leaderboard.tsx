/**
 * Leaderboard Component
 * 
 * Main container for displaying rankings
 * Uses centralized config for full customization
 */

import React from 'react';
import { Trophy, Activity } from 'lucide-react';
import LeaderboardRow, { LeaderboardPlayer } from './LeaderboardRow';
import UserRankCard from './UserRankCard';
import {
  LEADERBOARD_CONTAINER_CONFIG,
  LEADERBOARD_COLORS,
  LEADERBOARD_TYPOGRAPHY,
  LEADERBOARD_SIZING,
} from '../../lib/leaderboard/config';
import {
  createLiveIndicatorPulse,
} from '../../lib/leaderboard/utils';

interface LeaderboardProps {
  players: LeaderboardPlayer[];
  currentUserId?: number;
  currentUserRank?: number;
  currentUserName?: string;
  currentUserPoints?: number;
  title?: string;
  subtitle?: string;
  showLiveIndicator?: boolean;
  maxDisplay?: number;
  className?: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  players,
  currentUserId,
  currentUserRank,
  currentUserName,
  currentUserPoints,
  title = 'Live Rankings',
  subtitle = 'Top 15 Players • Updated in real-time',
  showLiveIndicator = true,
  maxDisplay = 15,
  className = '',
}) => {
  const displayedPlayers = players.slice(0, maxDisplay);
  const maxPoints = players[0]?.points || 1;
  const userInTopList = currentUserId && displayedPlayers.some(p => p.id === currentUserId);
  const showUserCard = currentUserRank && currentUserRank > maxDisplay && !userInTopList;
  const cardConfig = LEADERBOARD_CONTAINER_CONFIG.card;
  const headerConfig = LEADERBOARD_CONTAINER_CONFIG.header;
  const liveConfig = LEADERBOARD_CONTAINER_CONFIG.liveIndicator;

  return (
    <div 
      className={`hover-lift ${className}`}
      style={{
        backgroundColor: cardConfig.backgroundColor,
        borderColor: cardConfig.borderColor,
        borderWidth: cardConfig.borderWidth,
        borderRadius: cardConfig.borderRadius,
        boxShadow: cardConfig.shadow,
        borderStyle: 'solid',
      }}
    >
      {/* Header */}
      <div 
        style={{
          padding: cardConfig.padding,
          marginBottom: headerConfig.marginBottom,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy 
              className="animate-matrix-pulse" 
              style={{ 
                width: headerConfig.iconSize, 
                height: headerConfig.iconSize,
                color: LEADERBOARD_COLORS.matrix.primary,
              }}
            />
            <div>
              <h2 
                className="font-display font-black tracking-tight"
                style={{
                  fontSize: '1.5rem',
                  color: headerConfig.titleColor,
                  fontWeight: LEADERBOARD_TYPOGRAPHY.weights.black,
                  letterSpacing: LEADERBOARD_TYPOGRAPHY.tracking.tight,
                }}
              >
                {title}
              </h2>
              <p 
                className="flex items-center gap-2 mt-0.5"
                style={{
                  fontSize: LEADERBOARD_TYPOGRAPHY.sizes.label.medium,
                  color: headerConfig.subtitleColor,
                }}
              >
                <Activity 
                  style={{ 
                    width: '0.75rem', 
                    height: '0.75rem',
                  }}
                />
                <span>{subtitle}</span>
              </p>
            </div>
          </div>
          
          {showLiveIndicator && (
            <div 
              className="flex items-center gap-2 px-3 py-1.5"
              style={{
                backgroundColor: liveConfig.backgroundColor,
                borderColor: liveConfig.borderColor,
                borderWidth: '1px',
                borderStyle: 'solid',
                borderRadius: liveConfig.borderRadius,
              }}
            >
              <div 
                className={liveConfig.pulseEffect ? 'animate-pulse' : ''}
                style={{
                  width: liveConfig.dotSize,
                  height: liveConfig.dotSize,
                  backgroundColor: liveConfig.dotColor,
                  borderRadius: '50%',
                  ...(liveConfig.pulseEffect ? createLiveIndicatorPulse() : {}),
                }}
              />
              <span 
                className="font-bold uppercase tracking-wider"
                style={{
                  fontSize: LEADERBOARD_TYPOGRAPHY.sizes.label.medium,
                  color: liveConfig.textColor,
                  fontWeight: LEADERBOARD_TYPOGRAPHY.weights.bold,
                  letterSpacing: LEADERBOARD_TYPOGRAPHY.tracking.wider,
                }}
              >
                LIVE
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Player List */}
      <div 
        style={{
          padding: `0 ${cardConfig.padding} ${cardConfig.padding}`,
        }}
      >
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: LEADERBOARD_CONTAINER_CONFIG.list.gap,
          }}
        >
          {displayedPlayers.map((player, index) => (
            <LeaderboardRow
              key={player.id}
              player={player}
              rank={index + 1}
              maxPoints={maxPoints}
              isCurrentUser={player.id === currentUserId}
            />
          ))}
        </div>
        
        {/* User's Rank Card (if outside top list) */}
        {showUserCard && currentUserName && currentUserPoints && (
          <div className="mt-4">
            <UserRankCard
              rank={currentUserRank!}
              name={currentUserName}
              points={currentUserPoints}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
