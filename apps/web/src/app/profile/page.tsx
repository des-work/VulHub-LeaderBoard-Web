'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../lib/auth/context';
import { useRouter } from 'next/navigation';
import { useNotification } from '../../lib/notifications/context';
import {
  User,
  Settings,
  Award,
  Target,
  ArrowLeft,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader,
  TrendingUp,
  Calendar,
  Clock,
  Trophy,
  Zap,
} from 'lucide-react';
import RippleGridV2 from '../../components/RippleGrid/RippleGridV2';
import { SubmissionApi } from '../../lib/api/endpoints';
import { Submission } from '../../lib/auth/types';
import { ErrorAlert } from '../../components/ErrorAlert';
import { PageLoader } from '../../components/common/Loading';

interface UserStats {
  totalSubmissions: number;
  approvedSubmissions: number;
  rejectedSubmissions: number;
  pendingSubmissions: number;
  averageScore: number;
  longestStreak: number;
}

export default function ProfilePage() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const { notify } = useNotification();

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingState, setLoadingState] = useState({
    isLoading: true,
    error: '',
  });

  // Load user data
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth');
      return;
    }

    const loadUserData = async () => {
      try {
        setLoadingState({ isLoading: true, error: '' });

        // Fetch user's submissions
        const userSubmissions = await SubmissionApi.getUserSubmissions(user?.id || '');
        setSubmissions(userSubmissions);
      } catch (err: any) {
        setLoadingState({ isLoading: false, error: err.message || 'Failed to load profile data' });
        notify({
          type: 'error',
          title: 'Error Loading Profile',
          message: err.message || 'Failed to load your profile data',
          duration: 'medium',
          read: false,
        });
      } finally {
        setLoadingState(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadUserData();
  }, [isAuthenticated, user?.id, router, notify]);

  // Compute stats from submissions (useMemo instead of useEffect)
  const stats = useMemo<UserStats | null>(() => {
    if (submissions.length === 0) {
      return null;
    }

    const scoredSubmissions = submissions.filter(s => s.pointsAwarded && s.pointsAwarded > 0);
    const averageScore = scoredSubmissions.length > 0
      ? Math.round(
          scoredSubmissions.reduce((sum, s) => sum + (s.pointsAwarded || 0), 0) / scoredSubmissions.length
        )
      : 0;

    return {
      totalSubmissions: submissions.length,
      approvedSubmissions: submissions.filter(s => s.status === 'approved').length,
      rejectedSubmissions: submissions.filter(s => s.status === 'rejected').length,
      pendingSubmissions: submissions.filter(s => s.status === 'pending').length,
      averageScore,
      longestStreak: calculateStreak(submissions),
    };
  }, [submissions]);

  const calculateStreak = (subs: Submission[]): number => {
    // Simple streak calculation - number of consecutive approved submissions
    if (subs.length === 0) {return 0;}

    let streak = 0;
    for (let i = 0; i < Math.min(5, subs.length); i++) {
      if (subs[i].status === 'approved') {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const getSubmissionIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'pending':
      case 'under_review':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'needs_revision':
        return <AlertCircle className="h-4 w-4 text-orange-400" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-300';
      case 'rejected':
        return 'text-red-300';
      case 'pending':
      case 'under_review':
        return 'text-yellow-300';
      case 'needs_revision':
        return 'text-orange-300';
      default:
        return 'text-gray-300';
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-neutral-100 font-body relative">
      {/* RippleGrid Background */}
      <div className="fixed inset-0 z-0">
        <RippleGridV2
          enableRainbow={false}
          gridColor="#00ff00"
          rippleIntensity={0.05}
          gridSize={10}
          gridThickness={15}
          fadeDistance={1.5}
          vignetteStrength={2.0}
          glowIntensity={0.1}
          opacity={0.3}
          gridRotation={0}
          mouseInteraction={true}
          mouseInteractionRadius={1.2}
        />
      </div>

      {/* Header */}
      <div className="sticky top-0 layer-header header-surface z-40">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/')}
            className="matrix-button matrix-button-outline mb-4 flex items-center space-x-2"
            aria-label="Back to home"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </button>
          <h1 className="text-3xl font-display font-bold text-matrix-glow">
            My Profile
          </h1>
          <p className="text-muted mt-1">Manage your account and view your progress</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="layer-content container mx-auto px-4 py-6">
        {loadingState.error && (
          <ErrorAlert error={loadingState.error} variant="error" />
        )}

        {loadingState.isLoading ? (
          <div className="text-center py-12">
            <PageLoader message="Loading profile..." />
          </div>
        ) : (
          <>
            {/* User Profile Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Main Info */}
              <div className="lg:col-span-2 matrix-card">
                <h2 className="text-xl font-display font-bold text-bright mb-4 flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>User Information</span>
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted mb-1">Name</p>
                    <p className="text-lg font-semibold text-bright">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted mb-1">Email</p>
                    <p className="text-lg font-semibold text-bright">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted mb-1">Role</p>
                    <p className="text-lg font-semibold text-matrix capitalize">{user.role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted mb-1">Status</p>
                    <p className="text-lg font-semibold text-green-400">Active</p>
                  </div>
                </div>
              </div>

              {/* Points Card */}
              <div className="matrix-card bg-matrix/5 border-matrix/30">
                <div className="flex flex-col items-center justify-center h-full">
                  <Trophy className="h-12 w-12 text-matrix-glow mb-2" />
                  <p className="text-sm text-muted mb-1">Total Points</p>
                  <p className="text-4xl font-bold text-matrix-glow">{user.points || 0}</p>
                  <p className="text-xs text-dim mt-2">Earned from submissions</p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="matrix-card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-dim">Total Submissions</p>
                      <p className="text-2xl font-bold text-bright">{stats.totalSubmissions}</p>
                    </div>
                    <FileText className="h-8 w-8 text-matrix opacity-50" />
                  </div>
                </div>

                <div className="matrix-card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-dim">Approved</p>
                      <p className="text-2xl font-bold text-green-400">{stats.approvedSubmissions}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-400 opacity-50" />
                  </div>
                </div>

                <div className="matrix-card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-dim">Pending</p>
                      <p className="text-2xl font-bold text-yellow-400">{stats.pendingSubmissions}</p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-400 opacity-50" />
                  </div>
                </div>

                <div className="matrix-card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-dim">Current Streak</p>
                      <p className="text-2xl font-bold text-matrix">{stats.longestStreak}</p>
                    </div>
                    <Zap className="h-8 w-8 text-matrix opacity-50" />
                  </div>
                </div>
              </div>
            )}

            {/* Recent Submissions */}
            <div className="matrix-card mb-6">
              <h2 className="text-xl font-display font-bold text-bright mb-4 flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Recent Submissions</span>
              </h2>

              {submissions.length === 0 ? (
                <p className="text-dim text-center py-8">No submissions yet. Start by submitting a challenge proof!</p>
              ) : (
                <div className="space-y-2">
                  {submissions.slice(0, 5).map(sub => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between p-3 bg-neutral-800/50 rounded border border-neutral-700 hover:border-matrix/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        {getSubmissionIcon(sub.status)}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-bright truncate">
                            {(sub as any).challengeName || 'Unknown Challenge'}
                          </p>
                          <p className="text-xs text-dim">
                            {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        {sub.pointsAwarded && (
                          <span className="text-sm font-semibold text-matrix-glow">
                            +{sub.pointsAwarded} pts
                          </span>
                        )}
                        <span className={`text-xs font-semibold capitalize ${getStatusColor(sub.status)}`}>
                          {sub.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => router.push('/submissions')}
                className="matrix-card hover-lift p-6 text-left cursor-pointer transition-all"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <FileText className="h-6 w-6 text-matrix" />
                  <h3 className="font-semibold text-bright">Submit Challenge</h3>
                </div>
                <p className="text-sm text-dim">Upload proof of your challenge completion</p>
              </button>

              <button
                onClick={() => router.push('/')}
                className="matrix-card hover-lift p-6 text-left cursor-pointer transition-all"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <Trophy className="h-6 w-6 text-matrix" />
                  <h3 className="font-semibold text-bright">View Leaderboard</h3>
                </div>
                <p className="text-sm text-dim">See how you rank against other students</p>
              </button>

              <button
                onClick={logout}
                className="matrix-card hover-lift p-6 text-left cursor-pointer transition-all hover:bg-red-500/10 hover:border-red-500/30"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <Settings className="h-6 w-6 text-red-400" />
                  <h3 className="font-semibold text-red-300">Sign Out</h3>
                </div>
                <p className="text-sm text-dim">End your session securely</p>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}