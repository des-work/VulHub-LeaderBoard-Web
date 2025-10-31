/**
 * React Query Configuration
 * 
 * Centralized query client configuration with caching and error handling
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Default query client configuration
 * 
 * Features:
 * - Stale-while-revalidate caching
 * - Automatic retries with exponential backoff
 * - Error handling
 * - Cache management
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache time: how long unused/inactive cache data remains in memory
      gcTime: 1000 * 60 * 5, // 5 minutes (was cacheTime)

      // Stale time: how long data is considered fresh (no refetch)
      staleTime: 1000 * 60, // 1 minute

      // Retry configuration
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff

      // Refetch configuration
      refetchOnWindowFocus: true, // Refetch when window regains focus
      refetchOnReconnect: true, // Refetch when network reconnects
      refetchOnMount: true, // Refetch when component mounts

      // Network mode
      networkMode: 'online', // Only run queries when online
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
      retryDelay: 1000,
      
      // Network mode
      networkMode: 'online',
    },
  },
});

/**
 * Query key factories
 * 
 * Centralized query keys for better cache management
 */
export const queryKeys = {
  // Leaderboard
  leaderboard: {
    all: ['leaderboard'] as const,
    lists: () => [...queryKeys.leaderboard.all, 'list'] as const,
    list: (filters?: { limit?: number; offset?: number }) => 
      [...queryKeys.leaderboard.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.leaderboard.all, 'detail', id] as const,
    userRank: (userId: string) => [...queryKeys.leaderboard.all, 'rank', userId] as const,
  },

  // Badges
  badges: {
    all: ['badges'] as const,
    lists: () => [...queryKeys.badges.all, 'list'] as const,
    list: (filters?: { category?: string; tier?: string }) => 
      [...queryKeys.badges.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.badges.all, 'detail', id] as const,
    user: (userId: string) => [...queryKeys.badges.all, 'user', userId] as const,
  },

  // Challenges
  challenges: {
    all: ['challenges'] as const,
    lists: () => [...queryKeys.challenges.all, 'list'] as const,
    list: (filters?: { category?: string; difficulty?: string }) => 
      [...queryKeys.challenges.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.challenges.all, 'detail', id] as const,
    progress: (userId: string) => [...queryKeys.challenges.all, 'progress', userId] as const,
  },

  // Submissions
  submissions: {
    all: ['submissions'] as const,
    lists: () => [...queryKeys.submissions.all, 'list'] as const,
    list: (filters?: { userId?: string; status?: string }) => 
      [...queryKeys.submissions.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.submissions.all, 'detail', id] as const,
    user: (userId: string) => [...queryKeys.submissions.all, 'user', userId] as const,
  },

  // Profile
  profile: {
    all: ['profile'] as const,
    detail: (userId: string) => [...queryKeys.profile.all, 'detail', userId] as const,
    stats: (userId: string) => [...queryKeys.profile.all, 'stats', userId] as const,
  },

  // User
  user: {
    all: ['user'] as const,
    detail: (id: string) => [...queryKeys.user.all, 'detail', id] as const,
    current: () => [...queryKeys.user.all, 'current'] as const,
  },
};

/**
 * Invalidate related queries
 * 
 * Helper to invalidate related cache entries when data changes
 */
export function invalidateRelatedQueries(
  queryClient: QueryClient,
  key: string[]
) {
  // Invalidate exact match
  queryClient.invalidateQueries({ queryKey: key });

  // Invalidate all queries that start with the key
  queryClient.invalidateQueries({ queryKey: key, exact: false });
}

