/**
 * Animation Controller
 * 
 * Controls the auth page intro animation sequence
 */

import { AnimationPhase, AnimationSequence, AnimationStep, AnimationConfig } from './animation-types';

/**
 * Default animation configuration
 */
export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  enableIntro: true,
  enableSuccessAnimation: true,
  enableTransitions: true,
  playOnce: true,
  respectUserPreference: true,
  minDisplayTime: 1000 // 1 second
};

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') {return false;}
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if animation has been played this session
 */
export function hasPlayedThisSession(): boolean {
  if (typeof window === 'undefined') {return false;}
  return sessionStorage.getItem('auth_intro_played') === 'true';
}

/**
 * Mark animation as played for this session
 */
export function markAsPlayed(): void {
  if (typeof window === 'undefined') {return;}
  sessionStorage.setItem('auth_intro_played', 'true');
}

/**
 * Clear played state (for testing)
 */
export function clearPlayedState(): void {
  if (typeof window === 'undefined') {return;}
  sessionStorage.removeItem('auth_intro_played');
}

/**
 * Determine if animation should play
 */
export function shouldPlayAnimation(config: AnimationConfig): boolean {
  // Check if disabled
  if (!config.enableIntro) {return false;}
  
  // Respect reduced motion preference
  if (config.respectUserPreference && prefersReducedMotion()) {return false;}
  
  // Check if already played this session
  if (config.playOnce && hasPlayedThisSession()) {return false;}
  
  return true;
}

/**
 * Create default animation sequence
 * This defines the structure - actual animations are implemented in components
 */
export function createDefaultSequence(): AnimationSequence {
  const steps: AnimationStep[] = [
    {
      id: 'intro-1',
      phase: 'intro',
      duration: 2000,
      skipable: true
    },
    {
      id: 'intro-2',
      phase: 'intro',
      duration: 1500,
      skipable: true
    },
    {
      id: 'transition-1',
      phase: 'transition',
      duration: 1000,
      skipable: false
    },
    {
      id: 'auth-show',
      phase: 'auth',
      duration: 0, // Auth form stays until user interacts
      skipable: false
    }
  ];

  const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);

  return {
    steps,
    totalDuration,
    allowSkip: true,
    skipToPhase: 'auth'
  };
}

/**
 * Create success animation sequence (after login)
 */
export function createSuccessSequence(): AnimationSequence {
  const steps: AnimationStep[] = [
    {
      id: 'success-1',
      phase: 'success',
      duration: 1000,
      skipable: false
    },
    {
      id: 'redirecting',
      phase: 'redirecting',
      duration: 500,
      skipable: false
    }
  ];

  return {
    steps,
    totalDuration: steps.reduce((sum, step) => sum + step.duration, 0),
    allowSkip: false
  };
}

/**
 * Get phase index in sequence
 */
export function getPhaseIndex(sequence: AnimationSequence, phase: AnimationPhase): number {
  return sequence.steps.findIndex(step => step.phase === phase);
}

/**
 * Get current step from sequence
 */
export function getCurrentStep(sequence: AnimationSequence, stepIndex: number): AnimationStep | null {
  return sequence.steps[stepIndex] || null;
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(
  sequence: AnimationSequence,
  currentStepIndex: number,
  currentStepProgress: number
): number {
  if (!sequence.totalDuration) {return 100;}
  
  // Calculate completed time
  let completedTime = 0;
  for (let i = 0; i < currentStepIndex; i++) {
    completedTime += sequence.steps[i].duration;
  }
  
  // Add current step progress
  const currentStep = sequence.steps[currentStepIndex];
  if (currentStep) {
    completedTime += (currentStep.duration * currentStepProgress) / 100;
  }
  
  return Math.min((completedTime / sequence.totalDuration) * 100, 100);
}

/**
 * Animation event emitter for React components
 */
export type AnimationEventType = 
  | 'phase-change'
  | 'step-change'
  | 'progress'
  | 'complete'
  | 'skip';

export type AnimationEventListener = (data: any) => void;

class AnimationEventEmitter {
  private listeners: Map<AnimationEventType, AnimationEventListener[]> = new Map();

  on(event: AnimationEventType, listener: AnimationEventListener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);
  }

  off(event: AnimationEventType, listener: AnimationEventListener) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emit(event: AnimationEventType, data?: any) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach(listener => listener(data));
    }
  }

  clear() {
    this.listeners.clear();
  }
}

export const animationEvents = new AnimationEventEmitter();

