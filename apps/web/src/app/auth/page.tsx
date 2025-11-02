'use client';

/**
 * PROGRESSIVE AUTH PAGE - Features Added Incrementally
 * Version 2: Added animation with error handling
 */

import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '../../lib/auth/context';
import { useRouter } from 'next/navigation';
import type { AnimationPhase } from '../../lib/auth/animation-types';
import { logger } from '../../lib/logging/logger';

// Lazy load Canvas-based animation component with better error handling
const CastleSiegeAnimation = React.lazy(() => {
  return import('../../components/auth/CastleSiegeAnimation/index')
    .then(module => ({ default: module.default }))
    .catch(error => {
      logger.error('Failed to load CastleSiegeAnimation:', error);
      return {
        default: () => (
          <div className="flex items-center justify-center h-full text-red-400 font-mono text-sm">
            <div className="text-center">
              <div className="text-lg mb-2">⚠️ Animation Error</div>
              <div className="text-xs">Check console for details</div>
            </div>
          </div>
        )
      };
    });
});

export default function AuthPage() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>('intro');
  const [showForm, setShowForm] = useState(false);
  const [animationFadingOut, setAnimationFadingOut] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, router]);

  // Handle animation completion
  const handleAnimationComplete = () => {
    setAnimationFadingOut(true);
    setTimeout(() => {
      setAnimationPhase('idle');
      setShowForm(true);
    }, 800);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login({ email, password });
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#000',
        color: '#0f0',
        fontFamily: 'monospace',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Show animation first, then form
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#0f0',
      fontFamily: 'monospace',
      position: 'relative'
    }}>
      {/* Animation - Show first */}
      {animationPhase === 'intro' && !showForm && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: animationFadingOut ? 0 : 1,
            transition: 'opacity 0.8s',
            pointerEvents: animationFadingOut ? 'none' : 'auto',
            backgroundColor: 'rgba(0, 0, 0, 0.95)'
          }}
        >
          <Suspense fallback={
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="text-center">
                <div className="text-green-400 font-mono text-lg mb-2">
                  Loading VulHub Animation...
                </div>
                <div className="w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-cyan-500 animate-pulse" />
                </div>
              </div>
            </div>
          }>
            <CastleSiegeAnimation
              phase={animationPhase}
              onComplete={handleAnimationComplete}
              debug={process.env.NODE_ENV === 'development'}
            />
          </Suspense>
        </div>
      )}

      {/* Form - Show after animation */}
      {showForm && (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 100,
          position: 'relative'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '400px',
            padding: '32px',
            border: '2px solid #0f0',
            borderRadius: '8px',
            backgroundColor: 'rgba(0, 255, 0, 0.05)'
          }}>
        <h1 style={{
          fontSize: '32px',
          marginBottom: '8px',
          textAlign: 'center',
          textShadow: '0 0 10px rgba(0, 255, 0, 0.5)'
        }}>
          VulHub Leaderboard
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#888',
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          Master cybersecurity through competition
        </p>

        {error && (
          <div style={{
            padding: '12px',
            marginBottom: '16px',
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            border: '1px solid #f00',
            color: '#f00',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px'
            }}>
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#111',
                border: '1px solid #0f0',
                color: '#0f0',
                fontFamily: 'monospace',
                fontSize: '14px',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
              placeholder="your@email.com"
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px'
            }}>
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#111',
                border: '1px solid #0f0',
                color: '#0f0',
                fontFamily: 'monospace',
                fontSize: '14px',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: isSubmitting ? '#555' : '#0f0',
              color: '#000',
              border: 'none',
              fontFamily: 'monospace',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              borderRadius: '4px',
              boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)',
              transition: 'all 0.3s'
            }}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
          </div>
        </div>
      )}
    </div>
  );
}