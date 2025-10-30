export interface LeaderboardConfig {
  displayMode: 'grid' | 'list' | 'progress';
  showRank: boolean;
  showPoints: boolean;
  showLevel: boolean;
  showLastActive: boolean;
  showProgress: boolean;
  maxItems: number;
  sortBy: 'points' | 'level' | 'lastActive' | 'name';
  sortOrder: 'asc' | 'desc';
  showOnlyActive: boolean;
  groupByLevel: boolean;
  showAchievements: boolean;
  showSubmissionCount: boolean;
  showCompletionRate: boolean;
}

export const defaultLeaderboardConfig: LeaderboardConfig = {
  displayMode: 'grid',
  showRank: true,
  showPoints: true,
  showLevel: true,
  showLastActive: true,
  showProgress: true,
  maxItems: 10,
  sortBy: 'points',
  sortOrder: 'desc',
  showOnlyActive: false,
  groupByLevel: false,
  showAchievements: true,
  showSubmissionCount: true,
  showCompletionRate: false,
};

export const leaderboardPresets = {
  compact: {
    ...defaultLeaderboardConfig,
    displayMode: 'list' as const,
    maxItems: 5,
    showLastActive: false,
    showProgress: false,
    showAchievements: false,
  },
  detailed: {
    ...defaultLeaderboardConfig,
    displayMode: 'grid' as const,
    maxItems: 20,
    showCompletionRate: true,
    groupByLevel: true,
  },
  progress: {
    ...defaultLeaderboardConfig,
    displayMode: 'progress' as const,
    maxItems: 15,
    showRank: false,
    showLastActive: false,
    showProgress: true,
    showCompletionRate: true,
  },
  minimal: {
    ...defaultLeaderboardConfig,
    displayMode: 'list' as const,
    maxItems: 3,
    showLevel: false,
    showLastActive: false,
    showProgress: false,
    showAchievements: false,
    showSubmissionCount: false,
  },
};
