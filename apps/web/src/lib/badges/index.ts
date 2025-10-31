/**
 * Badge System - Main Export
 * 
 * Centralized exports for the entire badge system
 */

// Types
export type {
  Badge,
  BadgeStats,
  BadgeFilterOptions,
  BadgeRequirement,
  BadgeTier,
  BadgeRarity,
  BadgeCategory
} from './types';

// Data
export {
  BADGE_DEFINITIONS,
  TIER_COLORS,
  RARITY_COLORS,
  CATEGORY_ICONS
} from './data';

// Utilities
export {
  calculateBadgeStats,
  filterBadges,
  sortBadges,
  calculateBadgeProgress,
  initializeBadges,
  getBadgeById,
  getRecentlyUnlockedBadges,
  getBadgesNearCompletion,
  formatBadgeProgress
} from './utils';

