/**
 * Comprehensive Animation System
 * Provides advanced animation utilities and micro-interactions
 */

import { transitions } from '../tokens/design-tokens';

type AnimationDuration = keyof typeof transitions.duration;
type AnimationEasing = keyof typeof transitions.timingFunction;

// Animation utility functions
export const animationUtils = {
  /**
   * Generate CSS animation properties
   */
  generateAnimation: (
    name: string,
    duration: AnimationDuration = 300,
    easing: AnimationEasing = 'in-out',
    delay: string = '0ms',
    iterationCount: string = '1',
    direction: string = 'normal',
    fillMode: string = 'both'
  ) => {
    return {
      animationName: name,
      animationDuration: transitions.duration[duration],
      animationTimingFunction: transitions.timingFunction[easing],
      animationDelay: delay,
      animationIterationCount: iterationCount,
      animationDirection: direction,
      animationFillMode: fillMode,
    };
  },

  /**
   * Generate keyframe animations
   */
  generateKeyframes: (name: string, keyframes: Record<string, Record<string, string>>) => {
    return {
      [`@keyframes ${name}`]: keyframes,
    };
  },

  /**
   * Create staggered animations
   */
  createStaggeredAnimation: (
    baseAnimation: string,
    staggerDelay: string = '100ms',
    maxItems: number = 10
  ) => {
    const staggeredStyles: Record<string, any> = {};
    
    for (let i = 0; i < maxItems; i++) {
      staggeredStyles[`&:nth-child(${i + 1})`] = {
        animationDelay: `calc(${i} * ${staggerDelay})`,
      };
    }
    
    return {
      animation: baseAnimation,
      ...staggeredStyles,
    };
  },

  /**
   * Generate hover animations
   */
  generateHoverAnimation: (
    baseStyles: Record<string, any>,
    hoverStyles: Record<string, any>,
    transitionDuration: string = '200ms'
  ) => {
    return {
      ...baseStyles,
      transition: `all ${transitionDuration} ease-in-out`,
      '&:hover': hoverStyles,
    };
  },

  /**
   * Generate focus animations
   */
  generateFocusAnimation: (
    baseStyles: Record<string, any>,
    focusStyles: Record<string, any>,
    transitionDuration: string = '150ms'
  ) => {
    return {
      ...baseStyles,
      transition: `all ${transitionDuration} ease-in-out`,
      '&:focus': focusStyles,
      '&:focus-visible': focusStyles,
    };
  },
};

// Pre-built animation keyframes
export const animationKeyframes = {
  // Fade animations
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  
  fadeOut: {
    '0%': { opacity: '1' },
    '100%': { opacity: '0' },
  },
  
  fadeInUp: {
    '0%': { opacity: '0', transform: 'translateY(20px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
  
  fadeInDown: {
    '0%': { opacity: '0', transform: 'translateY(-20px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
  
  fadeInLeft: {
    '0%': { opacity: '0', transform: 'translateX(-20px)' },
    '100%': { opacity: '1', transform: 'translateX(0)' },
  },
  
  fadeInRight: {
    '0%': { opacity: '0', transform: 'translateX(20px)' },
    '100%': { opacity: '1', transform: 'translateX(0)' },
  },

  // Scale animations
  scaleIn: {
    '0%': { opacity: '0', transform: 'scale(0.9)' },
    '100%': { opacity: '1', transform: 'scale(1)' },
  },
  
  scaleOut: {
    '0%': { opacity: '1', transform: 'scale(1)' },
    '100%': { opacity: '0', transform: 'scale(0.9)' },
  },
  
  scaleUp: {
    '0%': { transform: 'scale(1)' },
    '100%': { transform: 'scale(1.05)' },
  },
  
  scaleDown: {
    '0%': { transform: 'scale(1)' },
    '100%': { transform: 'scale(0.95)' },
  },

  // Slide animations
  slideInUp: {
    '0%': { transform: 'translateY(100%)' },
    '100%': { transform: 'translateY(0)' },
  },
  
  slideInDown: {
    '0%': { transform: 'translateY(-100%)' },
    '100%': { transform: 'translateY(0)' },
  },
  
  slideInLeft: {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(0)' },
  },
  
  slideInRight: {
    '0%': { transform: 'translateX(100%)' },
    '100%': { transform: 'translateX(0)' },
  },

  // Rotate animations
  rotateIn: {
    '0%': { opacity: '0', transform: 'rotate(-180deg)' },
    '100%': { opacity: '1', transform: 'rotate(0deg)' },
  },
  
  rotateOut: {
    '0%': { opacity: '1', transform: 'rotate(0deg)' },
    '100%': { opacity: '0', transform: 'rotate(180deg)' },
  },
  
  spin: {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },

  // Bounce animations
  bounce: {
    '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
    '40%, 43%': { transform: 'translate3d(0,-30px,0)' },
    '70%': { transform: 'translate3d(0,-15px,0)' },
    '90%': { transform: 'translate3d(0,-4px,0)' },
  },
  
  bounceIn: {
    '0%': { opacity: '0', transform: 'scale(0.3)' },
    '50%': { opacity: '1', transform: 'scale(1.05)' },
    '70%': { transform: 'scale(0.9)' },
    '100%': { opacity: '1', transform: 'scale(1)' },
  },

  // Pulse animations
  pulse: {
    '0%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.05)' },
    '100%': { transform: 'scale(1)' },
  },
  
  pulseGlow: {
    '0%': { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.7)' },
    '70%': { boxShadow: '0 0 0 10px rgba(59, 130, 246, 0)' },
    '100%': { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0)' },
  },

  // Shake animations
  shake: {
    '0%, 100%': { transform: 'translateX(0)' },
    '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
    '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
  },
  
  shakeVertical: {
    '0%, 100%': { transform: 'translateY(0)' },
    '10%, 30%, 50%, 70%, 90%': { transform: 'translateY(-10px)' },
    '20%, 40%, 60%, 80%': { transform: 'translateY(10px)' },
  },

  // Wobble animations
  wobble: {
    '0%': { transform: 'translateX(0%)' },
    '15%': { transform: 'translateX(-25%) rotate(-5deg)' },
    '30%': { transform: 'translateX(20%) rotate(3deg)' },
    '45%': { transform: 'translateX(-15%) rotate(-3deg)' },
    '60%': { transform: 'translateX(10%) rotate(2deg)' },
    '75%': { transform: 'translateX(-5%) rotate(-1deg)' },
    '100%': { transform: 'translateX(0%)' },
  },

  // Flip animations
  flipInX: {
    '0%': { transform: 'perspective(400px) rotateX(90deg)', opacity: '0' },
    '40%': { transform: 'perspective(400px) rotateX(-20deg)' },
    '60%': { transform: 'perspective(400px) rotateX(10deg)', opacity: '1' },
    '80%': { transform: 'perspective(400px) rotateX(-5deg)' },
    '100%': { transform: 'perspective(400px) rotateX(0deg)' },
  },
  
  flipInY: {
    '0%': { transform: 'perspective(400px) rotateY(90deg)', opacity: '0' },
    '40%': { transform: 'perspective(400px) rotateY(-20deg)' },
    '60%': { transform: 'perspective(400px) rotateY(10deg)', opacity: '1' },
    '80%': { transform: 'perspective(400px) rotateY(-5deg)' },
    '100%': { transform: 'perspective(400px) rotateY(0deg)' },
  },

  // Zoom animations
  zoomIn: {
    '0%': { opacity: '0', transform: 'scale3d(0.3, 0.3, 0.3)' },
    '50%': { opacity: '1' },
  },
  
  zoomOut: {
    '0%': { opacity: '1' },
    '50%': { opacity: '0', transform: 'scale3d(0.3, 0.3, 0.3)' },
    '100%': { opacity: '0' },
  },

  // Loading animations
  loadingDots: {
    '0%, 80%, 100%': { transform: 'scale(0)' },
    '40%': { transform: 'scale(1)' },
  },
  
  loadingSpinner: {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
} as const;

// Animation presets for common use cases
export const animationPresets = {
  // Page transitions
  pageEnter: {
    animation: 'fadeInUp 0.6s ease-out',
  },
  
  pageExit: {
    animation: 'fadeOut 0.3s ease-in',
  },

  // Modal animations
  modalEnter: {
    animation: 'scaleIn 0.3s ease-out',
  },
  
  modalExit: {
    animation: 'scaleOut 0.2s ease-in',
  },

  // Button animations
  buttonHover: {
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  },
  
  buttonPress: {
    transition: 'all 0.1s ease-in-out',
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
  },

  // Card animations
  cardHover: {
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
    },
  },

  // Input animations
  inputFocus: {
    transition: 'all 0.2s ease-in-out',
    '&:focus': {
      transform: 'scale(1.02)',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    },
  },

  // Loading states
  loading: {
    animation: 'pulse 2s ease-in-out infinite',
  },
  
  spinner: {
    animation: 'spin 1s linear infinite',
  },

  // Success animations
  success: {
    animation: 'bounceIn 0.6s ease-out',
  },
  
  successGlow: {
    animation: 'pulseGlow 2s ease-in-out infinite',
  },

  // Error animations
  error: {
    animation: 'shake 0.5s ease-in-out',
  },
  
  errorGlow: {
    animation: 'pulseGlow 2s ease-in-out infinite',
    boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.7)',
  },

  // Notification animations
  notificationEnter: {
    animation: 'slideInRight 0.4s ease-out',
  },
  
  notificationExit: {
    animation: 'slideOutRight 0.3s ease-in',
  },
} as const;

// Scroll-triggered animations
export const scrollAnimations = {
  /**
   * Generate intersection observer animation
   */
  createScrollAnimation: (
    animationName: string,
    threshold: number = 0.1,
    rootMargin: string = '0px'
  ) => {
    return {
      animationName,
      threshold,
      rootMargin,
    };
  },

  /**
   * Common scroll animation configurations
   */
  configurations: {
    fadeInOnScroll: {
      animation: 'fadeInUp 0.8s ease-out',
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    },
    
    slideInOnScroll: {
      animation: 'slideInLeft 0.6s ease-out',
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px',
    },
    
    scaleInOnScroll: {
      animation: 'scaleIn 0.5s ease-out',
      threshold: 0.3,
      rootMargin: '0px 0px -50px 0px',
    },
  },
} as const;

// Performance-optimized animations
export const performanceAnimations = {
  /**
   * Use transform and opacity for better performance
   */
  optimizedTransitions: {
    fast: 'transform 0.15s ease-out, opacity 0.15s ease-out',
    normal: 'transform 0.3s ease-out, opacity 0.3s ease-out',
    slow: 'transform 0.5s ease-out, opacity 0.5s ease-out',
  },

  /**
   * GPU-accelerated animations
   */
  gpuAccelerated: {
    willChange: 'transform, opacity',
    transform: 'translateZ(0)', // Force GPU acceleration
  },

  /**
   * Reduced motion support
   */
  reducedMotion: {
    '@media (prefers-reduced-motion: reduce)': {
      animation: 'none',
      transition: 'none',
    },
  },
} as const;

// Export types
export type AnimationKeyframe = keyof typeof animationKeyframes;
export type AnimationPreset = keyof typeof animationPresets;

// Export all animation utilities
export const animationSystem = {
  utils: animationUtils,
  keyframes: animationKeyframes,
  presets: animationPresets,
  scroll: scrollAnimations,
  performance: performanceAnimations,
} as const;
