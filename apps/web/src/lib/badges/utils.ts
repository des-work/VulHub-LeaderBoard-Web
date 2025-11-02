/**
 * Badge Utilities
 * 
 * Helper functions for badge calculations and filtering
 */

import { Badge, BadgeStats, BadgeFilterOptions } from './types';
import { BADGE_DEFINITIONS } from './data';

/**
 * Calculate badge statistics
 */
export function calculateBadgeStats(badges: Badge[]): BadgeStats {
  const stats: BadgeStats = {
    total: badges.length,
    unlocked: 0,
    locked: 0,
    byTier: { bronze: 0, silver: 0, gold: 0, platinum: 0, diamond: 0 },
    byRarity: { common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0 },
    byCategory: { challenge: 0, streak: 0, milestone: 0, special: 0, achievement: 0 },
    totalPoints: 0,
    earnedPoints: 0
  };

  badges.forEach(badge => {
    stats.totalPoints += badge.points;
    stats.byTier[badge.tier]++;
    stats.byRarity[badge.rarity]++;
    stats.byCategory[badge.category]++;

    if (badge.isUnlocked) {
      stats.unlocked++;
      stats.earnedPoints += badge.points;
    } else {
      stats.locked++;
    }
  });

  return stats;
}

/**
 * Filter badges based on criteria
 */
export function filterBadges(badges: Badge[], filters: BadgeFilterOptions): Badge[] {
  let filtered = [...badges];

  // Search query
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(badge =>
      badge.name.toLowerCase().includes(query) ||
      badge.description.toLowerCase().includes(query)
    );
  }

  // Category filter
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(badge => badge.category === filters.category);
  }

  // Tier filter
  if (filters.tier && filters.tier !== 'all') {
    filtered = filtered.filter(badge => badge.tier === filters.tier);
  }

  // Rarity filter
  if (filters.rarity && filters.rarity !== 'all') {
    filtered = filtered.filter(badge => badge.rarity === filters.rarity);
  }

  // Status filter
  if (filters.status && filters.status !== 'all') {
    if (filters.status === 'unlocked') {
      filtered = filtered.filter(badge => badge.isUnlocked);
    } else if (filters.status === 'locked') {
      filtered = filtered.filter(badge => !badge.isUnlocked);
    }
  }

  // Sort
  if (filters.sortBy) {
    filtered = sortBadges(filtered, filters.sortBy, filters.sortOrder || 'asc');
  }

  return filtered;
}

/**
 * Sort badges by criteria
 */
export function sortBadges(
  badges: Badge[],
  sortBy: 'name' | 'points' | 'rarity' | 'progress',
  order: 'asc' | 'desc' = 'asc'
): Badge[] {
  const sorted = [...badges];
  const multiplier = order === 'asc' ? 1 : -1;

  sorted.sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return multiplier * a.name.localeCompare(b.name);
      case 'points':
        return multiplier * (a.points - b.points);
      case 'rarity':
        const rarityOrder = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 };
        return multiplier * (rarityOrder[a.rarity] - rarityOrder[b.rarity]);
      case 'progress':
        const aProgress = calculateBadgeProgress(a);
        const bProgress = calculateBadgeProgress(b);
        return multiplier * (aProgress - bProgress);
      default:
        return 0;
    }
  });

  return sorted;
}

/**
 * Calculate overall progress for a badge
 */
export function calculateBadgeProgress(badge: Badge): number {
  if (badge.isUnlocked) {return 100;}
  if (badge.requirements.length === 0) {return 0;}

  const totalProgress = badge.requirements.reduce((sum, req) => {
    const reqProgress = Math.min((req.progress / req.target) * 100, 100);
    return sum + reqProgress;
  }, 0);

  return totalProgress / badge.requirements.length;
}

/**
 * Initialize badges with user progress
 * In a real app, this would fetch from the backend
 */
export function initializeBadges(userProgress?: Partial<Record<string, number>>): Badge[] {
  return BADGE_DEFINITIONS.map(def => {
    // Mock some unlocked badges for demonstration
    const mockUnlockedIds = ['first-blood', 'consistent', 'point-collector'];
    const isUnlocked = mockUnlockedIds.includes(def.id);

    // Update progress based on mock data
    const requirements = def.requirements.map(req => {
      let progress = userProgress?.[req.id] || 0;
      
      // For demo purposes, add some mock progress
      if (!isUnlocked && Math.random() > 0.5) {
        progress = Math.floor(Math.random() * req.target * 0.7);
      } else if (isUnlocked) {
        progress = req.target;
      }

      return { ...req, progress };
    });

    return {
      ...def,
      requirements,
      isUnlocked,
      unlockedAt: isUnlocked ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : undefined,
      unlockedBy: isUnlocked ? 1 : undefined
    };
  });
}

/**
 * Get badge by ID
 */
export function getBadgeById(badges: Badge[], id: string): Badge | undefined {
  return badges.find(badge => badge.id === id);
}

/**
 * Get recently unlocked badges
 */
export function getRecentlyUnlockedBadges(badges: Badge[], limit: number = 5): Badge[] {
  return badges
    .filter(badge => badge.isUnlocked && badge.unlockedAt)
    .sort((a, b) => {
      if (!a.unlockedAt || !b.unlockedAt) {return 0;}
      return b.unlockedAt.getTime() - a.unlockedAt.getTime();
    })
    .slice(0, limit);
}

/**
 * Get badges close to unlocking
 */
export function getBadgesNearCompletion(badges: Badge[], threshold: number = 75): Badge[] {
  return badges
    .filter(badge => !badge.isUnlocked)
    .map(badge => ({ badge, progress: calculateBadgeProgress(badge) }))
    .filter(({ progress }) => progress >= threshold)
    .sort((a, b) => b.progress - a.progress)
    .map(({ badge }) => badge);
}

/**
 * Format badge progress text
 */
export function formatBadgeProgress(badge: Badge): string {
  if (badge.isUnlocked) {return 'Unlocked';}
  
  const progress = calculateBadgeProgress(badge);
  return `${Math.floor(progress)}% Complete`;
}

