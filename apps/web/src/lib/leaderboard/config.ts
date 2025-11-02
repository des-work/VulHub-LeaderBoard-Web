/**
 * Leaderboard Configuration System
 * 
 * Single source of truth for all leaderboard styling and behavior
 * Fine-tune every aspect of the leaderboard appearance
 */

// ============================================================================
// COLOR PALETTE
// ============================================================================

export const LEADERBOARD_COLORS = {
  // Matrix Green Palette (Primary)
  matrix: {
    primary: '#00ff00',
    bright: '#00ff88',
    medium: '#00d900',
    dark: '#00aa00',
    dim: '#008800',
    glow: 'rgba(0, 255, 0, 0.5)',
    glowStrong: 'rgba(0, 255, 0, 0.8)',
  },
  
  // Cyan Accents
  cyan: {
    primary: '#00ffff',
    bright: '#66ffff',
    medium: '#00d9ff',
    dark: '#00aacc',
  },
  
  // Rank Colors
  rank: {
    first: {
      primary: '#fbbf24',    // Gold
      secondary: '#f59e0b',
      text: '#000000',
      gradient: 'from-yellow-400 to-amber-500',
      glow: 'rgba(251, 191, 36, 0.6)',
    },
    second: {
      primary: '#d1d5db',    // Silver
      secondary: '#9ca3af',
      text: '#000000',
      gradient: 'from-gray-300 to-gray-400',
      glow: 'rgba(209, 213, 219, 0.6)',
    },
    third: {
      primary: '#d97706',    // Bronze
      secondary: '#b45309',
      text: '#000000',
      gradient: 'from-amber-600 to-amber-700',
      glow: 'rgba(217, 119, 6, 0.6)',
    },
  },
  
  // Status Colors
  status: {
    fire: {
      primary: '#ef4444',
      secondary: '#f97316',
      background: 'rgba(239, 68, 68, 0.1)',
      border: 'rgba(239, 68, 68, 0.3)',
      glow: 'rgba(239, 68, 68, 0.5)',
    },
    close: {
      primary: '#eab308',
      secondary: '#f59e0b',
      background: 'rgba(234, 179, 8, 0.1)',
      border: 'rgba(234, 179, 8, 0.3)',
      glow: 'rgba(234, 179, 8, 0.5)',
    },
    trending: {
      primary: '#10b981',
      secondary: '#059669',
      background: 'rgba(16, 185, 129, 0.1)',
      border: 'rgba(16, 185, 129, 0.3)',
    },
  },
  
  // Text Colors
  text: {
    primary: '#ffffff',
    bright: '#f5f5f5',
    secondary: '#00d900',
    muted: '#999999',
    dim: '#666666',
    subtle: '#444444',
  },
  
  // Background Colors
  background: {
    main: '#000000',
    card: 'rgba(23, 23, 23, 0.3)',
    cardHover: 'rgba(38, 38, 38, 0.5)',
    row: 'rgba(23, 23, 23, 0.5)',
    rowHover: 'rgba(38, 38, 38, 0.7)',
    top3: 'rgba(0, 50, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.8)',
  },
  
  // Border Colors
  border: {
    default: 'rgba(64, 64, 64, 0.5)',
    matrix: 'rgba(0, 255, 0, 0.4)',
    top3: 'rgba(0, 255, 0, 0.6)',
    hover: 'rgba(0, 255, 0, 0.6)',
  },
} as const;

// ============================================================================
// SIZING & SPACING
// ============================================================================

export const LEADERBOARD_SIZING = {
  // Component Heights
  height: {
    row: {
      default: '5rem',      // 80px
      compact: '4rem',      // 64px
      comfortable: '6rem',  // 96px
      top3: '6.5rem',       // 104px
    },
    progressBar: {
      thin: '0.25rem',      // 4px
      medium: '0.5rem',     // 8px
      thick: '0.75rem',     // 12px
    },
  },
  
  // Padding & Margins
  spacing: {
    rowGap: '0.75rem',      // 12px
    rowPadding: {
      default: '0.75rem',   // 12px
      top3: '1rem',         // 16px
    },
    cardPadding: '1.5rem',  // 24px
    sectionGap: '1.5rem',   // 24px
  },
  
  // Badge Sizes
  badge: {
    small: {
      size: '2.5rem',       // 40px
      icon: '1.25rem',      // 20px
      font: '1rem',         // 16px
    },
    medium: {
      size: '3rem',         // 48px
      icon: '1.5rem',       // 24px
      font: '1.125rem',     // 18px
    },
    large: {
      size: '4rem',         // 64px
      icon: '2rem',         // 32px
      font: '1.5rem',       // 24px
    },
  },
  
  // Border Widths
  borderWidth: {
    thin: '1px',
    medium: '2px',
    thick: '3px',
  },
  
  // Border Radius
  borderRadius: {
    small: '0.5rem',        // 8px
    medium: '0.75rem',      // 12px
    large: '1rem',          // 16px
    full: '9999px',
  },
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const LEADERBOARD_TYPOGRAPHY = {
  // Font Sizes
  sizes: {
    rankNumber: {
      small: '1rem',        // 16px
      medium: '1.125rem',   // 18px
      large: '1.5rem',      // 24px
    },
    playerName: {
      default: '1.125rem',  // 18px
      top3: '1.25rem',      // 20px
    },
    points: {
      default: '1.5rem',    // 24px
      top3: '1.875rem',     // 30px
    },
    label: {
      small: '0.75rem',     // 12px
      medium: '0.875rem',   // 14px
    },
  },
  
  // Font Weights
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },
  
  // Letter Spacing
  tracking: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// ============================================================================
// ANIMATION & TRANSITIONS
// ============================================================================

export const LEADERBOARD_ANIMATIONS = {
  // Duration in milliseconds
  durations: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 500,
    slower: 800,
    slowest: 1200,
    progressBar: 1000,
  },
  
  // Easing Functions
  easings: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // Stagger delays for list items
  stagger: {
    base: 50,               // 50ms per item
    fast: 30,
    slow: 80,
  },
  
  // Hover Effects
  hover: {
    scale: 1.02,
    scaleTop3: 1.03,
    translateY: '-2px',
  },
} as const;

// ============================================================================
// VISUAL EFFECTS
// ============================================================================

export const LEADERBOARD_EFFECTS = {
  // Shadows
  shadows: {
    default: '0 4px 6px rgba(0, 0, 0, 0.1)',
    hover: '0 10px 15px rgba(0, 0, 0, 0.2)',
    glow: {
      matrix: '0 0 20px rgba(0, 255, 0, 0.5)',
      matrixStrong: '0 0 30px rgba(0, 255, 0, 0.8)',
      rank1: '0 0 25px rgba(251, 191, 36, 0.6)',
      rank2: '0 0 20px rgba(209, 213, 219, 0.6)',
      rank3: '0 0 20px rgba(217, 119, 6, 0.6)',
    },
    cyber: '0 8px 32px rgba(0, 255, 0, 0.15), 0 0 8px rgba(0, 255, 0, 0.1)',
  },
  
  // Blur Effects
  blur: {
    none: '0',
    subtle: '4px',
    medium: '8px',
    heavy: '16px',
  },
  
  // Gradients
  gradients: {
    progressBar: 'linear-gradient(to right, #00d900, #00ffff, #00d900)',
    top3Background: 'linear-gradient(to right, rgba(0, 50, 0, 0.5), rgba(23, 23, 23, 0.8), rgba(0, 50, 0, 0.5))',
    scanLine: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3), transparent)',
  },
  
  // Opacity Levels
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
// COMPONENT-SPECIFIC CONFIGS
// ============================================================================

export const LEADERBOARD_ROW_CONFIG = {
  // Default Row
  default: {
    padding: LEADERBOARD_SIZING.spacing.rowPadding.default,
    height: LEADERBOARD_SIZING.height.row.default,
    borderWidth: LEADERBOARD_SIZING.borderWidth.thin,
    borderRadius: LEADERBOARD_SIZING.borderRadius.large,
    backgroundColor: LEADERBOARD_COLORS.background.card,
    borderColor: LEADERBOARD_COLORS.border.default,
    hoverBackground: LEADERBOARD_COLORS.background.cardHover,
    hoverBorderColor: LEADERBOARD_COLORS.border.hover,
    hoverScale: LEADERBOARD_ANIMATIONS.hover.scale,
    showScanLine: false,
    glowEffect: false,
  },
  
  // Top 3 Row
  top3: {
    padding: LEADERBOARD_SIZING.spacing.rowPadding.top3,
    height: LEADERBOARD_SIZING.height.row.top3,
    borderWidth: LEADERBOARD_SIZING.borderWidth.medium,
    borderRadius: LEADERBOARD_SIZING.borderRadius.large,
    backgroundColor: LEADERBOARD_COLORS.background.top3,
    borderColor: LEADERBOARD_COLORS.border.top3,
    hoverBackground: LEADERBOARD_COLORS.background.cardHover,
    hoverBorderColor: LEADERBOARD_COLORS.border.hover,
    hoverScale: LEADERBOARD_ANIMATIONS.hover.scaleTop3,
    showScanLine: true,
    glowEffect: true,
  },
  
  // Current User Row
  currentUser: {
    ringWidth: '2px',
    ringColor: LEADERBOARD_COLORS.matrix.primary,
    ringOffset: '2px',
    ringOffsetColor: LEADERBOARD_COLORS.background.main,
    pulseEffect: true,
  },
} as const;

export const PROGRESS_BAR_CONFIG = {
  height: LEADERBOARD_SIZING.height.progressBar.medium,
  borderRadius: LEADERBOARD_SIZING.borderRadius.full,
  backgroundColor: LEADERBOARD_COLORS.background.row,
  fillGradient: LEADERBOARD_EFFECTS.gradients.progressBar,
  animationDuration: LEADERBOARD_ANIMATIONS.durations.progressBar,
  animationEasing: LEADERBOARD_ANIMATIONS.easings.easeOut,
  showScanLine: true,
  scanLineAnimation: true,
} as const;

export const RANK_BADGE_CONFIG = {
  // Size variants
  size: LEADERBOARD_SIZING.badge.medium,
  borderRadius: LEADERBOARD_SIZING.borderRadius.full,
  
  // Rank 1 (Gold)
  rank1: {
    gradient: LEADERBOARD_COLORS.rank.first.gradient,
    iconColor: '#000000',
    textColor: LEADERBOARD_COLORS.rank.first.text,
    pulseEffect: true,
    bounceEffect: true,
    glowColor: LEADERBOARD_COLORS.rank.first.glow,
  },
  
  // Rank 2 (Silver)
  rank2: {
    gradient: LEADERBOARD_COLORS.rank.second.gradient,
    iconColor: '#000000',
    textColor: LEADERBOARD_COLORS.rank.second.text,
    glowColor: LEADERBOARD_COLORS.rank.second.glow,
    pulseEffect: true,
    bounceEffect: false,
  },
  
  // Rank 3 (Bronze)
  rank3: {
    gradient: LEADERBOARD_COLORS.rank.third.gradient,
    iconColor: '#000000',
    textColor: LEADERBOARD_COLORS.rank.third.text,
    glowColor: LEADERBOARD_COLORS.rank.third.glow,
    pulseEffect: true,
    bounceEffect: false,
  },
  
  // Default (4+)
  default: {
    backgroundColor: LEADERBOARD_COLORS.background.row,
    borderColor: LEADERBOARD_COLORS.border.matrix,
    borderWidth: LEADERBOARD_SIZING.borderWidth.thin,
    textColor: LEADERBOARD_COLORS.matrix.primary,
    glowColor: 'rgba(0, 255, 0, 0.5)',
    gradient: 'from-green-400 to-green-600',
    iconColor: LEADERBOARD_COLORS.matrix.bright,
    pulseEffect: false,
    bounceEffect: false,
  },
} as const;

export const STATUS_BADGE_CONFIG = {
  borderRadius: LEADERBOARD_SIZING.borderRadius.full,
  padding: {
    compact: '0.25rem 0.5rem',
    default: '0.375rem 0.75rem',
  },
  
  // Fire Status
  fire: {
    backgroundColor: LEADERBOARD_COLORS.status.fire.background,
    borderColor: LEADERBOARD_COLORS.status.fire.border,
    textColor: LEADERBOARD_COLORS.status.fire.primary,
    iconColor: LEADERBOARD_COLORS.status.fire.primary,
    pulseEffect: true,
    glowEffect: true,
  },
  
  // Close Status
  close: {
    backgroundColor: LEADERBOARD_COLORS.status.close.background,
    borderColor: LEADERBOARD_COLORS.status.close.border,
    textColor: LEADERBOARD_COLORS.status.close.primary,
    iconColor: LEADERBOARD_COLORS.status.close.primary,
    pulseEffect: false,
    glowEffect: false,
  },
  
  // Trending Status
  trending: {
    backgroundColor: LEADERBOARD_COLORS.status.trending.background,
    borderColor: LEADERBOARD_COLORS.status.trending.border,
    textColor: LEADERBOARD_COLORS.status.trending.primary,
    iconColor: LEADERBOARD_COLORS.status.trending.primary,
    pulseEffect: false,
    glowEffect: false,
  },
} as const;

export const TREND_INDICATOR_CONFIG = {
  iconSize: '1rem',
  fontSize: '0.75rem',
  fontWeight: LEADERBOARD_TYPOGRAPHY.weights.semibold,
  
  // Up Trend
  up: {
    show: true,
    iconColor: LEADERBOARD_COLORS.matrix.primary,
    textColor: LEADERBOARD_COLORS.matrix.primary,
    glowEffect: true,
  },
  
  // Down Trend
  down: {
    show: true,
    iconColor: '#ef4444',
    textColor: '#ef4444',
    glowEffect: false,
  },
  
  // Stable
  stable: {
    show: false,
    iconColor: '#999999',
    textColor: '#999999',
    glowEffect: false,
  },
} as const;

// ============================================================================
// LEADERBOARD CONTAINER CONFIG
// ============================================================================

export const LEADERBOARD_CONTAINER_CONFIG = {
  card: {
    backgroundColor: LEADERBOARD_COLORS.background.card,
    borderColor: LEADERBOARD_COLORS.border.matrix,
    borderWidth: LEADERBOARD_SIZING.borderWidth.medium,
    borderRadius: LEADERBOARD_SIZING.borderRadius.large,
    padding: LEADERBOARD_SIZING.spacing.cardPadding,
    shadow: LEADERBOARD_EFFECTS.shadows.cyber,
  },
  
  header: {
    marginBottom: LEADERBOARD_SIZING.spacing.sectionGap,
    titleColor: LEADERBOARD_COLORS.matrix.primary,
    subtitleColor: LEADERBOARD_COLORS.text.muted,
    iconSize: '1.5rem',
  },
  
  list: {
    gap: LEADERBOARD_SIZING.spacing.rowGap,
  },
  
  liveIndicator: {
    dotSize: '0.5rem',
    dotColor: '#ef4444',
    textColor: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: LEADERBOARD_SIZING.borderRadius.full,
    pulseEffect: true,
  },
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getRankConfig(rank: number) {
  if (rank === 1) return RANK_BADGE_CONFIG.rank1;
  if (rank === 2) return RANK_BADGE_CONFIG.rank2;
  if (rank === 3) return RANK_BADGE_CONFIG.rank3;
  return RANK_BADGE_CONFIG.default;
}

export function getRowConfig(rank: number, isCurrentUser: boolean) {
  const baseConfig = rank <= 3 ? LEADERBOARD_ROW_CONFIG.top3 : LEADERBOARD_ROW_CONFIG.default;
  
  if (isCurrentUser) {
    return {
      ...baseConfig,
      ...LEADERBOARD_ROW_CONFIG.currentUser,
    };
  }
  
  return baseConfig;
}

export function rgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

