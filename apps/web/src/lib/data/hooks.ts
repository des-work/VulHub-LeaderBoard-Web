/**
 * React Query Hooks
 * 
 * Data fetching hooks with caching, loading states, and error handling
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './query-client';
import { leaderboardAdapter, badgesAdapter, challengesAdapter } from './adapter';
import { LeaderboardPlayer } from '../../components/leaderboard/LeaderboardRow';
import { Badge } from '../badges/types';
import { Challenge } from '../challenges/types';
import * as Api from '../api/endpoints';

// === LEADERBOARD HOOKS ===

/**
 * Hook to fetch leaderboard data
 */
export function useLeaderboard(options?: {
  limit?: number;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: queryKeys.leaderboard.list({ limit: options?.limit }),
    queryFn: () => leaderboardAdapter.fetch(),
    enabled: options?.enabled !== false,
    staleTime: 1000 * 60 * 2, // 2 minutes - reduced excessive calls
  });
}

/**
 * Hook to fetch user's rank
 */
export function useUserRank(userId: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.leaderboard.userRank(userId || ''),
    queryFn: async () => {
      if (!userId) return null;
      
      // Try real API first, fallback to mock
      try {
        const rank = await Api.LeaderboardApi.getUserRank(userId);
        return rank;
      } catch (error) {
        // Fallback: calculate from leaderboard
        const leaderboard = await leaderboardAdapter.fetch();
        const userIndex = leaderboard.findIndex(p => p.id === parseInt(userId) || p.name === userId);
        return userIndex >= 0 ? userIndex + 1 : null;
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60, // 1 minute
  });
}

// === BADGES HOOKS ===

/**
 * Hook to fetch all badges
 */
export function useBadges(options?: {
  category?: string;
  tier?: string;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: queryKeys.badges.list({ category: options?.category, tier: options?.tier }),
    queryFn: () => badgesAdapter.fetch(),
    enabled: options?.enabled !== false,
    staleTime: 1000 * 60 * 5, // 5 minutes - badges don't change often
  });
}

/**
 * Hook to fetch a single badge
 */
export function useBadge(badgeId: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.badges.detail(badgeId || ''),
    queryFn: async () => {
      if (!badgeId) return null;
      const badges = await badgesAdapter.fetch();
      return badges.find((b: any) => b.id === badgeId) || null;
    },
    enabled: !!badgeId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// === CHALLENGES HOOKS ===

/**
 * Hook to fetch all challenges
 */
export function useChallenges(options?: {
  category?: string;
  difficulty?: string;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: queryKeys.challenges.list({ category: options?.category, difficulty: options?.difficulty }),
    queryFn: () => challengesAdapter.fetch(),
    enabled: options?.enabled !== false,
    staleTime: 1000 * 60 * 10, // 10 minutes - challenges don't change often
  });
}

/**
 * Hook to fetch a single challenge
 */
export function useChallenge(challengeId: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.challenges.detail(challengeId || ''),
    queryFn: async () => {
      if (!challengeId) return null;
      
      // Try real API first
      try {
        return await Api.ChallengeApi.getChallenge(challengeId);
      } catch (error) {
        // Fallback to mock
        const challenges = await challengesAdapter.fetch();
        return challenges.find((c: any) => c.id === challengeId) || null;
      }
    },
    enabled: !!challengeId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// === SUBMISSIONS HOOKS ===

/**
 * Hook to fetch user submissions
 */
export function useSubmissions(userId?: string | null) {
  return useQuery({
    queryKey: queryKeys.submissions.user(userId || ''),
    queryFn: async () => {
      if (!userId) return [];
      return await Api.SubmissionApi.getUserSubmissions(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 30, // 30 seconds
  });
}

/**
 * Hook to create a submission
 */
export function useCreateSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Api.SubmissionCreate) => Api.SubmissionApi.createSubmission(data),
    onSuccess: (_, variables: any) => {
      // Invalidate submissions list to refetch
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.submissions.user(variables.userId || '') 
      });
      
      // Invalidate leaderboard (points may have changed)
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.leaderboard.all 
      });
    },
  });
}

// === PROFILE HOOKS ===

import { fetchProfileData } from '../profile/data-adapter';

/**
 * Hook to fetch user profile
 */
export function useProfile(userId: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.profile.detail(userId || ''),
    queryFn: () => {
      if (!userId) throw new Error('User ID required');
      return fetchProfileData(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60, // 1 minute
  });
}

// === REFETCH HELPERS ===

/**
 * Hook to manually refetch leaderboard
 */
export function useRefetchLeaderboard() {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.leaderboard.all });
  };
}

/**
 * Hook to manually refetch badges
 */
export function useRefetchBadges() {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.badges.all });
  };
}

/**
 * Hook to manually refetch challenges
 */
export function useRefetchChallenges() {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.challenges.all });
  };
}

