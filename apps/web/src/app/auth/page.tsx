'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth/context';
import { useRouter } from 'next/navigation';
import CastleSiegeAnimation from '../../components/auth/CastleSiegeAnimation';
import type { AnimationPhase } from '../../lib/auth/animation-types';
import { useValidation } from '../../lib/validation/useValidation';
import { authSchemas, validators } from '../../lib/validation/schemas';
import { loginRateLimiter, registerRateLimiter, RateLimitError } from '../../lib/security/rate-limiter';

export default function AuthPage() {
  const { isAuthenticated, isLoading, login, register } = useAuth();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>('intro');
  const [showForm, setShowForm] = useState(false);
  const [animationFadingOut, setAnimationFadingOut] = useState(false);
  
  // Validation hooks
  const loginValidation = useValidation(authSchemas.login);
  const registerValidation = useValidation(authSchemas.register);

  // Animation plays every time for brand impact
  // Users can skip it if they prefer, but it should always show by default

  useEffect(() => {
    // If already authenticated, redirect to home
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  // Handle animation completion with smooth transition
  const handleAnimationComplete = () => {
    // Start fade out
    setAnimationFadingOut(true);
    
    // After fade out, show form
    setTimeout(() => {
      setAnimationPhase('idle');
      setShowForm(true);
    }, 800); // 800ms fade out
  };

  // Handle skip with smooth transition
  const handleSkipAnimation = () => {
    setAnimationFadingOut(true);
    
    setTimeout(() => {
      setAnimationPhase('idle');
      setShowForm(true);
    }, 500); // Faster skip transition
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Check rate limit
    if (!loginRateLimiter.check()) {
      setError(`Too many login attempts. Please wait ${loginRateLimiter.getResetTime()}.`);
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const schoolId = formData.get('schoolId') as string;
    const password = formData.get('password') as string;

    // Sanitize inputs
    const sanitizedData = {
      email: validators.sanitizeHtml(schoolId),
      password: password, // Don't sanitize password, but validate length
    };

    // Validate inputs
    if (!loginValidation.validateAll(sanitizedData)) {
      const firstError = Object.values(loginValidation.errors)[0];
      setError(firstError || 'Please check your inputs');
      setIsSubmitting(false);
      return;
    }

    // Increment rate limit
    loginRateLimiter.increment();

    try {
      await login({ schoolId: sanitizedData.email, password });
      // Redirect will happen automatically via useEffect
      // Reset rate limit on successful login
      loginRateLimiter.reset();
    } catch (error: any) {
      setError(error?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Check rate limit
    if (!registerRateLimiter.check()) {
      setError(`Too many registration attempts. Please wait ${registerRateLimiter.getResetTime()}.`);
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const schoolId = formData.get('schoolId') as string;
    const name = formData.get('name') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Check password match first
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    // Sanitize inputs
    const sanitizedData = {
      email: validators.sanitizeHtml(schoolId),
      username: validators.sanitizeHtml(name),
      password: password,
    };

    // Validate inputs
    if (!registerValidation.validateAll(sanitizedData)) {
      const firstError = Object.values(registerValidation.errors)[0];
      setError(firstError || 'Please check your inputs');
      setIsSubmitting(false);
      return;
    }

    // Increment rate limit
    registerRateLimiter.increment();

    try {
      await register({ 
        schoolId: sanitizedData.email, 
        name: sanitizedData.username, 
        password, 
        confirmPassword 
      });
      // Redirect will happen automatically via useEffect
      // Reset rate limit on successful registration
      registerRateLimiter.reset();
    } catch (error: any) {
      setError(error?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't show anything if already authenticated (redirect will happen)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
      {/* Epic Castle Siege Animation with fade out */}
      <div 
        className={`transition-opacity duration-700 ${
          animationFadingOut ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <CastleSiegeAnimation 
          phase={animationPhase} 
          onComplete={handleAnimationComplete}
        />
      </div>

      {/* Skip Animation Button - Enhanced design */}
      {animationPhase === 'intro' && !animationFadingOut && (
        <div className="fixed top-6 right-6 z-[60] animate-fade-in">
          <button
            onClick={handleSkipAnimation}
            className="group relative px-6 py-3 bg-gradient-to-r from-green-500/10 to-cyan-500/10 hover:from-green-500/20 hover:to-cyan-500/20 border-2 border-green-500/40 hover:border-green-400/60 rounded-lg text-green-400 text-sm font-mono font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm"
            style={{
              boxShadow: '0 0 30px rgba(0, 255, 0, 0.2)'
            }}
          >
            {/* Animated glow effect */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
            
            {/* Button content */}
            <div className="relative flex items-center gap-2">
              <span>Skip Intro</span>
              <svg 
                className="w-4 h-4 transition-transform group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            
            {/* Corner accent */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{ boxShadow: '0 0 10px rgba(0, 255, 0, 0.8)' }} />
          </button>
          
          {/* Hint text */}
          <div className="mt-3 text-center text-green-400/60 text-xs font-mono animate-pulse">
            Press any key to skip
          </div>
        </div>
      )}

      {/* Keyboard shortcut to skip */}
      {animationPhase === 'intro' && !animationFadingOut && (
        <div className="fixed inset-0 z-[59]" onKeyDown={handleSkipAnimation} tabIndex={0} />
      )}

      {/* Auth Form - Only show after animation with enhanced entrance */}
      {showForm && (
        <>
          {/* Animated Background with staggered fade-in */}
          <div className="fixed inset-0 z-0 animate-fade-in" style={{ animationDuration: '1.2s' }}>
            {/* Layered gradient backgrounds */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-black to-cyan-900/20 animate-fade-in" style={{ animationDelay: '0ms' }}></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,0,0.1),transparent_50%)] animate-fade-in" style={{ animationDelay: '200ms' }}></div>
            
            {/* Grid overlay effect */}
            <div 
              className="absolute inset-0 opacity-5 animate-fade-in"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0, 255, 0, 0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0, 255, 0, 0.3) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
                animationDelay: '400ms'
              }}
            />
            
            {/* Floating particles */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-green-400 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: `${3 + Math.random() * 4}s`
                }}
              />
            ))}
          </div>

          {/* Content with smooth slide-up entrance */}
          <div className="relative z-10 min-h-screen flex items-center justify-center p-4 opacity-0 translate-y-8 animate-slide-up-fade" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg
                  className="h-10 w-10 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-green-400 font-mono mb-2">
              VulHub Leaderboard
            </h1>
            <p className="text-gray-400 font-mono">
              Master cybersecurity through competition
            </p>
          </div>

          {/* Auth Form */}
          <div className="bg-black/50 backdrop-blur-sm border border-green-500/30 rounded-lg p-6">
            {isLogin ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">Sign In</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    School ID
                  </label>
                  <input
                    type="text"
                    name="schoolId"
                    required
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 bg-black/50 border border-green-500/50 rounded text-green-400 placeholder-gray-500 focus:outline-none focus:border-green-400 disabled:opacity-50"
                    placeholder="Enter your school ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 bg-black/50 border border-green-500/50 rounded text-green-400 placeholder-gray-500 focus:outline-none focus:border-green-400 disabled:opacity-50"
                    placeholder="Enter your password"
                  />
                </div>

                {error && (
                  <div className="text-red-400 text-sm text-center">{error}</div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-500 text-black py-2 px-4 rounded font-mono font-bold hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Signing In...' : 'Sign In'}
                </button>

                <p className="text-center text-sm text-gray-400">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    disabled={isSubmitting}
                    className="text-green-400 hover:text-green-300 underline disabled:opacity-50"
                  >
                    Sign Up
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">Sign Up</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 bg-black/50 border border-green-500/50 rounded text-green-400 placeholder-gray-500 focus:outline-none focus:border-green-400 disabled:opacity-50"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    School ID
                  </label>
                  <input
                    type="text"
                    name="schoolId"
                    required
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 bg-black/50 border border-green-500/50 rounded text-green-400 placeholder-gray-500 focus:outline-none focus:border-green-400 disabled:opacity-50"
                    placeholder="Enter your school ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 bg-black/50 border border-green-500/50 rounded text-green-400 placeholder-gray-500 focus:outline-none focus:border-green-400 disabled:opacity-50"
                    placeholder="Create a password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 bg-black/50 border border-green-500/50 rounded text-green-400 placeholder-gray-500 focus:outline-none focus:border-green-400 disabled:opacity-50"
                    placeholder="Confirm your password"
                  />
                </div>

                {error && (
                  <div className="text-red-400 text-sm text-center">{error}</div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-500 text-black py-2 px-4 rounded font-mono font-bold hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                </button>

                <p className="text-center text-sm text-gray-400">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    disabled={isSubmitting}
                    className="text-green-400 hover:text-green-300 underline disabled:opacity-50"
                  >
                    Sign In
                  </button>
                </p>
              </form>
            )}
          </div>

          {/* Features */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 font-mono text-sm mb-4">
              VulHub Leaderboard - What you'll get:
            </p>
            <div className="grid grid-cols-2 gap-4 text-xs font-mono text-gray-300">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>Real challenges</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>Live leaderboard</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>Progress tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>Community learning</span>
              </div>
            </div>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
}