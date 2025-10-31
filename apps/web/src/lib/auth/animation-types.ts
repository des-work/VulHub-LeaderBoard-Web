/**
 * Auth Animation Types
 * 
 * Type definitions for the intro animation system
 */

export type AnimationPhase = 
  | 'intro'           // Initial intro animation
  | 'idle'            // Animation complete, waiting
  | 'transition'      // Transition to auth form
  | 'auth'            // Show auth form
  | 'success'         // Login success animation
  | 'redirecting';    // Redirecting to home

export type AnimationStep = {
  id: string;
  phase: AnimationPhase;
  duration: number;  // milliseconds
  skipable: boolean;
  onComplete?: () => void;
};

export interface AnimationState {
  currentPhase: AnimationPhase;
  currentStep: number;
  totalSteps: number;
  isAnimating: boolean;
  isComplete: boolean;
  canSkip: boolean;
  progress: number; // 0-100
}

export interface AnimationSequence {
  steps: AnimationStep[];
  totalDuration: number;
  allowSkip: boolean;
  skipToPhase?: AnimationPhase; // Which phase to jump to when skipped
}

export interface AnimationControls {
  play: () => void;
  pause: () => void;
  skip: () => void;
  skipToPhase: (phase: AnimationPhase) => void;
  reset: () => void;
  complete: () => void;
}

export interface AnimationConfig {
  enableIntro: boolean;
  enableSuccessAnimation: boolean;
  enableTransitions: boolean;
  playOnce: boolean; // Only play animation once per session
  respectUserPreference: boolean; // Respect prefers-reduced-motion
  minDisplayTime: number; // Minimum time to show auth form
}

