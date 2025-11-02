/**
 * Community Terminal Utility Functions
 * 
 * Helper functions for styling, animations, and visual effects
 */

import {
  COMMUNITY_COLORS,
  COMMUNITY_ANIMATIONS,
  COMMUNITY_EFFECTS,
  COMMUNITY_SIZING,
  COMMUNITY_TYPOGRAPHY,
} from './config';

// ============================================================================
// STYLE GENERATORS
// ============================================================================

/**
 * Create glow effect style object
 */
export function createGlowStyle(color: string, intensity: 'sm' | 'md' | 'lg' | 'xl' = 'md') {
  const glowSizes = { sm: [10, 20], md: [20, 40], lg: [30, 60], xl: [40, 80] };
  const [inner, outer] = glowSizes[intensity];
  return { boxShadow: `0 0 ${inner}px ${color}, 0 0 ${outer}px ${color}` };
}

/**
 * Create text glow effect
 */
export function createTextGlow(color: string, layers: number = 3) {
  const shadows = Array.from({ length: layers }, (_, i) => `0 0 ${(i + 1) * 20}px ${color}`);
  return { textShadow: shadows.join(', ') };
}

/**
 * Create linear gradient
 */
export function createGradient(color1: string, color2: string, direction: string = 'to right') {
  return { background: `linear-gradient(${direction}, ${color1}, ${color2})` };
}

/**
 * Create animated border with glow
 */
export function createAnimatedBorder(color: string, width: string = '2px') {
  return {
    border: `${width} solid ${color}`,
    boxShadow: `0 0 10px ${color}`,
    transition: `all ${COMMUNITY_ANIMATIONS.durations.fast}ms ${COMMUNITY_ANIMATIONS.easings.easeOut}`,
  };
}

/**
 * Create hover effect styles
 */
export function createHoverEffect(options: { 
  scale?: number
  translateX?: string
  translateY?: string
  glow?: string
  borderColor?: string
}) {
  const transforms = [];
  if (options.scale) {transforms.push(`scale(${options.scale})`);}
  if (options.translateX) {transforms.push(`translateX(${options.translateX})`);}
  if (options.translateY) {transforms.push(`translateY(${options.translateY})`);}
  return {
    transform: transforms.join(' '),
    boxShadow: options.glow ? `0 0 20px ${options.glow}` : undefined,
    borderColor: options.borderColor,
    transition: `all ${COMMUNITY_ANIMATIONS.durations.normal}ms ${COMMUNITY_ANIMATIONS.easings.spring}`,
  };
}

// ============================================================================
// ANIMATION HELPERS
// ============================================================================

/**
 * Get typing speed based on speed variant
 */
export function getTypingSpeed(speed: 'fast' | 'normal' | 'slow' = 'normal'): number {
  return COMMUNITY_ANIMATIONS.typing[speed];
}

/**
 * Get animation duration
 */
export function getAnimationDuration(variant: keyof typeof COMMUNITY_ANIMATIONS.durations): number {
  return COMMUNITY_ANIMATIONS.durations[variant];
}

/**
 * Get animation easing function
 */
export function getAnimationEasing(variant: keyof typeof COMMUNITY_ANIMATIONS.easings): string {
  return COMMUNITY_ANIMATIONS.easings[variant];
}

// ============================================================================
// FORMATTING HELPERS
// ============================================================================

/**
 * Create terminal box border
 */
export function createTerminalBox(title: string, style: 'rounded' | 'sharp' = 'rounded'): { 
  top: string
  bottom: string
  side: string
} {
  if (style === 'sharp') {
    return { top: `╔═══ ${title} ═══╗`, bottom: '╚════════════════╝', side: '║' };
  }
  return { top: `┌─── ${title} ───┐`, bottom: '└────────────────┘', side: '│' };
}

/**
 * Format text based on type
 */
export function formatMatrixText(type: 'command' | 'system' | 'result' | 'error') {
  const formats = {
    command: { 
      color: COMMUNITY_COLORS.cyan.primary, 
      fontWeight: COMMUNITY_TYPOGRAPHY.weights.bold, 
      prefix: '$ ' 
    },
    system: { 
      color: COMMUNITY_COLORS.text.primary, 
      fontWeight: COMMUNITY_TYPOGRAPHY.weights.normal, 
      prefix: '> ' 
    },
    result: { 
      color: COMMUNITY_COLORS.text.secondary, 
      fontWeight: COMMUNITY_TYPOGRAPHY.weights.normal, 
      prefix: '' 
    },
    error: { 
      color: COMMUNITY_COLORS.status.error, 
      fontWeight: COMMUNITY_TYPOGRAPHY.weights.semibold, 
      prefix: '✗ ' 
    },
  };
  return formats[type];
}

// ============================================================================
// EFFECT GENERATORS
// ============================================================================

/**
 * Create scan line effect
 */
export function getScanLineStyle() {
  return {
    backgroundImage: `linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px)`,
    backgroundSize: '100% 4px',
    animation: 'scan 8s linear infinite',
  };
}

/**
 * Create matrix grid background
 */
export function getMatrixGridStyle() {
  return {
    backgroundImage: `linear-gradient(${COMMUNITY_COLORS.matrix.dim} 1px, transparent 1px), linear-gradient(90deg, ${COMMUNITY_COLORS.matrix.dim} 1px, transparent 1px)`,
    backgroundSize: '50px 50px',
    opacity: 0.05,
  };
}

/**
 * Create pulse animation effect
 */
export function createPulseAnimation(color: string, duration: number = 2000) {
  return {
    animation: `pulse ${duration}ms infinite`,
    boxShadow: `0 0 20px ${color}`,
  };
}

// ============================================================================
// SIZING HELPERS
// ============================================================================

/**
 * Get responsive spacing
 */
export function getResponsiveSpacing(base: keyof typeof COMMUNITY_SIZING.spacing, multiplier: number = 1) {
  return {
    padding: COMMUNITY_SIZING.spacing[base],
    paddingMobile: `calc(${COMMUNITY_SIZING.spacing[base]} * ${multiplier * 0.6})`,
  };
}

/**
 * Get border radius
 */
export function getBorderRadius(size: keyof typeof COMMUNITY_SIZING.borderRadius): string {
  return COMMUNITY_SIZING.borderRadius[size];
}

/**
 * Get spacing value
 */
export function getSpacing(size: keyof typeof COMMUNITY_SIZING.spacing): string {
  return COMMUNITY_SIZING.spacing[size];
}
