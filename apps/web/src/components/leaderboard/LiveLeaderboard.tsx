'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@vulhub/ui';
import { Badge } from '@vulhub/ui';
import { Avatar } from '@vulhub/ui';
import { UnifiedIcon, Terminology, VisualEffect } from '@vulhub/ui';
import { Trophy, Medal, Crown, Star, TrendingUp, RefreshCw } from 'lucide-react';

interface LeaderboardEntry {
  userId: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  totalScore: number;
  rank: number;
  badges: number;
  isOnline: boolean;
  lastActivity: string;
}

interface LiveLeaderboardProps {
  className?: string;
}

export function LiveLeaderboard({ className = '' }: LiveLeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate real-time data updates
    const loadLeaderboard = () => {
      const mockData: LeaderboardEntry[] = [
        {
          userId: '1',
          firstName: 'Alice',
          lastName: 'Johnson',
          avatarUrl: '/avatars/alice.jpg',
          totalScore: 1250,
          rank: 1,
          badges: 8,
          isOnline: true,
          lastActivity: '2 min ago',
        },
        {
          userId: '2',
          firstName: 'Bob',
          lastName: 'Smith',
          totalScore: 1180,
          rank: 2,
          badges: 7,
          isOnline: true,
          lastActivity: '5 min ago',
        },
        {
          userId: '3',
          firstName: 'Carol',
          lastName: 'Davis',
          totalScore: 1100,
          rank: 3,
          badges: 6,
          isOnline: false,
          lastActivity: '1 hour ago',
        },
        {
          userId: '4',
          firstName: 'David',
          lastName: 'Wilson',
          totalScore: 1050,
          rank: 4,
          badges: 5,
          isOnline: true,
          lastActivity: '3 min ago',
        },
        {
          userId: '5',
          firstName: 'Eve',
          lastName: 'Brown',
          totalScore: 980,
          rank: 5,
          badges: 4,
          isOnline: false,
          lastActivity: '30 min ago',
        },
      ];
      
      setLeaderboard(mockData);
      setIsLoading(false);
    };

    loadLeaderboard();
    
    // Update every 30 seconds to simulate live data
    const interval = setInterval(loadLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-400" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-green-400 font-mono font-bold">#{rank}</span>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 1200) return 'text-green-400';
    if (score >= 1000) return 'text-yellow-400';
    if (score >= 800) return 'text-orange-400';
    return 'text-red-400';
  };

  if (isLoading) {
    return (
      <div className={`${className}`}>
        <Card className="bg-black/80 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-green-400 font-mono flex items-center">
              <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
              <Terminology>Loading Live Rankings...</Terminology>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-3 bg-gray-900/50 rounded animate-pulse">
                  <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                  </div>
                  <div className="w-16 h-6 bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <Card className="bg-black/80 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 font-mono flex items-center justify-between">
            <div className="flex items-center">
              <Trophy className="h-6 w-6 mr-3" />
              <Terminology>Live Rankings</Terminology>
            </div>
            <div className="flex items-center text-sm text-green-500">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <Terminology>Live</Terminology>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.userId}
                className={`flex items-center space-x-4 p-3 rounded transition-all duration-300 hover:bg-green-500/10 ${
                  index < 3 ? 'bg-green-500/5 border border-green-500/20' : 'bg-gray-900/30'
                }`}
              >
                {/* Rank */}
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(entry.rank)}
                </div>

                {/* Avatar */}
                <div className="relative">
                  <Avatar className="w-10 h-10 border-2 border-green-500/50">
                    {entry.avatarUrl ? (
                      <img src={entry.avatarUrl} alt={`${entry.firstName} ${entry.lastName}`} />
                    ) : (
                      <div className="w-full h-full bg-green-500/20 flex items-center justify-center text-green-400 font-mono font-bold">
                        {entry.firstName[0]}{entry.lastName[0]}
                      </div>
                    )}
                  </Avatar>
                  {entry.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-green-400 font-mono font-medium truncate">
                      {entry.firstName} {entry.lastName}
                    </h3>
                    {entry.badges > 0 && (
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/50">
                        {entry.badges} <Terminology>badges</Terminology>
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 font-mono">
                    <Terminology>Last active:</Terminology> {entry.lastActivity}
                  </p>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className={`text-lg font-mono font-bold ${getScoreColor(entry.totalScore)}`}>
                    {entry.totalScore.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                    <Terminology>points</Terminology>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="mt-6 pt-4 border-t border-green-500/20">
            <button className="w-full py-2 px-4 bg-green-500/10 hover:bg-green-500/20 border border-green-500/50 rounded text-green-400 font-mono transition-all duration-300 hover:border-green-500">
              <Terminology>View Full Leaderboard</Terminology>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
