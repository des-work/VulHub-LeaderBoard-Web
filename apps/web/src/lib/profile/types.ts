/**
 * Profile System Types
 * 
 * Comprehensive type definitions for the profile system
 */

import { User } from '../auth/types';
import { Badge } from '../badges/types';
import { Challenge } from '../challenges/types';

export interface ProfileStats {
  totalPoints: number;
  currentRank: number;
  totalUsers: number;
  level: number;
  nextLevelPoints: number;
  pointsToNextLevel: number;
  
  // Challenge Stats
  challengesStarted: number;
  challengesCompleted: number;
  challengesInProgress: number;
  challengeCompletionRate: number;
  
  // Badge Stats
  badgesUnlocked: number;
  totalBadges: number;
  badgeCompletionRate: number;
  
  // Activity Stats
  totalSubmissions: number;
  approvedSubmissions: number;
  pendingSubmissions: number;
  rejectedSubmissions: number;
  
  // Time Stats
  memberSince: Date;
  lastActive: Date;
  daysSinceMemberJoin: number;
  currentStreak: number;
  longestStreak: number;
  
  // Performance Stats
  averageScore: number;
  totalChallengePoints: number;
  totalBadgePoints: number;
}

export interface ChallengeProgress {
  challengeId: string;
  challenge: Challenge;
  status: 'not_started' | 'in_progress' | 'completed';
  startedAt?: Date;
  completedAt?: Date;
  currentStep: string;
  completedSteps: string[];
  totalSteps: number;
  progress: number; // 0-100
  points: number;
  route: string; // 'standard' | 'redTeam' | 'blueTeam'
}

export interface BadgeProgress {
  badgeId: string;
  badge: Badge;
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress: number; // 0-100
  requirements: {
    id: string;
    description: string;
    progress: number;
    target: number;
    completed: boolean;
  }[];
}

export interface ActivityLog {
  id: string;
  userId: string;
  type: 'challenge_started' | 'challenge_completed' | 'badge_unlocked' | 'submission_created' | 'level_up' | 'rank_change';
  title: string;
  description: string;
  timestamp: Date;
  metadata?: {
    challengeId?: string;
    badgeId?: string;
    submissionId?: string;
    points?: number;
    oldRank?: number;
    newRank?: number;
    oldLevel?: number;
    newLevel?: number;
  };
}

export interface ProfileData {
  user: User;
  stats: ProfileStats;
  challengeProgress: ChallengeProgress[];
  badgeProgress: BadgeProgress[];
  recentActivity: ActivityLog[];
}

export interface DataSourceConfig {
  useRealData: boolean;
  endpoints: {
    profile: string;
    challenges: string;
    badges: string;
    activity: string;
    leaderboard: string;
  };
}

