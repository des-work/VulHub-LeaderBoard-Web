/**
 * Badge System Types
 * 
 * Comprehensive type definitions for the badge system
 */

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
export type BadgeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type BadgeCategory = 'challenge' | 'streak' | 'milestone' | 'special' | 'achievement';

export interface BadgeRequirement {
  id: string;
  description: string;
  progress: number;
  target: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: BadgeCategory;
  tier: BadgeTier;
  rarity: BadgeRarity;
  points: number;
  icon: string;
  requirements: BadgeRequirement[];
  isUnlocked: boolean;
  unlockedAt?: Date;
  unlockedBy?: number; // User ID
}

export interface BadgeStats {
  total: number;
  unlocked: number;
  locked: number;
  byTier: Record<BadgeTier, number>;
  byRarity: Record<BadgeRarity, number>;
  byCategory: Record<BadgeCategory, number>;
  totalPoints: number;
  earnedPoints: number;
}

export interface BadgeFilterOptions {
  searchQuery?: string;
  category?: BadgeCategory | 'all';
  tier?: BadgeTier | 'all';
  rarity?: BadgeRarity | 'all';
  status?: 'all' | 'unlocked' | 'locked';
  sortBy?: 'name' | 'points' | 'rarity' | 'progress';
  sortOrder?: 'asc' | 'desc';
}
