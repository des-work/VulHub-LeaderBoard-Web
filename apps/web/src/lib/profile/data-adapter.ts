/**
 * Profile Data Adapter
 * 
 * Adapter pattern for gradual transition from mock to real data
 * This allows us to switch between mock and real data sources seamlessly
 */

import { User } from '../auth/types';
import { ProfileData, ProfileStats, ChallengeProgress, BadgeProgress, ActivityLog, DataSourceConfig } from './types';
import { initializeBadges, calculateBadgeProgress } from '../badges/utils';
import { challengeCatalog } from '../challenges/catalog';
import { Badge } from '../badges/types';
import { Challenge } from '../challenges/types';

/**
 * Data Source Configuration
 * Toggle useRealData to switch between mock and real API
 */
const DATA_SOURCE: DataSourceConfig = {
  useRealData: false, // Set to true when backend is ready
  endpoints: {
    profile: '/api/v1/profile',
    challenges: '/api/v1/challenges/progress',
    badges: '/api/v1/badges/user',
    activity: '/api/v1/activity/recent',
    leaderboard: '/api/v1/leaderboard'
  }
};

/**
 * Fetch profile data (mock or real)
 */
export async function fetchProfileData(userId: string): Promise<ProfileData> {
  if (DATA_SOURCE.useRealData) {
    return fetchRealProfileData(userId);
  } else {
    return fetchMockProfileData(userId);
  }
}

/**
 * Fetch real profile data from backend
 */
async function fetchRealProfileData(userId: string): Promise<ProfileData> {
  try {
    const [profile, challenges, badges, activity] = await Promise.all([
      fetch(`${DATA_SOURCE.endpoints.profile}/${userId}`).then(r => r.json()),
      fetch(`${DATA_SOURCE.endpoints.challenges}/${userId}`).then(r => r.json()),
      fetch(`${DATA_SOURCE.endpoints.badges}/${userId}`).then(r => r.json()),
      fetch(`${DATA_SOURCE.endpoints.activity}/${userId}`).then(r => r.json())
    ]);

    return {
      user: profile.user,
      stats: profile.stats,
      challengeProgress: challenges,
      badgeProgress: badges,
      recentActivity: activity
    };
  } catch (error) {
    // Fallback to mock data if API fails
    return fetchMockProfileData(userId);
  }
}

/**
 * Fetch mock profile data (for development/testing)
 */
async function fetchMockProfileData(userId: string): Promise<ProfileData> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Get user from localStorage (from auth context)
  const userDataString = localStorage.getItem('user_data');
  if (!userDataString) {
    throw new Error('User not found');
  }

  const user: User = JSON.parse(userDataString);

  // Generate mock stats
  const stats = generateMockStats(user);

  // Generate mock challenge progress
  const challengeProgress = generateMockChallengeProgress(user);

  // Generate mock badge progress
  const badgeProgress = generateMockBadgeProgress(user);

  // Generate mock activity log
  const recentActivity = generateMockActivity(user, challengeProgress, badgeProgress);

  return {
    user,
    stats,
    challengeProgress,
    badgeProgress,
    recentActivity
  };
}

/**
 * Generate mock profile stats
 */
function generateMockStats(user: User): ProfileStats {
  const totalPoints = user.points || 1000;
  const level = user.level || 3;
  const nextLevelPoints = level * 500;
  const currentLevelPoints = (level - 1) * 500;
  const pointsInLevel = totalPoints - currentLevelPoints;
  
  return {
    totalPoints,
    currentRank: 8, // Mock rank
    totalUsers: 42,
    level,
    nextLevelPoints,
    pointsToNextLevel: nextLevelPoints - pointsInLevel,
    
    // Challenge Stats
    challengesStarted: 12,
    challengesCompleted: 7,
    challengesInProgress: 5,
    challengeCompletionRate: (7 / 12) * 100,
    
    // Badge Stats
    badgesUnlocked: 8,
    totalBadges: 20,
    badgeCompletionRate: (8 / 20) * 100,
    
    // Activity Stats
    totalSubmissions: 15,
    approvedSubmissions: 12,
    pendingSubmissions: 2,
    rejectedSubmissions: 1,
    
    // Time Stats
    memberSince: user.joinDate || new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    lastActive: user.lastActive || new Date(),
    daysSinceMemberJoin: 45,
    currentStreak: 5,
    longestStreak: 12,
    
    // Performance Stats
    averageScore: 85,
    totalChallengePoints: 750,
    totalBadgePoints: 250
  };
}

/**
 * Generate mock challenge progress
 */
function generateMockChallengeProgress(user: User): ChallengeProgress[] {
  const challenges = challengeCatalog.challenges.slice(0, 12); // First 12 challenges
  
  return challenges.map((challenge, index) => {
    const status = index < 7 ? 'completed' : index < 12 ? 'in_progress' : 'not_started';
    const totalSteps = 5;
    const completedSteps = status === 'completed' ? totalSteps : Math.floor(Math.random() * totalSteps);
    const progress = (completedSteps / totalSteps) * 100;
    
    return {
      challengeId: challenge.id,
      challenge,
      status,
      startedAt: status !== 'not_started' ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : undefined,
      completedAt: status === 'completed' ? new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000) : undefined,
      currentStep: `step-${completedSteps + 1}`,
      completedSteps: Array.from({ length: completedSteps }, (_, i) => `step-${i + 1}`),
      totalSteps,
      progress,
      points: status === 'completed' ? challenge.defaultPoints : 0,
      route: challenge.routeIds[0]
    };
  });
}

/**
 * Generate mock badge progress
 */
function generateMockBadgeProgress(user: User): BadgeProgress[] {
  const badges = initializeBadges();
  
  return badges.map(badge => {
    const progress = calculateBadgeProgress(badge);
    
    return {
      badgeId: badge.id,
      badge,
      isUnlocked: badge.isUnlocked,
      unlockedAt: badge.unlockedAt,
      progress,
      requirements: badge.requirements.map(req => ({
        ...req,
        completed: req.progress >= req.target
      }))
    };
  });
}

/**
 * Generate mock activity log
 */
function generateMockActivity(
  user: User,
  challengeProgress: ChallengeProgress[],
  badgeProgress: BadgeProgress[]
): ActivityLog[] {
  const activities: ActivityLog[] = [];
  
  // Challenge completions
  challengeProgress
    .filter(cp => cp.status === 'completed')
    .slice(0, 5)
    .forEach((cp, index) => {
      activities.push({
        id: `activity-challenge-${index}`,
        userId: user.id,
        type: 'challenge_completed',
        title: `Completed ${cp.challenge.title}`,
        description: `Earned ${cp.points} points`,
        timestamp: cp.completedAt!,
        metadata: {
          challengeId: cp.challengeId,
          points: cp.points
        }
      });
    });

  // Badge unlocks
  badgeProgress
    .filter(bp => bp.isUnlocked)
    .slice(0, 3)
    .forEach((bp, index) => {
      activities.push({
        id: `activity-badge-${index}`,
        userId: user.id,
        type: 'badge_unlocked',
        title: `Unlocked ${bp.badge.name}`,
        description: bp.badge.description,
        timestamp: bp.unlockedAt!,
        metadata: {
          badgeId: bp.badgeId,
          points: bp.badge.points
        }
      });
    });

  // Sort by timestamp (newest first)
  return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10);
}

/**
 * Update profile data (gradual transition support)
 */
export async function updateProfileData(userId: string, updates: Partial<User>): Promise<User> {
  if (DATA_SOURCE.useRealData) {
    const response = await fetch(`${DATA_SOURCE.endpoints.profile}/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return await response.json();
  } else {
    // Update localStorage (mock)
    const userDataString = localStorage.getItem('user_data');
    if (userDataString) {
      const user = JSON.parse(userDataString);
      const updatedUser = { ...user, ...updates };
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      return updatedUser;
    }
    throw new Error('User not found');
  }
}

/**
 * Enable real data mode (call this when backend is ready)
 */
export function enableRealDataMode() {
  DATA_SOURCE.useRealData = true;
  console.log('✅ Real data mode enabled');
}

/**
 * Disable real data mode (fallback to mock)
 */
export function disableMockDataMode() {
  DATA_SOURCE.useRealData = false;
}

/**
 * Check if using real data
 */
export function isUsingRealData(): boolean {
  return DATA_SOURCE.useRealData;
}

