/**
 * SuccessAnimation Component
 * 
 * Success animation after successful login
 */

import React from 'react';
import { AnimationPhase } from '../../lib/auth/animation-types';
import { Check } from 'lucide-react';

interface SuccessAnimationProps {
  phase: AnimationPhase;
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ phase }) => {
  if (phase !== 'success' && phase !== 'redirecting') return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center">
      {/* Success Checkmark */}
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 relative">
          {/* Expanding ring */}
          <div className="absolute inset-0 border-4 border-matrix rounded-full animate-ping" />
          
          {/* Check icon */}
          <div className="absolute inset-0 bg-matrix rounded-full flex items-center justify-center animate-bounce-in">
            <Check className="h-12 w-12 text-black" strokeWidth={4} />
          </div>
        </div>

        <h2 className="text-3xl font-display font-bold text-matrix-glow mb-2 animate-fade-in">
          {phase === 'success' ? 'Login Successful!' : 'Redirecting...'}
        </h2>
        
        {phase === 'redirecting' && (
          <div className="flex items-center justify-center space-x-2 mt-4">
            <div className="w-2 h-2 bg-matrix rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-matrix rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
            <div className="w-2 h-2 bg-matrix rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessAnimation;

