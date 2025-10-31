'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth/context';
import { Trophy, Users, Target, Award, Upload, BookOpen, LogOut } from 'lucide-react';
import RippleGridV2 from '../components/RippleGrid/RippleGridV2';

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    // Only redirect if we're sure the user is not authenticated
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading only during initial auth check
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

  // If not authenticated, don't render anything (redirect will happen)
  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.replace('/auth');
  };

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
            <div className="matrix-card hover-lift">
              <div className="matrix-card-header">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-matrix" />
                    <h2 className="text-xl font-display font-bold text-matrix">Live Rankings</h2>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full matrix-pulse" />
                    <span className="text-sm text-muted">LIVE</span>
                  </div>
                </div>
                <p className="text-sm text-muted mt-1">Top 15 Players</p>
              </div>
              <div className="matrix-card-content">
                <div className="space-y-2">
                  {[
                    { name: 'NeoYOU', points: 1820, level: 4, status: 'fire' },
                    { name: 'Trinity', points: 1710, level: 4, status: 'fire' },
                    { name: 'Morpheus', points: 1660, level: 4, status: 'close' },
                    { name: 'Oracle', points: 1600, level: 3, status: 'normal' },
                    { name: 'Acid Burn', points: 1540, level: 3, status: 'normal' },
                    { name: 'Zero Cool', points: 1490, level: 3, status: 'close' },
                    { name: 'Crash Override', points: 1450, level: 3, status: 'close' },
                    { name: 'The Architect', points: 1425, level: 3, status: 'close' },
                    { name: 'Cypher', points: 1370, level: 3, status: 'normal' },
                    { name: 'Tank', points: 1330, level: 3, status: 'close' },
                    { name: 'Dozer', points: 1290, level: 2, status: 'close' },
                    { name: 'Root', points: 1260, level: 2, status: 'close' },
                    { name: 'Elliot Alderson', points: 1210, level: 2, status: 'close' },
                    { name: 'Darlene', points: 1185, level: 2, status: 'close' },
                    { name: 'Lisbeth Salander', points: 1150, level: 2, status: 'close' }
                  ].map((player, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg row-surface hover-lift-subtle">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-matrix">#{index + 1}</span>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-white">{player.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-bright">{player.name}</h3>
                          <p className="text-sm text-muted">Level {player.level} • {Math.floor(Math.random() * 3) + 1} completed</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {player.status === 'fire' && (
                          <div className="flex items-center space-x-1 bg-red-500/20 px-2 py-1 rounded">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-xs text-red-400">Fire</span>
                          </div>
                        )}
                        {player.status === 'close' && (
                          <div className="flex items-center space-x-1 bg-yellow-500/20 px-2 py-1 rounded">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                            <span className="text-xs text-yellow-400">Close</span>
                          </div>
                        )}
                        <div className="text-right">
                          <div className="text-lg font-bold text-matrix">{player.points.toLocaleString()}</div>
                          <div className="text-xs text-muted">points</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Section */}
          <div className="space-y-6">
            <div className="matrix-card hover-lift">
              <div className="matrix-card-header">
                <h2 className="text-xl font-display font-bold text-matrix">Welcome Back!</h2>
              </div>
              <div className="matrix-card-content">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 matrix-glow">
                      <span className="text-2xl font-bold text-white">{user.name.charAt(0)}</span>
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

            <div className="matrix-card hover-lift">
              <div className="matrix-card-header">
                <h2 className="text-xl font-display font-bold text-matrix">Quick Stats</h2>
              </div>
              <div className="matrix-card-content">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center rounded-lg p-3 row-surface hover-lift-subtle">
                    <div className="text-2xl font-bold text-matrix">{user.points}</div>
                    <div className="text-sm text-muted">Points</div>
                  </div>
                  <div className="text-center rounded-lg p-3 row-surface hover-lift-subtle">
                    <div className="text-2xl font-bold text-matrix">0</div>
                    <div className="text-sm text-muted">Challenges</div>
                  </div>
                  <div className="text-center rounded-lg p-3 row-surface hover-lift-subtle">
                    <div className="text-2xl font-bold text-matrix">0</div>
                    <div className="text-sm text-muted">Badges</div>
                  </div>
                  <div className="text-center rounded-lg p-3 row-surface hover-lift-subtle">
                    <div className="text-2xl font-bold text-matrix">1</div>
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