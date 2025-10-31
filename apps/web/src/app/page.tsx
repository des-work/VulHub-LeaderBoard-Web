'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth/context';
import { 
  Trophy, Users, Target, Award, Upload, BookOpen, LogOut
} from 'lucide-react';
import RippleGridV2 from '../components/RippleGrid/RippleGridV2';
import Leaderboard from '../components/leaderboard/Leaderboard';
import { LeaderboardPlayer } from '../components/leaderboard/LeaderboardRow';

// Mock leaderboard data
const LEADERBOARD_DATA: LeaderboardPlayer[] = [
  { id: 1, name: 'NeoYOU', points: 1820, level: 4, completed: 3, status: 'fire', trend: 'up', streak: 5, change: 120 },
  { id: 2, name: 'Trinity', points: 1710, level: 4, completed: 3, status: 'fire', trend: 'up', streak: 3, change: 95 },
  { id: 3, name: 'Morpheus', points: 1660, level: 4, completed: 2, status: 'close', trend: 'up', streak: 0, change: 45 },
  { id: 4, name: 'Oracle', points: 1600, level: 3, completed: 2, status: 'normal', trend: 'stable', streak: 0, change: 10 },
  { id: 5, name: 'Acid Burn', points: 1540, level: 3, completed: 3, status: 'normal', trend: 'stable', streak: 0, change: 5 },
  { id: 6, name: 'Zero Cool', points: 1490, level: 3, completed: 2, status: 'close', trend: 'up', streak: 0, change: 30 },
  { id: 7, name: 'Crash Override', points: 1450, level: 3, completed: 3, status: 'close', trend: 'down', streak: 0, change: -15 },
  { id: 8, name: 'The Architect', points: 1425, level: 3, completed: 1, status: 'close', trend: 'stable', streak: 0, change: 0 },
  { id: 9, name: 'Cypher', points: 1370, level: 3, completed: 1, status: 'normal', trend: 'stable', streak: 0, change: 2 },
  { id: 10, name: 'Tank', points: 1330, level: 3, completed: 3, status: 'close', trend: 'up', streak: 0, change: 20 },
  { id: 11, name: 'Dozer', points: 1290, level: 2, completed: 2, status: 'close', trend: 'stable', streak: 0, change: 0 },
  { id: 12, name: 'Root', points: 1260, level: 2, completed: 2, status: 'close', trend: 'down', streak: 0, change: -10 },
  { id: 13, name: 'Elliot Alderson', points: 1210, level: 2, completed: 1, status: 'close', trend: 'stable', streak: 0, change: 5 },
  { id: 14, name: 'Darlene', points: 1185, level: 2, completed: 3, status: 'close', trend: 'up', streak: 0, change: 25 },
  { id: 15, name: 'Lisbeth Salander', points: 1150, level: 2, completed: 2, status: 'close', trend: 'stable', streak: 0, change: 0 }
];

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-neutral-100 font-body flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xl text-neutral-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.replace('/auth');
  };

  // Find user's rank (for demo, assume user "Des" is rank 20 with 850 points)
  const userRank = 20;

  return (
    <div className="min-h-screen bg-black text-neutral-100 font-body relative">
      {/* RippleGrid Background */}
      <div className="fixed inset-0 z-0">
        <RippleGridV2
          enableRainbow={false}
          gridColor="#00ff00"
          rippleIntensity={0.03}
          gridSize={10}
          gridThickness={12}
          fadeDistance={1.5}
          vignetteStrength={1.6}
          glowIntensity={0.08}
          opacity={0.08}
          gridRotation={0}
          mouseInteraction={true}
          mouseInteractionRadius={1.2}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 layer-header header-surface">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center matrix-glow">
                <Trophy className="h-6 w-6 text-black" />
              </div>
              <h1 className="text-2xl font-display font-bold text-matrix-glow">VulHub Scoreboard</h1>
            </div>
            
            <nav className="flex items-center space-x-4">
              <button 
                className="matrix-button matrix-button-outline"
                onClick={() => router.push('/community')}
              >
                <Users className="h-4 w-4 mr-2" />
                Community
              </button>
              <button 
                className="matrix-button matrix-button-outline"
                onClick={() => router.push('/challenges')}
              >
                <Target className="h-4 w-4 mr-2" />
                Challenges
              </button>
              <button 
                className="matrix-button matrix-button-outline"
                onClick={() => router.push('/badges')}
              >
                <Award className="h-4 w-4 mr-2" />
                Badges
              </button>
              <button
                className="matrix-button matrix-button-outline"
                onClick={() => router.push('/submissions')}
              >
                <Upload className="h-4 w-4 mr-2" />
                Submissions
              </button>
              <button
                className="matrix-button matrix-button-outline"
                onClick={() => router.push('/resources')}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Resources
              </button>
              <button 
                className="matrix-button matrix-button-outline"
                onClick={() => router.push('/profile')}
              >
                <Users className="h-4 w-4 mr-2" />
                Profile
              </button>
              
              <div className="flex items-center space-x-3 pl-4 border-l border-matrix">
                <div className="text-right">
                  <div className="text-sm font-medium text-bright">{user.name}</div>
                  <div className="text-xs text-matrix">{user.points} pts</div>
                </div>
                <button 
                  className="matrix-button matrix-button-outline"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="layer-content container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Leaderboard */}
          <div className="lg:col-span-2">
            <Leaderboard
              players={LEADERBOARD_DATA}
              currentUserId={undefined} // Set to user.id if user is in leaderboard
              currentUserRank={userRank}
              currentUserName={user.name}
              currentUserPoints={user.points}
              maxDisplay={15}
            />
          </div>

          {/* Welcome Section */}
          <div className="space-y-6">
            <div className="matrix-card hover-lift animate-fade-in">
              <div className="matrix-card-header">
                <h2 className="text-xl font-display font-bold text-matrix">Welcome Back!</h2>
              </div>
              <div className="matrix-card-content">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 matrix-glow animate-matrix-pulse">
                      <span className="text-3xl font-bold text-white">{user.name.charAt(0)}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-bright">{user.name}</h3>
                    <p className="text-sm text-muted">{user.points} points • Level {user.role === 'admin' ? 'Admin' : 'Student'}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <button 
                      className="w-full matrix-button matrix-button-primary" 
                      onClick={() => router.push('/challenges')}
                    >
                      <Target className="h-4 w-4 mr-2" />
                      Start Competing
                    </button>
                    <button 
                      className="w-full matrix-button matrix-button-outline" 
                      onClick={() => router.push('/community')}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Join Community
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="matrix-card hover-lift animate-fade-in" style={{ animationDelay: '100ms' }}>
              <div className="matrix-card-header">
                <h2 className="text-xl font-display font-bold text-matrix">Quick Stats</h2>
              </div>
              <div className="matrix-card-content">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center rounded-lg p-4 row-surface hover-lift-subtle">
                    <div className="text-3xl font-display font-black text-matrix-glow">{user.points}</div>
                    <div className="text-sm text-muted">Points</div>
                  </div>
                  <div className="text-center rounded-lg p-4 row-surface hover-lift-subtle">
                    <div className="text-3xl font-display font-black text-matrix-glow">0</div>
                    <div className="text-sm text-muted">Challenges</div>
                  </div>
                  <div className="text-center rounded-lg p-4 row-surface hover-lift-subtle">
                    <div className="text-3xl font-display font-black text-matrix-glow">0</div>
                    <div className="text-sm text-muted">Badges</div>
                  </div>
                  <div className="text-center rounded-lg p-4 row-surface hover-lift-subtle">
                    <div className="text-3xl font-display font-black text-matrix-glow">1</div>
                    <div className="text-sm text-muted">Level</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
