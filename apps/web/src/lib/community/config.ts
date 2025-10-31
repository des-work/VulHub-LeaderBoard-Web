/**
 * Community Terminal Configuration
 * 
 * Single source of truth for the community terminal aesthetic
 * Fine-tune colors, spacing, animations, and effects here
 */

// ============================================================================
// COLOR PALETTE
// ============================================================================

export const COMMUNITY_COLORS = {
  // Primary Matrix Green Palette
  matrix: {
    primary: '#00ff00',
    bright: '#00ff88',
    medium: '#00d900',
    dark: '#00aa00',
    dim: '#008800',
  },
  
  // Cyan Accents
  cyan: {
    primary: '#00ffff',
    bright: '#66ffff',
    medium: '#00d9ff',
    dark: '#00aacc',
  },
  
  // Text Colors
  text: {
    primary: '#00ff00',
    secondary: '#00d900',
    tertiary: '#00ffff',
    muted: '#666666',
    dim: '#444444',
    subtle: '#333333',
  },
  
  // Background Colors
  background: {
    black: '#000000',
    near_black: '#050505',
    dark: '#0a0a0a',
    darker: '#0f0f0f',
    darkest: '#151515',
  },
  
  // Status Colors
  status: {
    success: '#00ff00',
    warning: '#ffff00',
    error: '#ff0000',
    info: '#00ffff',
  },
  
  // Special Effects
  glow: {
    matrix: 'rgba(0, 255, 0, 0.5)',
    matrix_strong: 'rgba(0, 255, 0, 0.8)',
    cyan: 'rgba(0, 255, 255, 0.5)',
    cyan_strong: 'rgba(0, 255, 255, 0.8)',
  },
} as const;

// ============================================================================
// SPACING & SIZING
// ============================================================================

export const COMMUNITY_SIZING = {
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
  },
  
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const COMMUNITY_TYPOGRAPHY = {
  sizes: {
    base: '1rem',
    sm: '0.875rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
  },
  
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },
  
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// ============================================================================
// ANIMATIONS & TRANSITIONS
// ============================================================================

export const COMMUNITY_ANIMATIONS = {
  durations: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 500,
    slower: 800,
    slowest: 1200,
  },
  
  easings: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  typing: {
    fast: 20,
    normal: 30,
    slow: 50,
  },
} as const;

// ============================================================================
// VISUAL EFFECTS
// ============================================================================

export const COMMUNITY_EFFECTS = {
  shadows: {
    default: '0 4px 6px rgba(0, 0, 0, 0.1)',
    hover: '0 10px 15px rgba(0, 0, 0, 0.2)',
    glow: {
      matrix: '0 0 20px rgba(0, 255, 0, 0.5)',
      matrixStrong: '0 0 30px rgba(0, 255, 0, 0.8)',
      cyan: '0 0 20px rgba(0, 255, 255, 0.5)',
      cyanStrong: '0 0 30px rgba(0, 255, 255, 0.8)',
    },
    cyber: '0 8px 32px rgba(0, 255, 0, 0.15), 0 0 8px rgba(0, 255, 0, 0.1)',
  },
  
  blur: {
    none: '0',
    subtle: '4px',
    medium: '8px',
    heavy: '16px',
  },
  
  opacity: {
    transparent: 0,
    subtle: 0.1,
    light: 0.3,
    medium: 0.5,
    heavy: 0.8,
    opaque: 1,
  },
} as const;

// ============================================================================
// BACKGROUND EFFECTS
// ============================================================================

export const COMMUNITY_BACKGROUND_EFFECTS = {
  scanLines: {
    enabled: true,
    opacity: 0.1,
    lineSpacing: '4px',
  },
  
  gridBackground: {
    enabled: true,
    cellSize: '50px 50px',
    opacity: 0.05,
  },
  
  vignette: {
    enabled: true,
    color: 'rgba(0, 0, 0, 0.5)',
    blur: '60px',
  },
} as const;

// ============================================================================
// COMPONENT-SPECIFIC CONFIGS
// ============================================================================

export const COMMUNITY_WELCOME_SCREEN = {
  sizing: {
    borderWidth: '2px',
    padding: '3rem',
    questionSize: '2rem',
    textSize: '1rem',
  },
  
  colors: {
    text: COMMUNITY_COLORS.text.primary,
    accent: COMMUNITY_COLORS.cyan.primary,
    border: `${COMMUNITY_COLORS.matrix.primary}80`,
    glow: COMMUNITY_COLORS.glow.matrix,
  },

  text: {
    question: 'What knowledge do you seek?',
    hint: 'Press Enter or click below to continue →',
  },
} as const;

export const COMMUNITY_TERMINAL_HEADER = {
  sizing: {
    height: '3.5rem',
  },
  
  colors: {
    background: 'rgba(0, 0, 0, 0.9)',
    border: `${COMMUNITY_COLORS.matrix.primary}50`,
    text: COMMUNITY_COLORS.matrix.primary,
    icon: COMMUNITY_COLORS.matrix.primary,
  },
} as const;

export const COMMUNITY_CATEGORY_CARD = {
  sizing: {
    padding: COMMUNITY_SIZING.spacing.lg,
    borderRadius: COMMUNITY_SIZING.borderRadius.lg,
    borderWidth: '1px',
  },
  
  colors: {
    background: 'rgba(20, 20, 20, 0.8)',
    border: COMMUNITY_COLORS.matrix.dim,
    borderHover: COMMUNITY_COLORS.matrix.primary,
    text: COMMUNITY_COLORS.text.primary,
    textHover: COMMUNITY_COLORS.matrix.bright,
    icon: COMMUNITY_COLORS.matrix.medium,
  },
  
  effects: {
    hoverTranslate: '-4px',
    transition: `all ${COMMUNITY_ANIMATIONS.durations.normal}ms ${COMMUNITY_ANIMATIONS.easings.spring}`,
  },
} as const;

export const COMMUNITY_VULNERABILITY_CARD = {
  sizing: {
    padding: COMMUNITY_SIZING.spacing.lg,
    borderRadius: COMMUNITY_SIZING.borderRadius.lg,
    borderWidth: '1px',
    tagPadding: `${COMMUNITY_SIZING.spacing.xs} ${COMMUNITY_SIZING.spacing.sm}`,
  },
  
  colors: {
    background: 'rgba(20, 20, 20, 0.8)',
    border: COMMUNITY_COLORS.matrix.dim,
    borderHover: COMMUNITY_COLORS.cyan.primary,
    text: COMMUNITY_COLORS.text.primary,
    title: COMMUNITY_COLORS.matrix.bright,
    cve: COMMUNITY_COLORS.cyan.medium,
    description: COMMUNITY_COLORS.text.secondary,
    tag: COMMUNITY_COLORS.cyan.primary,
  },

  effects: {
    hoverScale: 1.02,
    transition: 'all 0.3s ease-in-out',
  },
} as const;

export const COMMUNITY_TERMINAL_WINDOW = {
  sizing: {
    padding: COMMUNITY_SIZING.spacing.lg,
    borderRadius: COMMUNITY_SIZING.borderRadius.lg,
    borderWidth: '1px',
    minHeight: '400px',
  },
  
  colors: {
    background: COMMUNITY_COLORS.background.black,
    border: COMMUNITY_COLORS.matrix.dim,
    text: COMMUNITY_COLORS.text.primary,
    headerBg: 'rgba(0, 255, 0, 0.05)',
    headerText: COMMUNITY_COLORS.matrix.bright,
    scrollbar: COMMUNITY_COLORS.matrix.primary,
  },
} as const;

export const COMMUNITY_QUICK_ACTION_BUTTON = {
  sizing: {
    padding: `${COMMUNITY_SIZING.spacing.sm} ${COMMUNITY_SIZING.spacing.md}`,
    borderRadius: COMMUNITY_SIZING.borderRadius.md,
    borderWidth: '1px',
    iconSize: '1.25rem',
  },
  
  colors: {
    background: 'rgba(0, 255, 0, 0.1)',
    border: COMMUNITY_COLORS.matrix.primary,
    text: COMMUNITY_COLORS.matrix.primary,
    icon: COMMUNITY_COLORS.matrix.primary,
    glow: COMMUNITY_COLORS.glow.matrix,
    hover: {
      background: 'rgba(0, 255, 0, 0.2)',
      border: COMMUNITY_COLORS.matrix.bright,
    },
  },

  effects: {
    transition: 'all 0.3s ease-in-out',
    hoverScale: 1.02,
    activeScale: 0.95,
    glowOnHover: true,
  },
} as const;

export const COMMUNITY_SEARCH_INPUT = {
  sizing: {
    padding: `${COMMUNITY_SIZING.spacing.sm} ${COMMUNITY_SIZING.spacing.md}`,
    fontSize: COMMUNITY_TYPOGRAPHY.sizes.base,
  },
  
  colors: {
    background: 'rgba(0, 0, 0, 0.5)',
    border: COMMUNITY_COLORS.matrix.dim,
    text: COMMUNITY_COLORS.text.primary,
    placeholder: COMMUNITY_COLORS.text.muted,
    cursor: COMMUNITY_COLORS.matrix.bright,
  },
  
  effects: {
    cursorWidth: '2px',
    cursorHeight: '1.2em',
    borderAnimationDuration: '2s',
  },
} as const;

// ============================================================================
// LEGACY ALIASES (For backward compatibility)
// ============================================================================

export const COLORS = COMMUNITY_COLORS;
export const SPACING = COMMUNITY_SIZING.spacing;
export const BORDER_RADIUS = COMMUNITY_SIZING.borderRadius;
export const ANIMATIONS = COMMUNITY_ANIMATIONS;
export const EFFECTS = COMMUNITY_EFFECTS;
export const BACKGROUND_EFFECTS = COMMUNITY_BACKGROUND_EFFECTS;
export const TYPOGRAPHY = COMMUNITY_TYPOGRAPHY;
export const WELCOME_SCREEN = COMMUNITY_WELCOME_SCREEN;
export const TERMINAL_HEADER = COMMUNITY_TERMINAL_HEADER;
export const CATEGORY_CARD = COMMUNITY_CATEGORY_CARD;
export const VULNERABILITY_CARD = COMMUNITY_VULNERABILITY_CARD;
export const TERMINAL_WINDOW = COMMUNITY_TERMINAL_WINDOW;
export const QUICK_ACTION_BUTTON = COMMUNITY_QUICK_ACTION_BUTTON;
export const SEARCH_INPUT = COMMUNITY_SEARCH_INPUT;

