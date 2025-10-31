/**
 * IntroAnimation Component
 * 
 * Placeholder intro animation - ready for custom animation implementation
 * This component defines the structure; actual animations can be added later
 */

import React, { useEffect, useState } from 'react';
import { AnimationPhase } from '../../lib/auth/animation-types';

interface IntroAnimationProps {
  phase: AnimationPhase;
  onComplete?: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ phase, onComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (phase !== 'intro') return;

    // Simple step animation - can be replaced with complex animations later
    const timer = setTimeout(() => {
      setStep(prev => prev + 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [phase, step]);

  if (phase !== 'intro') return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-matrix-900 via-black to-cyan-900 opacity-50 animate-pulse" />
        <div 
          className="absolute inset-0 animate-scan-line"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.03) 2px, rgba(0, 255, 0, 0.03) 4px)'
          }}
        />
      </div>

      {/* Content - Ready for custom animation */}
      <div className="relative z-10 text-center space-y-8">
        {/* Logo/Title Animation */}
        <div className={`
          transition-all duration-1000
          ${step >= 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
        `}>
          <div className="w-32 h-32 mx-auto mb-6 relative">
            {/* Spinning rings */}
            <div className="absolute inset-0 border-4 border-matrix/30 rounded-full animate-spin-slow" />
            <div className="absolute inset-4 border-4 border-cyan-500/30 rounded-full animate-spin-reverse" />
            <div className="absolute inset-8 border-4 border-matrix rounded-full animate-pulse" />
            
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="h-12 w-12 text-matrix-glow animate-bounce-subtle"
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

          <h1 className="text-6xl font-display font-bold text-matrix-glow mb-4 font-mono">
            VulHub
          </h1>
        </div>

        {/* Subtitle Animation */}
        <div className={`
          transition-all duration-1000 delay-500
          ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}>
          <p className="text-2xl text-cyan-400 font-mono">
            Master Cybersecurity Through Competition
          </p>
        </div>

        {/* Feature Pills Animation */}
        <div className={`
          transition-all duration-1000 delay-1000
          ${step >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        `}>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {['Real Challenges', 'Live Leaderboard', 'Progress Tracking', 'Community'].map((feature, index) => (
              <div
                key={feature}
                className="px-4 py-2 bg-matrix/10 border border-matrix/30 rounded-full text-matrix text-sm font-mono animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Loading Indicator */}
        <div className={`
          transition-all duration-500 delay-1500
          ${step >= 2 ? 'opacity-100' : 'opacity-0'}
        `}>
          <div className="flex items-center justify-center space-x-2 mt-12">
            <div className="w-2 h-2 bg-matrix rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-matrix rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
            <div className="w-2 h-2 bg-matrix rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
          </div>
          <p className="text-sm text-muted mt-4 font-mono">
            Initializing system...
          </p>
        </div>
      </div>

      {/* Grid overlay effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
    </div>
  );
};

export default IntroAnimation;

