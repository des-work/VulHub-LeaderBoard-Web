/**
 * Leaderboard Component
 * 
 * Main container for displaying rankings
 */

import React from 'react';
import { Trophy, Activity } from 'lucide-react';
import LeaderboardRow, { LeaderboardPlayer } from './LeaderboardRow';
import UserRankCard from './UserRankCard';

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
}) => {
  const displayedPlayers = players.slice(0, maxDisplay);
  const maxPoints = players[0]?.points || 1;
  const userInTopList = currentUserId && displayedPlayers.some(p => p.id === currentUserId);
  const showUserCard = currentUserRank && currentUserRank > maxDisplay && !userInTopList;

  return (
    <div className="matrix-card hover-lift">
      {/* Header */}
      <div className="matrix-card-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-matrix animate-matrix-pulse" />
            <div>
              <h2 className="text-2xl font-display font-black text-hero tracking-tight">
                {title}
              </h2>
              <p className="text-sm text-muted mt-0.5 flex items-center gap-2">
                <Activity className="h-3 w-3" />
                <span>{subtitle}</span>
              </p>
            </div>
          </div>
          
          {showLiveIndicator && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-bold text-red-400 uppercase tracking-wider">
                LIVE
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Player List */}
      <div className="matrix-card-content">
        <div className="space-y-3">
          {displayedPlayers.map((player, index) => (
            <LeaderboardRow
              key={player.id}
              player={player}
              rank={index + 1}
              maxPoints={maxPoints}
              isCurrentUser={player.id === currentUserId}
              animationDelay={index * 50}
            />
          ))}
        </div>
        
        {/* User's Rank Card (if outside top list) */}
        {showUserCard && currentUserName && currentUserPoints && (
          <UserRankCard
            rank={currentUserRank!}
            name={currentUserName}
            points={currentUserPoints}
          />
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
