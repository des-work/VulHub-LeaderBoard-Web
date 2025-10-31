/**
 * Custom 404 Not Found Page
 * 
 * Displayed when a route doesn't exist
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-neutral-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* 404 Card */}
        <div className="matrix-card p-8 text-center">
          {/* 404 Text */}
          <div className="mb-6">
            <h1 className="text-9xl font-bold text-matrix-glow mb-2 animate-pulse-slow">
              404
            </h1>
            <div className="h-1 w-32 bg-matrix mx-auto animate-glow-pulse"></div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-bright mb-3">
            Page Not Found
          </h2>

          {/* Description */}
          <p className="text-muted mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist in the matrix. It may have been moved, deleted, or never existed.
          </p>

          {/* Suggestions */}
          <div className="bg-matrix/10 border border-matrix/30 rounded-lg p-6 mb-8 text-left">
            <h3 className="text-lg font-semibold text-matrix-glow mb-3">
              What you can do:
            </h3>
            <ul className="space-y-2 text-muted">
              <li className="flex items-start gap-2">
                <span className="text-matrix mt-0.5">▸</span>
                <span>Check the URL for typos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-matrix mt-0.5">▸</span>
                <span>Go back to the previous page</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-matrix mt-0.5">▸</span>
                <span>Start from the home page</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-matrix mt-0.5">▸</span>
                <span>Search for what you need</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.back()}
              className="matrix-button matrix-button-outline flex items-center justify-center gap-2"
              aria-label="Go back to previous page"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
            <button
              onClick={() => router.push('/')}
              className="matrix-button matrix-button-primary flex items-center justify-center gap-2"
              aria-label="Go to home page"
            >
              <Home className="w-4 h-4" />
              Home Page
            </button>
            <button
              onClick={() => router.push('/challenges')}
              className="matrix-button matrix-button-outline flex items-center justify-center gap-2"
              aria-label="Browse challenges"
            >
              <Search className="w-4 w-4" />
              Browse Challenges
            </button>
          </div>

          {/* Matrix-themed decoration */}
          <div className="mt-8 pt-6 border-t border-matrix/30">
            <p className="text-xs text-dim font-mono">
              ERROR_CODE: 404_NOT_FOUND
            </p>
            <p className="text-xs text-dim font-mono mt-1">
              SYSTEM_STATUS: OPERATIONAL
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

