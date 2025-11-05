/**
 * Leaderboard Utility Functions
 * 
 * Helper functions for styling, animations, and visual effects
 */

import {
  LEADERBOARD_COLORS,
  LEADERBOARD_SIZING,
  LEADERBOARD_ANIMATIONS,
  LEADERBOARD_EFFECTS,
  getRankConfig,
  getRowConfig,
} from './config';

/**
 * Create glow effect style object
 */
export function createLeaderboardGlow(rank: number, intensity: 'default' | 'strong' = 'default') {
  const glowMap = {
    1: LEADERBOARD_EFFECTS.shadows.glow.rank1,
    2: LEADERBOARD_EFFECTS.shadows.glow.rank2,
    3: LEADERBOARD_EFFECTS.shadows.glow.rank3,
  };
  
  const glow = glowMap[rank as keyof typeof glowMap] || (
    intensity === 'strong' 
      ? LEADERBOARD_EFFECTS.shadows.glow.matrixStrong 
      : LEADERBOARD_EFFECTS.shadows.glow.matrix
  );
  
  return {
    boxShadow: glow,
  };
}

/**
 * Create row background gradient
 */
export function createRowGradient(rank: number) {
  if (rank <= 3) {
    return {
      background: LEADERBOARD_EFFECTS.gradients.top3Background,
    };
  }
  
  return {
    backgroundColor: LEADERBOARD_COLORS.background.card,
  };
}

/**
 * Create hover effect styles
 */
export function createLeaderboardHoverEffect(rank: number, options?: {
  translateY?: string;
  scale?: number;
  shadow?: string;
}) {
  const config = getRowConfig(rank, false);
  
  return {
    transform: `scale(${options?.scale || config.hoverScale}) translateY(${options?.translateY || LEADERBOARD_ANIMATIONS.hover.translateY})`,
    boxShadow: options?.shadow || LEADERBOARD_EFFECTS.shadows.hover,
    borderColor: config.hoverBorderColor || LEADERBOARD_COLORS.border.hover,
    backgroundColor: config.hoverBackground || LEADERBOARD_COLORS.background.cardHover,
    transition: `all ${LEADERBOARD_ANIMATIONS.durations.normal}ms ${LEADERBOARD_ANIMATIONS.easings.smooth}`,
  };
}

/**
 * Create progress bar fill style
 */
export function createProgressBarFill(percentage: number, animated: boolean = true) {
  return {
    width: `${Math.min(percentage, 100)}%`,
    background: LEADERBOARD_EFFECTS.gradients.progressBar,
    transition: animated 
      ? `width ${LEADERBOARD_ANIMATIONS.durations.progressBar}ms ${LEADERBOARD_ANIMATIONS.easings.easeOut}` 
      : 'none',
    height: '100%',
    borderRadius: LEADERBOARD_SIZING.borderRadius.full,
  };
}

/**
 * Create scan line animation style
 */
export function createScanLineEffect() {
  return {
    background: LEADERBOARD_EFFECTS.gradients.scanLine,
    animation: 'scan-line 2s linear infinite',
  };
}

/**
 * Get stagger animation delay
 */
export function getStaggerDelay(index: number, speed: 'fast' | 'normal' | 'slow' = 'normal'): number {
  const delays = {
    fast: LEADERBOARD_ANIMATIONS.stagger.fast,
    normal: LEADERBOARD_ANIMATIONS.stagger.base,
    slow: LEADERBOARD_ANIMATIONS.stagger.slow,
  };
  
  return index * delays[speed];
}

/**
 * Format rank display text
 */
export function formatRank(rank: number): string {
  if (rank <= 3) {return '';}  // Top 3 use icons
  return `#${rank}`;
}

/**
 * Format points with thousand separators
 */
export function formatPoints(points: number): string {
  return points.toLocaleString();
}

/**
 * Calculate percentage for progress bar
 */
export function calculatePercentage(points: number, maxPoints: number): number {
  return Math.min((points / maxPoints) * 100, 100);
}

/**
 * Get badge size styles
 */
export function getBadgeSizeStyles(size: 'small' | 'medium' | 'large' = 'medium') {
  const config = LEADERBOARD_SIZING.badge[size];
  
  return {
    width: config.size,
    height: config.size,
    iconSize: config.icon,
    fontSize: config.font,
  };
}

/**
 * Create ring effect for current user
 */
export function createCurrentUserRing() {
  const config = getRowConfig(1, true) as any;
  
  return {
    boxShadow: `0 0 0 ${config.ringWidth || '2px'} ${config.ringColor || 'transparent'}, 0 0 0 ${(parseInt(config.ringWidth || '2') + parseInt(config.ringOffset || '2'))}px ${config.ringOffsetColor || 'transparent'}`,
    animation: config.pulseEffect ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none',
  };
}

/**
 * Create rank badge background
 */
export function createRankBadgeBackground(rank: number) {
  const config = getRankConfig(rank) as any;
  
  if ('gradient' in config) {
    return {
      background: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
      className: `bg-gradient-to-br ${config.gradient}`,
    };
  }
  
  return {
    backgroundColor: config.backgroundColor || 'transparent',
    borderColor: config.borderColor || 'transparent',
    borderWidth: config.borderWidth || '1px',
  };
}

/**
 * Create status badge styles
 */
export function createStatusBadgeStyles(status: 'fire' | 'close' | 'trending', compact: boolean = false) {
  const statusConfigs = {
    fire: {
      backgroundColor: LEADERBOARD_COLORS.status.fire.background,
      borderColor: LEADERBOARD_COLORS.status.fire.border,
      color: LEADERBOARD_COLORS.status.fire.primary,
    },
    close: {
      backgroundColor: LEADERBOARD_COLORS.status.close.background,
      borderColor: LEADERBOARD_COLORS.status.close.border,
      color: LEADERBOARD_COLORS.status.close.primary,
    },
    trending: {
      backgroundColor: LEADERBOARD_COLORS.status.trending.background,
      borderColor: LEADERBOARD_COLORS.status.trending.border,
      color: LEADERBOARD_COLORS.status.trending.primary,
    },
  };
  
  const config = statusConfigs[status];
  const padding = compact ? '0.25rem 0.5rem' : '0.375rem 0.75rem';
  
  return {
    ...config,
    padding,
    borderRadius: LEADERBOARD_SIZING.borderRadius.full,
    border: `1px solid ${config.borderColor}`,
  };
}

/**
 * Create trend indicator styles
 */
export function createTrendIndicatorStyles(trend: 'up' | 'down' | 'stable') {
  const trendConfigs = {
    up: {
      color: LEADERBOARD_COLORS.matrix.primary,
      iconColor: LEADERBOARD_COLORS.matrix.primary,
    },
    down: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
    stable: {
      color: '#999999',
      iconColor: '#999999',
      display: 'none',
    },
  };
  
  return trendConfigs[trend];
}

/**
 * Get animation duration
 */
export function getAnimationDuration(variant: keyof typeof LEADERBOARD_ANIMATIONS.durations): number {
  return LEADERBOARD_ANIMATIONS.durations[variant];
}

/**
 * Create border with glow effect
 */
export function createBorderGlow(rank: number) {
  const config = getRowConfig(rank, false);
  
  return {
    borderWidth: config.borderWidth,
    borderColor: config.borderColor,
    borderStyle: 'solid',
    boxShadow: rank <= 3 ? createLeaderboardGlow(rank).boxShadow : 'none',
  };
}

/**
 * Create text glow effect
 */
export function createTextGlow(color: string, intensity: 'low' | 'medium' | 'high' = 'medium') {
  const intensities = {
    low: `0 0 10px ${color}`,
    medium: `0 0 15px ${color}, 0 0 30px ${color}`,
    high: `0 0 20px ${color}, 0 0 40px ${color}, 0 0 60px ${color}`,
  };
  
  return {
    textShadow: intensities[intensity],
  };
}

/**
 * Get responsive sizing
 */
export function getResponsiveRowHeight(
  variant: 'default' | 'compact' | 'comfortable' | 'top3' = 'default'
) {
  return LEADERBOARD_SIZING.height.row[variant];
}

/**
 * Create live indicator pulse
 */
export function createLiveIndicatorPulse() {
  return {
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    boxShadow: `0 0 10px ${LEADERBOARD_COLORS.status.fire.primary}`,
  };
}

/**
 * Get color by rank
 */
export function getColorByRank(rank: number): string {
  if (rank === 1) {return LEADERBOARD_COLORS.rank.first.primary;}
  if (rank === 2) {return LEADERBOARD_COLORS.rank.second.primary;}
  if (rank === 3) {return LEADERBOARD_COLORS.rank.third.primary;}
  return LEADERBOARD_COLORS.matrix.primary;
}

/**
 * Create fade-in animation
 */
export function createFadeInAnimation(delay: number = 0) {
  return {
    animation: `fadeIn ${LEADERBOARD_ANIMATIONS.durations.normal}ms ${LEADERBOARD_ANIMATIONS.easings.smooth} ${delay}ms both`,
  };
}

// Re-export config helper functions
export { getRankConfig, getRowConfig } from './config';

