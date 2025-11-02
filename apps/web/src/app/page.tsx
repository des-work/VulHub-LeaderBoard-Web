'use client';

import React, { useEffect, Suspense, lazy } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth/context';
import { 
  Trophy, Users, Target, Award, Upload, BookOpen, LogOut
} from 'lucide-react';
import { PageLoader } from '../components/common/Loading';
import { useLeaderboard, useUserRank } from '../lib/data/hooks';
import { SkeletonList } from '../components/common/Loading';

// Lazy load heavy components for better initial load performance
const RippleGridV2 = lazy(() => import('../components/RippleGrid/RippleGridV2'));
const Leaderboard = lazy(() => import('../components/leaderboard/Leaderboard'));
const MobileMenu = lazy(() => import('../components/navigation/MobileMenu'));

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // Fetch leaderboard data - MUST be called unconditionally (React Hooks rule)
  const { data: leaderboardData, isLoading: isLoadingLeaderboard, error: leaderboardError } = useLeaderboard({ limit: 15 });
  
  // Fetch user's rank - MUST be called unconditionally (React Hooks rule)
  const { data: userRankData } = useUserRank(user?.id);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <PageLoader message="Loading leaderboard..." />;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.replace('/auth');
  };

  // Calculate user rank
  const userRank = (userRankData && typeof userRankData === 'object' && 'rank' in userRankData) 
    ? userRankData.rank 
    : (leaderboardData 
        ? leaderboardData.findIndex(p => String(p.id) === String(user?.id) || p.name === user?.name) + 1 
        : null);

  return (
    <div className="min-h-screen bg-black text-neutral-100 font-body relative">
      {/* RippleGrid Background - Lazy loaded */}
      <div className="fixed inset-0 z-0">
        <Suspense fallback={<div className="w-full h-full bg-black" />}>
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
        </Suspense>
      </div>

      {/* Header */}
      <header className="sticky top-0 layer-header header-surface responsive-header" role="banner">
        <div className="responsive-container">
          <div className="responsive-header-content">
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center matrix-glow"
                aria-hidden="true"
              >
                <Trophy className="h-6 w-6 text-black" />
              </div>
              <h1 className="responsive-text-xl font-display font-bold text-matrix-glow">VulHub Leaderboard</h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="responsive-header-nav" role="navigation" aria-label="Main navigation">
              <button 
                className="matrix-button matrix-button-outline"
                onClick={() => router.push('/community')}
                aria-label="Navigate to Community page"
              >
                <Users className="h-4 w-4 mr-2" />
                Community
              </button>
              <button 
                className="matrix-button matrix-button-outline"
                onClick={() => router.push('/challenges')}
                aria-label="Navigate to Challenges page"
              >
                <Target className="h-4 w-4 mr-2" aria-hidden="true" />
                Challenges
              </button>
              <button 
                className="matrix-button matrix-button-outline"
                onClick={() => router.push('/badges')}
                aria-label="Navigate to Badges page"
              >
                <Award className="h-4 w-4 mr-2" aria-hidden="true" />
                Badges
              </button>
              <button
                className="matrix-button matrix-button-outline"
                onClick={() => router.push('/submissions')}
                aria-label="Navigate to Submissions page"
              >
                <Upload className="h-4 w-4 mr-2" aria-hidden="true" />
                Submissions
              </button>
              <button
                className="matrix-button matrix-button-outline"
                onClick={() => router.push('/resources')}
                aria-label="Navigate to Resources page"
              >
                <BookOpen className="h-4 w-4 mr-2" aria-hidden="true" />
                Resources
              </button>
              <button 
                className="matrix-button matrix-button-outline"
                onClick={() => router.push('/profile')}
                aria-label="Navigate to Profile page"
              >
                <Users className="h-4 w-4 mr-2" aria-hidden="true" />
                Profile
              </button>
              
              <div className="flex items-center space-x-3 pl-4 border-l border-matrix" role="group" aria-label="User information and logout">
                <div className="text-right" aria-label="Current user">
                  <div className="text-sm font-medium text-bright">{user.name}</div>
                  <div className="text-xs text-matrix" aria-label={`${user.points} points`}>{user.points} pts</div>
                </div>
                <button 
                  className="matrix-button matrix-button-outline"
                  onClick={handleLogout}
                  aria-label="Logout from application"
                >
                  <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
                  Logout
                </button>
              </div>
            </nav>

            {/* Mobile Menu - Lazy loaded */}
            <Suspense fallback={null}>
              <MobileMenu 
                userName={user.name}
                userPoints={user.points}
                onLogout={handleLogout}
              />
            </Suspense>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="layer-content container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Leaderboard */}
          <div className="lg:col-span-2">
            {isLoadingLeaderboard ? (
              <SkeletonList items={15} />
            ) : leaderboardError ? (
              <div className="matrix-card p-6 text-center">
                <p className="text-error">Failed to load leaderboard. Please try again.</p>
              </div>
            ) : (
              <Suspense fallback={<SkeletonList items={15} />}>
                <Leaderboard
                  players={leaderboardData || []}
                  currentUserId={!isNaN(Number(user?.id)) ? Number(user?.id) : 0}
                  currentUserRank={userRank || undefined}
                  currentUserName={user.name}
                  currentUserPoints={user.points}
                  maxDisplay={15}
                />
              </Suspense>
            )}
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
