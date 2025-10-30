"use client";

import React, { useEffect } from 'react';
import { useAuth } from '../../lib/auth/context';
import { GradingProvider } from '../../lib/grading/context';
import { GradingDashboard } from '../../components/grading/GradingDashboard';

export default function GradingPage() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth';
    }
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
