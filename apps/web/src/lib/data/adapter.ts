/**
 * Unified Data Adapter
 * 
 * Adapter pattern for seamless transition from mock to real data
 * Supports all data types: leaderboard, badges, challenges, submissions, profile
 */

import { apiClient } from '../api/client';
import * as Api from '../api/endpoints';

/**
 * Data source configuration
 * Toggle USE_MOCK_DATA to switch between mock and real API
 */
export const DATA_CONFIG = {
  USE_MOCK_DATA: process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true',
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
};

/**
 * Base adapter interface
 */
export interface DataAdapter<T> {
  fetch: () => Promise<T>;
  fetchMock: () => Promise<T>;
  fetchReal: () => Promise<T>;
}

/**
 * Create a data adapter for any data type
 */
export function createDataAdapter<T>(config: {
  mockFn: () => Promise<T>;
  realFn: () => Promise<T>;
  useMock?: boolean;
}): DataAdapter<T> {
  const useMock = config.useMock ?? DATA_CONFIG.USE_MOCK_DATA;

  return {
    fetch: async () => {
      if (useMock) {
        try {
          return await config.mockFn();
        } catch (error) {
          console.warn('Mock data fetch failed, trying real API:', error);
          return await config.realFn();
        }
      } else {
        try {
          return await config.realFn();
        } catch (error) {
          console.warn('Real API fetch failed, falling back to mock:', error);
          return await config.mockFn();
        }
      }
    },
    fetchMock: config.mockFn,
    fetchReal: config.realFn,
  };
}

/**
 * Leaderboard Data Adapter
 */
import { LeaderboardPlayer } from '../../components/leaderboard/LeaderboardRow';

// Mock leaderboard data
const MOCK_LEADERBOARD: LeaderboardPlayer[] = [
  { id: 1, name: 'NeoYOU', points: 1820, level: 4, completed: 3, status: 'fire', trend: 'up', streak: 5, change: 120 },
  { id: 2, name: 'Trinity', points: 1710, level: 4, completed: 3, status: 'fire', trend: 'up', streak: 3, change: 95 },
  { id: 3, name: 'Morpheus', points: 1660, level: 4, completed: 2, status: 'close', trend: 'up', streak: 0, change: 45 },
  { id: 4, name: 'Oracle', points: 1600, level: 3, completed: 2, status: 'normal', trend: 'stable', streak: 0, change: 10 },
  { id: 5, name: 'Acid Burn', points: 1540, level: 3, completed: 3, status: 'normal', trend: 'stable', streak: 0, change: 5 },
  { id: 6, name: 'Zero Cool', points: 1490, level: 3, completed: 2, status: 'close', trend: 'up', streak: 0, change: 30 },
  { id: 7, name: 'Crash Override', points: 1450, level: 3, completed: 3, status: 'close', trend: 'down', streak: 0, change: -15 },
  { id: 8, name: 'The Architect', points: 1425, level: 3, completed: 1, status: 'close', trend: 'stable', streak: 0, change: 0 },
  { id: 9, name: 'Cypher', points: 1370, level: 3, completed: 1, status: 'normal', trend: 'stable', streak: 0, change: 2 },
  { id: 10, name: 'Tank', points: 1330, level: 3, completed: 3, status: 'close', trend: 'up', streak: 0, change: 20 },
  { id: 11, name: 'Dozer', points: 1290, level: 2, completed: 2, status: 'close', trend: 'stable', streak: 0, change: 0 },
  { id: 12, name: 'Root', points: 1260, level: 2, completed: 2, status: 'close', trend: 'down', streak: 0, change: -10 },
  { id: 13, name: 'Elliot Alderson', points: 1210, level: 2, completed: 1, status: 'close', trend: 'stable', streak: 0, change: 5 },
  { id: 14, name: 'Darlene', points: 1185, level: 2, completed: 3, status: 'close', trend: 'up', streak: 0, change: 25 },
  { id: 15, name: 'Lisbeth Salander', points: 1150, level: 2, completed: 2, status: 'close', trend: 'stable', streak: 0, change: 0 },
];

export const leaderboardAdapter = createDataAdapter({
  mockFn: async () => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    return MOCK_LEADERBOARD;
  },
  realFn: async () => {
    const response = await Api.LeaderboardApi.getLeaderboard(15);
    return response.map((entry, index) => ({
      id: parseInt(entry.id) || index + 1,
      name: entry.name,
      points: entry.points,
      level: entry.level || Math.floor(entry.points / 500),
      completed: 0, // TODO: Get from API
      status: entry.status || 'normal',
      trend: 'stable' as const,
      streak: 0, // TODO: Get from API
      change: 0, // TODO: Get from API
    }));
  },
});

/**
 * Badges Data Adapter
 */
import { BadgeData } from '../badges/types';
import { getAllBadges, getUserBadges } from '../badges/data';

export const badgesAdapter = createDataAdapter({
  mockFn: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const allBadges = getAllBadges();
    // In a real scenario, we'd merge with user progress
    return allBadges.map(badge => ({
      ...badge,
      unlocked: Math.random() > 0.7, // Mock: 30% unlocked
      progress: Math.floor(Math.random() * 100),
    }));
  },
  realFn: async () => {
    // TODO: Get user ID from context
    const userId = 'current-user'; // Placeholder
    const [allBadges, userBadges] = await Promise.all([
      Api.BadgeApi.getAllBadges(),
      Api.BadgeApi.getUserBadges(userId),
    ]);
    
    const userBadgeMap = new Map(userBadges.map(ub => [ub.badgeId, ub]));
    
    return allBadges.map(badge => {
      const userBadge = userBadgeMap.get(badge.id);
      return {
        ...badge,
        unlocked: !!userBadge,
        progress: userBadge?.progress || 0,
        unlockedAt: userBadge?.unlockedAt,
      };
    });
  },
});

/**
 * Challenges Data Adapter
 */
import { Challenge } from '../challenges/types';
import { challengeCatalog } from '../challenges/catalog';

export const challengesAdapter = createDataAdapter({
  mockFn: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return challengeCatalog;
  },
  realFn: async () => {
    const challenges = await Api.ChallengeApi.getAllChallenges();
    return challenges.map(challenge => ({
      id: challenge.id,
      name: challenge.name,
      category: challenge.category || 'general',
      difficulty: challenge.difficulty || 'medium',
      points: challenge.points || 100,
      description: challenge.description || '',
      vulhubLink: challenge.vulhubLink || '',
      tags: challenge.tags || [],
    }));
  },
});

/**
 * Helper to check if we should use mock data
 */
export function shouldUseMockData(): boolean {
  return DATA_CONFIG.USE_MOCK_DATA;
}

/**
 * Helper to get API client base URL
 */
export function getApiBaseUrl(): string {
  return DATA_CONFIG.API_URL;
}

