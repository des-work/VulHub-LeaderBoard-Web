"use client";

import React from 'react';
import { useAuth } from '../../lib/auth/context';
import { useRouter } from 'next/navigation';
import { User, Settings, Award, Target, ArrowLeft } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-neutral-100 font-body flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xl text-neutral-300">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-neutral-100 font-body layer-content">
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <button 
          onClick={() => router.push('/')}
          className="matrix-button matrix-button-outline mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-matrix-glow">Profile</h1>
          <p className="text-muted mt-2">Manage your account and view your progress</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Info */}
          <div className="matrix-card hover-lift">
            <div className="matrix-card-header">
              <h2 className="text-xl font-display font-bold text-matrix flex items-center">
                <User className="h-5 w-5 mr-2" />
                User Information
              </h2>
            </div>
            <div className="matrix-card-content">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted block mb-1">Name</label>
                  <p className="text-bright font-medium">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm text-muted block mb-1">School ID</label>
                  <p className="text-bright font-medium">{user.schoolId}</p>
                </div>
                <div>
                  <label className="text-sm text-muted block mb-1">Points</label>
                  <p className="text-matrix-glow text-2xl font-bold">{user.points || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="matrix-card hover-lift">
            <div className="matrix-card-header">
              <h2 className="text-xl font-display font-bold text-matrix flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Quick Actions
              </h2>
            </div>
            <div className="matrix-card-content">
              <div className="space-y-3">
                <button 
                  className="w-full matrix-button matrix-button-outline"
                  onClick={() => router.push('/badges')}
                >
                  <Award className="h-4 w-4 mr-2" />
                  View Badges
                </button>
                <button 
                  className="w-full matrix-button matrix-button-outline"
                  onClick={() => router.push('/challenges')}
                >
                  <Target className="h-4 w-4 mr-2" />
                  View Challenges
                </button>
                <button 
                  className="w-full matrix-button matrix-button-outline text-red-400 hover:text-red-300 hover:border-red-500/50"
                  onClick={logout}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}