/**
 * Badge Data
 * 
 * All available badges in the system
 */

import { Badge, BadgeCategory, BadgeTier, BadgeRarity } from './types';

export const BADGE_DEFINITIONS: Omit<Badge, 'isUnlocked' | 'unlockedAt' | 'unlockedBy'>[] = [
  // Challenge Badges
  {
    id: 'first-blood',
    name: 'First Blood',
    description: 'Complete your first VulHub challenge',
    category: 'challenge',
    tier: 'bronze',
    rarity: 'common',
    points: 10,
    icon: '🎯',
    requirements: [
      { id: 'complete-1', description: 'Complete 1 challenge', progress: 0, target: 1 }
    ]
  },
  {
    id: 'challenge-master',
    name: 'Challenge Master',
    description: 'Complete 10 VulHub challenges',
    category: 'challenge',
    tier: 'silver',
    rarity: 'uncommon',
    points: 50,
    icon: '🏆',
    requirements: [
      { id: 'complete-10', description: 'Complete 10 challenges', progress: 0, target: 10 }
    ]
  },
  {
    id: 'elite-hacker',
    name: 'Elite Hacker',
    description: 'Complete 25 VulHub challenges',
    category: 'challenge',
    tier: 'gold',
    rarity: 'rare',
    points: 150,
    icon: '👑',
    requirements: [
      { id: 'complete-25', description: 'Complete 25 challenges', progress: 0, target: 25 }
    ]
  },
  {
    id: 'legendary-exploiter',
    name: 'Legendary Exploiter',
    description: 'Complete 50 VulHub challenges',
    category: 'challenge',
    tier: 'diamond',
    rarity: 'legendary',
    points: 500,
    icon: '💎',
    requirements: [
      { id: 'complete-50', description: 'Complete 50 challenges', progress: 0, target: 50 }
    ]
  },

  // Streak Badges
  {
    id: 'consistent',
    name: 'Consistent',
    description: 'Complete challenges 3 days in a row',
    category: 'streak',
    tier: 'bronze',
    rarity: 'common',
    points: 15,
    icon: '🔥',
    requirements: [
      { id: 'streak-3', description: '3 day streak', progress: 0, target: 3 }
    ]
  },
  {
    id: 'dedicated',
    name: 'Dedicated',
    description: 'Complete challenges 7 days in a row',
    category: 'streak',
    tier: 'silver',
    rarity: 'uncommon',
    points: 30,
    icon: '⚡',
    requirements: [
      { id: 'streak-7', description: '7 day streak', progress: 0, target: 7 }
    ]
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: 'Complete challenges 30 days in a row',
    category: 'streak',
    tier: 'platinum',
    rarity: 'epic',
    points: 200,
    icon: '🌟',
    requirements: [
      { id: 'streak-30', description: '30 day streak', progress: 0, target: 30 }
    ]
  },

  // Milestone Badges
  {
    id: 'point-collector',
    name: 'Point Collector',
    description: 'Earn 1,000 points',
    category: 'milestone',
    tier: 'silver',
    rarity: 'uncommon',
    points: 25,
    icon: '💰',
    requirements: [
      { id: 'points-1000', description: 'Earn 1,000 points', progress: 0, target: 1000 }
    ]
  },
  {
    id: 'point-master',
    name: 'Point Master',
    description: 'Earn 5,000 points',
    category: 'milestone',
    tier: 'gold',
    rarity: 'rare',
    points: 100,
    icon: '💎',
    requirements: [
      { id: 'points-5000', description: 'Earn 5,000 points', progress: 0, target: 5000 }
    ]
  },
  {
    id: 'rank-climber',
    name: 'Rank Climber',
    description: 'Reach top 10 on the leaderboard',
    category: 'milestone',
    tier: 'gold',
    rarity: 'rare',
    points: 75,
    icon: '📈',
    requirements: [
      { id: 'rank-10', description: 'Reach rank 10 or better', progress: 0, target: 10 }
    ]
  },
  {
    id: 'champion',
    name: 'Champion',
    description: 'Reach #1 on the leaderboard',
    category: 'milestone',
    tier: 'diamond',
    rarity: 'legendary',
    points: 500,
    icon: '👑',
    requirements: [
      { id: 'rank-1', description: 'Reach rank 1', progress: 0, target: 1 }
    ]
  },

  // Special Badges
  {
    id: 'early-adopter',
    name: 'Early Adopter',
    description: 'Joined VulHub in the first month',
    category: 'special',
    tier: 'platinum',
    rarity: 'epic',
    points: 100,
    icon: '🌅',
    requirements: [
      { id: 'join-early', description: 'Join in first month', progress: 0, target: 1 }
    ]
  },
  {
    id: 'community-helper',
    name: 'Community Helper',
    description: 'Help 10 people in the community forum',
    category: 'special',
    tier: 'gold',
    rarity: 'rare',
    points: 50,
    icon: '🤝',
    requirements: [
      { id: 'help-10', description: 'Help 10 community members', progress: 0, target: 10 }
    ]
  },
  {
    id: 'writeup-author',
    name: 'Writeup Author',
    description: 'Post 5 detailed challenge writeups',
    category: 'special',
    tier: 'gold',
    rarity: 'rare',
    points: 75,
    icon: '📝',
    requirements: [
      { id: 'writeups-5', description: 'Post 5 writeups', progress: 0, target: 5 }
    ]
  },

  // Achievement Badges - Category Specific
  {
    id: 'auth-breaker',
    name: 'Auth Breaker',
    description: 'Complete 5 authentication bypass challenges',
    category: 'achievement',
    tier: 'silver',
    rarity: 'uncommon',
    points: 40,
    icon: '🔓',
    requirements: [
      { id: 'auth-5', description: 'Complete 5 auth bypass challenges', progress: 0, target: 5 }
    ]
  },
  {
    id: 'rce-expert',
    name: 'RCE Expert',
    description: 'Complete 10 RCE challenges',
    category: 'achievement',
    tier: 'gold',
    rarity: 'rare',
    points: 100,
    icon: '💻',
    requirements: [
      { id: 'rce-10', description: 'Complete 10 RCE challenges', progress: 0, target: 10 }
    ]
  },
  {
    id: 'sql-ninja',
    name: 'SQL Ninja',
    description: 'Complete 5 SQL injection challenges',
    category: 'achievement',
    tier: 'silver',
    rarity: 'uncommon',
    points: 40,
    icon: '💉',
    requirements: [
      { id: 'sql-5', description: 'Complete 5 SQL injection challenges', progress: 0, target: 5 }
    ]
  },
  {
    id: 'xss-master',
    name: 'XSS Master',
    description: 'Complete all XSS challenges',
    category: 'achievement',
    tier: 'silver',
    rarity: 'uncommon',
    points: 30,
    icon: '🔗',
    requirements: [
      { id: 'xss-all', description: 'Complete all XSS challenges', progress: 0, target: 2 }
    ]
  },
  {
    id: 'framework-hunter',
    name: 'Framework Hunter',
    description: 'Complete 8 framework vulnerability challenges',
    category: 'achievement',
    tier: 'gold',
    rarity: 'rare',
    points: 80,
    icon: '🏗️',
    requirements: [
      { id: 'framework-8', description: 'Complete 8 framework challenges', progress: 0, target: 8 }
    ]
  },

  // More Special Badges
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Complete a challenge in under 5 minutes',
    category: 'special',
    tier: 'silver',
    rarity: 'uncommon',
    points: 35,
    icon: '⚡',
    requirements: [
      { id: 'speed-5min', description: 'Complete challenge under 5 minutes', progress: 0, target: 1 }
    ]
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Complete 10 challenges after midnight',
    category: 'special',
    tier: 'bronze',
    rarity: 'common',
    points: 20,
    icon: '🦉',
    requirements: [
      { id: 'midnight-10', description: 'Complete 10 challenges after midnight', progress: 0, target: 10 }
    ]
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Complete 5 challenges without any hints',
    category: 'special',
    tier: 'platinum',
    rarity: 'epic',
    points: 150,
    icon: '✨',
    requirements: [
      { id: 'no-hints-5', description: 'Complete 5 challenges without hints', progress: 0, target: 5 }
    ]
  }
];

// Tier Colors
export const TIER_COLORS: Record<BadgeTier, string> = {
  bronze: 'bg-amber-600',
  silver: 'bg-gray-400',
  gold: 'bg-yellow-400',
  platinum: 'bg-cyan-400',
  diamond: 'bg-pink-400'
};

// Rarity Colors
export const RARITY_COLORS: Record<BadgeRarity, string> = {
  common: 'bg-gray-500',
  uncommon: 'bg-green-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-orange-500'
};

// Category Icons
export const CATEGORY_ICONS: Record<BadgeCategory, string> = {
  challenge: '🎯',
  streak: '🔥',
  milestone: '📊',
  special: '⭐',
  achievement: '🏆'
};

// ============================================================================
// BADGE HELPER FUNCTIONS
// ============================================================================

/**
 * Get all badge definitions
 */
export function getAllBadges(): typeof BADGE_DEFINITIONS {
  return BADGE_DEFINITIONS;
}

/**
 * Get user's earned badges
 * Note: This is a placeholder - in production, this would fetch from the API
 */
export function getUserBadges(userId: string): typeof BADGE_DEFINITIONS {
  // Placeholder: Return empty array
  // In production, this would fetch user's unlocked badges from the API
  return [];
}

