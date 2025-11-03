/**
 * Castle Siege Animation - Simple Canvas Implementation
 *
 * Production-grade animation system using direct AnimationEngine
 * (Orchestration system disabled for faster deployment)
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AnimationPhase } from '../../../lib/auth/animation-types';
import { AnimationEngine } from './canvas/AnimationEngine';

interface CastleSiegeAnimationProps {
  phase: AnimationPhase;
  onComplete?: () => void;
  debug?: boolean;
  enablePerformanceMonitor?: boolean;
}

/**
 * Castle Siege Animation Component - Simple Direct Implementation
 *
 * Features:
 * - Direct canvas animation (no orchestration overhead)
 * - Simple state management
 * - Excellent performance
 * - Easy to debug and modify
 *
 * Production-Ready ✅
 */
export const CastleSiegeAnimation: React.FC<CastleSiegeAnimationProps> = ({
  phase,
  onComplete,
  debug = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<AnimationEngine | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [canSkip, setCanSkip] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize animation engine
  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      // Create engine with completion callback
      engineRef.current = new AnimationEngine(canvasRef.current, () => {
        setIsComplete(true);
        setIsPlaying(false);
        onComplete?.();
      });

      setIsReady(true);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to initialize animation';
      setError(message);
      if (debug) console.error('[CastleSiegeAnimation]', err);
    }
  }, [onComplete, debug]);

  // Control animation based on phase
  useEffect(() => {
    if (!isReady || !engineRef.current) return;

    try {
      if (phase === 'intro' && !isComplete) {
        // Start animation when in intro phase
        engineRef.current.start();
        setIsPlaying(true);
        setCanSkip(true);
      } else if (phase !== 'intro' && isPlaying) {
        // Stop animation when not in intro phase
        engineRef.current.stop();
        setIsPlaying(false);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Animation error';
      setError(message);
      if (debug) console.error('[CastleSiegeAnimation]', err);
    }
  }, [phase, isReady, isComplete, isPlaying, debug]);

  // Handle skip
  const handleSkip = useCallback(() => {
    if (engineRef.current) {
      try {
        engineRef.current.skip();
        setIsComplete(true);
        setIsPlaying(false);
        onComplete?.();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Skip failed';
        setError(message);
        if (debug) console.error('[CastleSiegeAnimation]', err);
      }
    }
  }, [onComplete, debug]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (engineRef.current) {
        try {
          engineRef.current.stop();
        } catch (err) {
          if (debug) console.error('[CastleSiegeAnimation] Cleanup error:', err);
        }
      }
    };
  }, [debug]);

  // Don't render if not in intro phase
  if (phase !== 'intro') {
    return null;
  }

  // Show error state
  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black z-30">
        <div className="flex items-center justify-center h-full text-red-400 font-mono text-sm">
          <div className="text-center">
            <div className="text-lg mb-2">⚠️ Animation Error</div>
            <div className="text-xs mb-4">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded hover:bg-red-500/30 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (!isReady) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black z-30">
        <div className="text-center">
          <div className="text-green-400 font-mono text-lg mb-4">
            Loading animation...
          </div>
          <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-cyan-500 transition-all duration-300 animate-pulse"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Canvas Element */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ minHeight: '100vh' }}
      />

      {/* Skip Button */}
      {isPlaying && canSkip && (
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 z-50 px-4 py-2 bg-black/50 border-2 border-green-500/50 text-green-400 font-mono text-sm hover:bg-green-500/10 hover:border-green-500 transition-all duration-300 rounded"
          style={{
            backdropFilter: 'blur(4px)',
          }}
          aria-label="Skip animation"
        >
          Skip Intro
        </button>
      )}
    </div>
  );
};

export default CastleSiegeAnimation;

