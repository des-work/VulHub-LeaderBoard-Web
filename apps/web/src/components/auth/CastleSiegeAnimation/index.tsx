/**
 * Castle Siege Animation - Unified Orchestrator Component
 *
 * Single-source-of-truth animation system replacing multiple hooks with unified orchestrator
 * Phase 1 of 7-phase optimization: Unified Orchestration
 */

import React, { useEffect, useCallback } from 'react';
import { AnimationPhase } from '../../../lib/auth/animation-types';

// Unified orchestrator hook (replaces multiple hooks)
import { useAnimationOrchestrator } from './hooks/useAnimationOrchestrator';

// Debug and error handling
import { AnimationDebugger, errorLogger } from './utils/debug';
import { DebugOverlay } from './components/DebugOverlay';

// Performance monitoring
import { PerformanceMonitor } from './performance/PerformanceMonitor';

// Logging
import { logger } from '../../../lib/logging/logger';

interface CastleSiegeAnimationProps {
  phase: AnimationPhase;
  onComplete?: () => void;
  debug?: boolean;
  enablePerformanceMonitor?: boolean;
}

/**
 * Unified Castle Siege Animation Component
 *
 * Features:
 * - Single orchestrator replaces multiple hooks
 * - Unified state management for all subsystems
 * - Improved performance through coordinated updates
 * - Better error handling and recovery
 * - Easier testing and debugging
 *
 * Phase 1: Unified Orchestration ✅
 */
export const CastleSiegeAnimation: React.FC<CastleSiegeAnimationProps> = ({
  phase,
  onComplete,
  debug = false,
  enablePerformanceMonitor = false,
}) => {
  // Unified orchestrator (replaces useAnimationState + useCanvasManager)
  const {
    canvas,
    isReady,
    isPlaying,
    isComplete,
    currentPhase,
    progress,
    canSkip,
    fps,
    memoryUsage,
    systemHealth,
    errorCount,
    controls,
    state,
  } = useAnimationOrchestrator({
    config: {
      enableDebug: debug,
      enablePerformanceMonitoring: enablePerformanceMonitor,
    },
    onComplete,
    onError: (error) => {
      errorLogger.logError(error, { phase, component: 'CastleSiegeAnimation' });
    },
    onPhaseChange: (newPhase) => {
      if (debug) {
        logger.debug(`🎭 Animation phase changed to: ${newPhase}`);
      }
    },
    autoStart: false, // We'll control start/stop based on phase
  });

  // Debug instance
  const [debuggerInstance] = React.useState(() => debug ? new AnimationDebugger() : null);

  // Control animation based on phase
  useEffect(() => {
    if (!isReady) return;

    if (phase === 'intro' && !isPlaying && !isComplete) {
      // Start animation when in intro phase
      controls.play();
    } else if (phase !== 'intro' && isPlaying) {
      // Stop animation when not in intro phase
      controls.pause();
    }
  }, [phase, isReady, isPlaying, isComplete, controls]);

  // Update debug info
  useEffect(() => {
    if (!debug || !debuggerInstance || !state) return;

    debuggerInstance.update();

    const debugInfo = debuggerInstance.getDebugInfo(
      {
        stars: state?.entities?.entityCount ?? 0, // Get from orchestrator state
        projectiles: 0, // Will be populated in Phase 3
        explosions: 0,
        debris: 0,
      },
      currentPhase,
      state?.animation?.elapsedTime ?? 0,
      isPlaying
    );

    debuggerInstance.logPerformance(debugInfo);
  }, [debug, debuggerInstance, state, currentPhase, isPlaying]);

  // Handle skip
  const handleSkip = useCallback(() => {
    controls.skip();
  }, [controls]);

  // Don't render if not in intro phase
  if (phase !== 'intro') {
    return null;
  }

  // Show error state (get errors from orchestrator state)
  const hasErrors = (state?.system?.errors?.length ?? 0) > 0;
  const canvasError = state?.canvas?.error;

  if (hasErrors || canvasError) {
    return (
      <div className="flex items-center justify-center h-full text-red-400 font-mono text-sm">
        <div className="text-center">
          <div className="text-lg mb-2">⚠️ Animation Error</div>
          <div className="text-xs mb-4">
            {canvasError || 'System error occurred'}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded hover:bg-red-500/30 transition-colors"
          >
            Reload Page
          </button>
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
            Initializing Orchestrator...
          </div>
          <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-cyan-500 transition-all duration-300"
              style={{ width: `${Math.min(progress, 90)}%` }}
            />
          </div>
          <div className="text-green-600 font-mono text-sm mt-2">
            Loading animation system...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Canvas Element */}
      {canvas && (
        <canvas
          ref={(el) => {
            if (el && canvas !== el) {
              // Orchestrator manages the canvas internally
              // This ref is just for React's reconciliation
            }
          }}
          className="absolute inset-0 w-full h-full"
          style={{ minHeight: '100vh' }}
        />
      )}

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

      {/* Debug Overlay */}
      {debug && debuggerInstance && state && (
        <DebugOverlay
          debugInfo={debuggerInstance.getDebugInfo(
            {
              stars: state?.entities?.entityCount ?? 0,
              projectiles: 0,
              explosions: 0,
              debris: 0
            },
            currentPhase,
            state?.animation?.elapsedTime ?? 0,
            isPlaying
          )}
        />
      )}

      {/* Performance Monitor */}
      {enablePerformanceMonitor && (
        <PerformanceMonitor
          enabled={true}
          showOverlay={debug}
          onPerformanceIssue={(metrics) => {
            if (debug) {
              console.warn('Performance issue detected:', metrics);
            }
          }}
        />
      )}

      {/* System Health Indicator */}
      {debug && systemHealth !== 'healthy' && (
        <div className={`absolute bottom-4 left-4 px-2 py-1 rounded text-xs font-mono ${
          systemHealth === 'critical' ? 'bg-red-900 text-red-300' :
          systemHealth === 'degraded' ? 'bg-yellow-900 text-yellow-300' :
          'bg-green-900 text-green-300'
        }`}>
          System: {systemHealth} ({errorCount} errors)
        </div>
      )}
    </div>
  );
};

export default CastleSiegeAnimation;

