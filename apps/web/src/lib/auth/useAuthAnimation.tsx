/**
 * useAuthAnimation Hook
 * 
 * React hook for managing auth animation state
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  AnimationPhase,
  AnimationState,
  AnimationControls,
  AnimationConfig,
  AnimationSequence
} from './animation-types';
import {
  createDefaultSequence,
  createSuccessSequence,
  shouldPlayAnimation,
  markAsPlayed,
  calculateProgress,
  getCurrentStep,
  getPhaseIndex,
  DEFAULT_ANIMATION_CONFIG,
  animationEvents
} from './animation-controller';

export interface UseAuthAnimationOptions {
  config?: Partial<AnimationConfig>;
  onPhaseChange?: (phase: AnimationPhase) => void;
  onComplete?: () => void;
  onSkip?: () => void;
}

export function useAuthAnimation(options: UseAuthAnimationOptions = {}) {
  const config = { ...DEFAULT_ANIMATION_CONFIG, ...options.config };
  const [state, setState] = useState<AnimationState>({
    currentPhase: shouldPlayAnimation(config) ? 'intro' : 'auth',
    currentStep: shouldPlayAnimation(config) ? 0 : 3,
    totalSteps: 4,
    isAnimating: shouldPlayAnimation(config),
    isComplete: !shouldPlayAnimation(config),
    canSkip: true,
    progress: shouldPlayAnimation(config) ? 0 : 100
  });

  const [sequence, setSequence] = useState<AnimationSequence>(createDefaultSequence());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const stepProgressRef = useRef(0);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Advance to next step
  const advanceStep = useCallback(() => {
    setState(prev => {
      const nextStep = prev.currentStep + 1;
      const step = getCurrentStep(sequence, nextStep);

      if (!step) {
        // Sequence complete
        animationEvents.emit('complete');
        options.onComplete?.();
        markAsPlayed();
        return {
          ...prev,
          isAnimating: false,
          isComplete: true,
          progress: 100
        };
      }

      const newPhase = step.phase;
      if (newPhase !== prev.currentPhase) {
        animationEvents.emit('phase-change', newPhase);
        options.onPhaseChange?.(newPhase);
      }

      animationEvents.emit('step-change', nextStep);

      const progress = calculateProgress(sequence, nextStep, 0);

      return {
        ...prev,
        currentStep: nextStep,
        currentPhase: newPhase,
        canSkip: step.skipable && sequence.allowSkip,
        progress
      };
    });

    stepProgressRef.current = 0;
  }, [sequence, options]);

  // Start next step timer
  useEffect(() => {
    if (!state.isAnimating || state.isComplete) return;

    const step = getCurrentStep(sequence, state.currentStep);
    if (!step) return;

    // If step has duration, auto-advance after duration
    if (step.duration > 0) {
      timerRef.current = setTimeout(() => {
        advanceStep();
      }, step.duration);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, [state.currentStep, state.isAnimating, state.isComplete, sequence, advanceStep]);

  // Controls
  const controls: AnimationControls = {
    play: useCallback(() => {
      setState(prev => ({ ...prev, isAnimating: true }));
    }, []),

    pause: useCallback(() => {
      setState(prev => ({ ...prev, isAnimating: false }));
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }, []),

    skip: useCallback(() => {
      if (!state.canSkip) return;

      const targetPhase = sequence.skipToPhase || 'auth';
      const targetIndex = getPhaseIndex(sequence, targetPhase);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setState(prev => ({
        ...prev,
        currentStep: targetIndex,
        currentPhase: targetPhase,
        isAnimating: false,
        progress: calculateProgress(sequence, targetIndex, 0)
      }));

      animationEvents.emit('skip');
      options.onSkip?.();
      markAsPlayed();
    }, [state.canSkip, sequence, options]),

    skipToPhase: useCallback((phase: AnimationPhase) => {
      const targetIndex = getPhaseIndex(sequence, phase);
      if (targetIndex === -1) return;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setState(prev => ({
        ...prev,
        currentStep: targetIndex,
        currentPhase: phase,
        isAnimating: false,
        progress: calculateProgress(sequence, targetIndex, 0)
      }));

      animationEvents.emit('phase-change', phase);
      options.onPhaseChange?.(phase);
    }, [sequence, options]),

    reset: useCallback(() => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setState({
        currentPhase: 'intro',
        currentStep: 0,
        totalSteps: sequence.steps.length,
        isAnimating: false,
        isComplete: false,
        canSkip: sequence.allowSkip,
        progress: 0
      });

      stepProgressRef.current = 0;
    }, [sequence]),

    complete: useCallback(() => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setState(prev => ({
        ...prev,
        isAnimating: false,
        isComplete: true,
        progress: 100
      }));

      animationEvents.emit('complete');
      options.onComplete?.();
      markAsPlayed();
    }, [options])
  };

  // Play success animation
  const playSuccessAnimation = useCallback(() => {
    const successSeq = createSuccessSequence();
    setSequence(successSeq);
    setState({
      currentPhase: 'success',
      currentStep: 0,
      totalSteps: successSeq.steps.length,
      isAnimating: true,
      isComplete: false,
      canSkip: false,
      progress: 0
    });
  }, []);

  return {
    state,
    controls,
    playSuccessAnimation,
    config
  };
}

