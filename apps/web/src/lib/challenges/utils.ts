/**
 * Challenge Utilities
 * 
 * Helper functions for challenge filtering, sorting, and statistics
 */

import { Challenge, Difficulty } from './types';

export interface ChallengeFilterOptions {
  searchQuery?: string;
  category?: string | 'all';
  difficulty?: Difficulty | 'all';
  route?: string | 'all';
  sortBy?: 'title' | 'points' | 'difficulty' | 'category';
  sortOrder?: 'asc' | 'desc';
}

export interface ChallengeStats {
  total: number;
  byDifficulty: Record<Difficulty, number>;
  byCategory: Record<string, number>;
  totalPoints: number;
  averagePoints: number;
}

/**
 * Filter challenges based on criteria
 */
export function filterChallenges(
  challenges: Challenge[],
  filters: ChallengeFilterOptions
): Challenge[] {
  let filtered = [...challenges];

  // Search query
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(challenge =>
      challenge.title.toLowerCase().includes(query) ||
      challenge.category.toLowerCase().includes(query) ||
      challenge.tags.some(tag => tag.toLowerCase().includes(query)) ||
      (challenge.cve && challenge.cve.toLowerCase().includes(query))
    );
  }

  // Category filter
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(challenge => challenge.category === filters.category);
  }

  // Difficulty filter
  if (filters.difficulty && filters.difficulty !== 'all') {
    filtered = filtered.filter(challenge => challenge.difficulty === filters.difficulty);
  }

  // Route filter
  if (filters.route && filters.route !== 'all') {
    filtered = filtered.filter(challenge => challenge.routeIds.includes(filters.route!));
  }

  // Sort
  if (filters.sortBy) {
    filtered = sortChallenges(filtered, filters.sortBy, filters.sortOrder || 'asc');
  }

  return filtered;
}

/**
 * Sort challenges by criteria
 */
export function sortChallenges(
  challenges: Challenge[],
  sortBy: 'title' | 'points' | 'difficulty' | 'category',
  order: 'asc' | 'desc' = 'asc'
): Challenge[] {
  const sorted = [...challenges];
  const multiplier = order === 'asc' ? 1 : -1;

  sorted.sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return multiplier * a.title.localeCompare(b.title);
      case 'points':
        return multiplier * (a.defaultPoints - b.defaultPoints);
      case 'difficulty':
        const diffOrder = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 };
        return multiplier * (diffOrder[a.difficulty] - diffOrder[b.difficulty]);
      case 'category':
        return multiplier * a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  return sorted;
}

/**
 * Calculate challenge statistics
 */
export function calculateChallengeStats(challenges: Challenge[]): ChallengeStats {
  const stats: ChallengeStats = {
    total: challenges.length,
    byDifficulty: { beginner: 0, intermediate: 0, advanced: 0, expert: 0 },
    byCategory: {},
    totalPoints: 0,
    averagePoints: 0
  };

  challenges.forEach(challenge => {
    stats.byDifficulty[challenge.difficulty]++;
    stats.totalPoints += challenge.defaultPoints;
    
    if (!stats.byCategory[challenge.category]) {
      stats.byCategory[challenge.category] = 0;
    }
    stats.byCategory[challenge.category]++;
  });

  stats.averagePoints = stats.total > 0 ? Math.round(stats.totalPoints / stats.total) : 0;

  return stats;
}

/**
 * Get unique categories from challenges
 */
export function getUniqueCategories(challenges: Challenge[]): string[] {
  const categories = new Set(challenges.map(c => c.category));
  return Array.from(categories).sort();
}

/**
 * Get unique routes from challenges
 */
export function getUniqueRoutes(challenges: Challenge[]): string[] {
  const routes = new Set<string>();
  challenges.forEach(c => c.routeIds.forEach(id => routes.add(id)));
  return Array.from(routes).sort();
}

/**
 * Get difficulty color class
 */
export function getDifficultyColor(difficulty: Difficulty): string {
  const colors: Record<Difficulty, string> = {
    beginner: 'text-green-400',
    intermediate: 'text-yellow-400',
    advanced: 'text-orange-400',
    expert: 'text-red-400'
  };
  return colors[difficulty];
}

/**
 * Get difficulty background class
 */
export function getDifficultyBg(difficulty: Difficulty): string {
  const colors: Record<Difficulty, string> = {
    beginner: 'bg-green-500/10 border-green-500/30',
    intermediate: 'bg-yellow-500/10 border-yellow-500/30',
    advanced: 'bg-orange-500/10 border-orange-500/30',
    expert: 'bg-red-500/10 border-red-500/30'
  };
  return colors[difficulty];
}

/**
 * Get route display info
 */
export function getRouteInfo(routeId: string): { label: string; icon: string; color: string } {
  const routeMap: Record<string, { label: string; icon: string; color: string }> = {
    standard: { label: 'Standard', icon: '🎯', color: 'purple' },
    redTeam: { label: 'Red Team', icon: '⚔️', color: 'red' },
    blueTeam: { label: 'Blue Team', icon: '🛡️', color: 'blue' }
  };
  return routeMap[routeId] || { label: routeId, icon: '🔧', color: 'gray' };
}

