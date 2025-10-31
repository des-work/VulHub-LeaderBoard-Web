"use client";

import React, { useEffect } from 'react';
import { useAuth } from '../../lib/auth/context';
import { GradingProvider } from '../../lib/grading/context';
import { GradingDashboard } from '../../components/grading/GradingDashboard';
import { useRouter } from 'next/navigation';

export default function GradingPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

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

  if (!isAuthenticated) {
    return null;
  }

  const isGrader = user?.role === 'grader' || user?.role === 'admin';
  if (!isGrader) {
    return (
      <div className="min-h-screen bg-black text-neutral-100 font-body flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-400">Access Restricted</h1>
          <p className="text-neutral-400 mt-2">You need grading permissions to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 text-neutral-100">
      <GradingProvider>
        <GradingDashboard />
      </GradingProvider>
    </div>
  );
}
