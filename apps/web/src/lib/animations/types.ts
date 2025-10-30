/**
 * Animation and Customization System Types
 * Provides robust customization capabilities for professional design
 */

export interface AnimationConfig {
  // Scroll-based animations
  scroll: {
    enabled: boolean;
    threshold: number; // 0-1, when animation triggers
    duration: number; // milliseconds
    easing: EasingFunction;
    stagger: number; // delay between elements
  };
  
  // Entrance animations
  entrance: {
    enabled: boolean;
    type: 'fade' | 'slide' | 'scale' | 'blur' | 'custom';
    direction: 'up' | 'down' | 'left' | 'right' | 'center';
    duration: number;
    delay: number;
    easing: EasingFunction;
  };
  
  // Hover animations
  hover: {
    enabled: boolean;
    scale: number;
    duration: number;
    easing: EasingFunction;
  };
  
  // Text animations
  text: {
    enabled: boolean;
    type: 'typewriter' | 'fade' | 'slide' | 'glow' | 'none';
    duration: number;
    delay: number;
    stagger: number;
  };
}

export interface GlowConfig {
  // Glow intensity and sophistication
  intensity: 'subtle' | 'medium' | 'strong' | 'dramatic';
  color: string;
  spread: number; // 0-100
  blur: number; // 0-50
  opacity: number; // 0-1
  
  // Animation
  animate: boolean;
  pulseSpeed: number; // 0-10
  pulseIntensity: number; // 0-1
  
  // Color sophistication
  gradient: boolean;
  gradientColors: string[];
  gradientAngle: number; // degrees
}

export interface ColorConfig {
  // Primary color palette
  primary: {
    base: string;
    light: string;
    dark: string;
    muted: string;
  };
  
  // Secondary color palette
  secondary: {
    base: string;
    light: string;
    dark: string;
    muted: string;
  };
  
  // Neutral colors
  neutral: {
    white: string;
    black: string;
    gray: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
  };
  
  // Semantic colors
  semantic: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  
  // Sophistication settings
  sophistication: {
    saturation: number; // 0-100
    brightness: number; // 0-100
    contrast: number; // 0-100
    temperature: 'warm' | 'cool' | 'neutral';
  };
}

export interface TypographyConfig {
  // Font families
  fonts: {
    primary: string;
    secondary: string;
    mono: string;
    display: string;
    serif: string;
  };
  
  // Font weights
  weights: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
  };
  
  // Font sizes
  sizes: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
    '6xl': string;
  };
  
  // Line heights
  lineHeights: {
    tight: number;
    normal: number;
    relaxed: number;
    loose: number;
  };
  
  // Letter spacing
  letterSpacing: {
    tight: string;
    normal: string;
    wide: string;
    wider: string;
  };
}

export interface ScrollStage {
  id: string;
  name: string;
  start: number; // 0-1, scroll position
  end: number; // 0-1, scroll position
  animations: AnimationConfig;
  elements: string[]; // CSS selectors
}

export interface CustomizationConfig {
  // Core design settings
  colors: ColorConfig;
  typography: TypographyConfig;
  glow: GlowConfig;
  animations: AnimationConfig;
  
  // Scroll stages
  scrollStages: ScrollStage[];
  
  // Professional settings
  professional: {
    subtleEffects: boolean;
    refinedColors: boolean;
    sophisticatedTypography: boolean;
    minimalGlow: boolean;
  };
  
  // Performance settings
  performance: {
    reduceMotion: boolean;
    lowEndDevice: boolean;
    gpuAcceleration: boolean;
  };
}

export type EasingFunction = 
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'cubic-bezier(0.4, 0, 0.2, 1)'
  | 'cubic-bezier(0.4, 0, 1, 1)'
  | 'cubic-bezier(0, 0, 0.2, 1)'
  | 'cubic-bezier(0.4, 0, 0.6, 1)';

export interface AnimationElement {
  element: HTMLElement;
  config: AnimationConfig;
  isVisible: boolean;
  hasAnimated: boolean;
}

export interface ScrollAnimationState {
  scrollY: number;
  scrollPercent: number;
  currentStage: ScrollStage | null;
  elements: AnimationElement[];
  isScrolling: boolean;
}
