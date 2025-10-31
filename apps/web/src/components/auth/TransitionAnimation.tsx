/**
 * TransitionAnimation Component
 * 
 * Transition animation from intro to auth form
 */

import React from 'react';
import { AnimationPhase } from '../../lib/auth/animation-types';

interface TransitionAnimationProps {
  phase: AnimationPhase;
}

const TransitionAnimation: React.FC<TransitionAnimationProps> = ({ phase }) => {
  if (phase !== 'transition') return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Wipe effect */}
      <div className="absolute inset-0 bg-black animate-wipe-out" />
      
      {/* Matrix rain effect */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 w-px bg-gradient-to-b from-transparent via-matrix to-transparent opacity-70 animate-matrix-rain"
            style={{
              left: `${i * 5}%`,
              height: '100%',
              animationDelay: `${i * 100}ms`,
              animationDuration: '1000ms'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default TransitionAnimation;

