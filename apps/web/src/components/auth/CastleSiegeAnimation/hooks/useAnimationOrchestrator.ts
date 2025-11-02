/**
 * useAnimationOrchestrator Hook
 * 
 * React hook for integrating AnimationOrchestrator with React components
 */

import { useRef, useState, useEffect, useCallback } from 'react';
import { AnimationOrchestrator } from '../core/AnimationOrchestrator';
import type { OrchestratorConfig, OrchestratorCallbacks } from '../core/AnimationOrchestrator';
import type { OrchestratorState } from '../core/types/OrchestratorState';

export interface UseAnimationOrchestratorOptions {
  config?: OrchestratorConfig;
  onReady?: () => void;
  onError?: (error: any) => void;
  onComplete?: () => void;
  onPhaseChange?: (phase: string) => void;
  autoStart?: boolean;
}

export interface AnimationOrchestratorReturn {
  // Canvas
  canvas: HTMLCanvasElement | null;
  
  // State flags
  isReady: boolean;
  isPlaying: boolean;
  isComplete: boolean;
  currentPhase: string;
  progress: number;
  canSkip: boolean;
  
  // Performance
  fps: number;
  memoryUsage: number;
  systemHealth: 'healthy' | 'degraded' | 'critical';
  errorCount: number;
  
  // Controls
  controls: {
    play: () => void;
    pause: () => void;
    skip: () => void;
    destroy: () => void;
  };
  
  // Full state
  state: OrchestratorState | null;
  
  // Entity count (for debug)
  entityCount: number;
}

/**
 * Hook to use the Animation Orchestrator
 */
export function useAnimationOrchestrator(options: UseAnimationOrchestratorOptions = {}): AnimationOrchestratorReturn {
  const {
    config = {},
    onReady,
    onError,
    onComplete,
    onPhaseChange,
    autoStart = false,
  } = options;

  // Orchestrator instance (persistent across re-renders)
  const orchestratorRef = useRef<AnimationOrchestrator | null>(null);

  // Local state for React re-renders
  const [state, setState] = useState<OrchestratorState | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Create orchestrator instance (only once per component lifetime)
  useEffect(() => {
    const callbacks: OrchestratorCallbacks = {
      onReady: () => {
        setIsInitialized(true);
        onReady?.();
      },
      onError,
      onComplete,
      onPhaseChange,
    };

    orchestratorRef.current = new AnimationOrchestrator(config, callbacks);

    // Cleanup on unmount
    return () => {
      if (orchestratorRef.current) {
        orchestratorRef.current.destroy();
        orchestratorRef.current = null;
      }
    };
  }, []); // Empty deps: create once on mount, destroy on unmount

  // State synchronization (poll for updates)
  useEffect(() => {
    if (!orchestratorRef.current || !isInitialized) {return;}

    const updateState = () => {
      if (orchestratorRef.current) {
        const newState = orchestratorRef.current.getState();
        setState(newState);
      }
    };

    // Update immediately
    updateState();

    // Poll for state changes
    const interval = setInterval(updateState, 16); // ~60fps

    return () => clearInterval(interval);
  }, [isInitialized]);

  // Auto-start if requested
  useEffect(() => {
    if (autoStart && orchestratorRef.current && isInitialized && !orchestratorRef.current.isPlaying()) {
      orchestratorRef.current.start();
    }
  }, [autoStart, isInitialized]);

  // Initialize orchestrator (only client-side)
  useEffect(() => {
    // SSR guard: only initialize in browser
    if (typeof window === 'undefined') {
      return;
    }

    if (orchestratorRef.current && !isInitialized) {
      orchestratorRef.current.initialize().catch(error => {
        // Delegate error handling to callback, not console
        onError?.(error);
      });
    }
  }, [isInitialized, onError]);

  // Control functions
  const play = useCallback(() => {
    orchestratorRef.current?.play();
  }, []);

  const pause = useCallback(() => {
    orchestratorRef.current?.pause();
  }, []);

  const skip = useCallback(() => {
    orchestratorRef.current?.skip();
  }, []);

  const destroy = useCallback(() => {
    if (orchestratorRef.current) {
      orchestratorRef.current.destroy();
      orchestratorRef.current = null;
      setState(null);
      setIsInitialized(false);
    }
  }, []);

  // Computed values with safe access
  const computedValues = {
    canvas: state?.canvas?.element ?? null,
    isReady: state?.system?.isInitialized ?? false,
    isPlaying: state?.animation?.isPlaying ?? false,
    isComplete: state?.animation?.isComplete ?? false,
    currentPhase: state?.animation?.phase ?? 'idle',
    progress: state?.animation?.progress ?? 0,
    canSkip: state?.animation?.canSkip ?? false,
    fps: state?.performance?.fps ?? 0,
    memoryUsage: state?.performance?.memoryUsage ?? 0,
    systemHealth: state?.system?.health ?? 'healthy',
    errorCount: state?.system?.errors?.length ?? 0,
    entityCount: state?.entities?.entityCount ?? 0,
  };

  return {
    ...computedValues,
    controls: {
      play,
      pause,
      skip,
      destroy,
    },
    state,
  };
}

