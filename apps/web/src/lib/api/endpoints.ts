import { apiClient } from './client';
import { Submission, User } from '../auth/types';

interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

interface RegisterResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export const AuthApi = {
  async login(schoolId: string, password: string): Promise<LoginResponse> {
    // API expects 'email' field, but we receive 'schoolId' from the form
    // For now, use schoolId as email (users can enter email in School ID field)
    const response = await apiClient.post('/auth/login', { email: schoolId, password });
    
    // API returns { success: true, data: { user, accessToken, refreshToken } }
    // Extract the data property
    const data = response.data || response;
    
    // Transform API user to frontend User interface
    const apiUser = data.user;
    const frontendUser = {
      id: apiUser.id,
      schoolId: apiUser.email || apiUser.schoolId || '', // Use email as schoolId for now
      name: apiUser.firstName && apiUser.lastName 
        ? `${apiUser.firstName} ${apiUser.lastName}`
        : apiUser.name || apiUser.email || 'User',
      email: apiUser.email,
      role: (apiUser.role?.toLowerCase() || 'student') as 'student' | 'grader' | 'admin',
      points: apiUser.points || 0,
      level: apiUser.level || 1,
      joinDate: apiUser.createdAt ? new Date(apiUser.createdAt) : new Date(),
      lastActive: apiUser.updatedAt ? new Date(apiUser.updatedAt) : new Date(),
      avatar: apiUser.avatarUrl || undefined,
      bio: apiUser.bio || undefined,
      completedActivities: apiUser.completedActivities || [],
      pendingSubmissions: apiUser.pendingSubmissions || [],
      approvedSubmissions: apiUser.approvedSubmissions || [],
    };
    
    return {
      user: frontendUser,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  },
  
  async register(payload: { schoolId: string; name: string; password: string }): Promise<RegisterResponse> {
    const response = await apiClient.post('/auth/register', payload);
    
    // Store the access token
    if (response.accessToken) {
      apiClient.setAuthToken(response.accessToken);
    }
    
    return response;
  },
  
  async me(): Promise<User> {
    return apiClient.get('/auth/me');
  },
  
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout', {});
    } finally {
      // Clear token regardless of API response
      apiClient.setAuthToken(null);
    }
  },
  
  async updateProfile(update: Partial<User>): Promise<User> {
    return apiClient.put('/auth/me', update);
  },
  
  async addPoints(userId: string, delta: number): Promise<{ total: number }> {
    return apiClient.post('/users/' + encodeURIComponent(userId) + '/points', { delta });
  },
  
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    
    if (response.accessToken) {
      apiClient.setAuthToken(response.accessToken);
    }
    
    return response;
  }
};

export const GradingApi = {
  async listSubmissions(): Promise<Submission[]> {
    return apiClient.get('/submissions');
  },
  async getSubmission(id: string): Promise<Submission> {
    return apiClient.get(`/submissions/${encodeURIComponent(id)}`);
  },
  async grade(submissionId: string, payload: { status: 'approved' | 'rejected'; pointsAwarded: number; feedback?: string }) {
    return apiClient.post('/submissions/' + encodeURIComponent(submissionId) + '/grade', payload);
  },
  async getGradingQueue(status?: string): Promise<Submission[]> {
    const query = status ? `?status=${status}` : '';
    return apiClient.get(`/grader/queue${query}`);
  },
  async getSubmissionsByStatus(status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'appealed'): Promise<Submission[]> {
    return apiClient.get(`/submissions?status=${status}`);
  },
  async getGraderStats(): Promise<{
    totalGraded: number;
    averageTimeMinutes: number;
    averageQuality: number;
    todayCount: number;
  }> {
    return apiClient.get('/grader/stats');
  },
  async submitGrade(submissionId: string, payload: {
    status: 'approved' | 'rejected' | 'needs_revision';
    pointsAwarded: number;
    rubricScores: Record<string, number>;
    feedback: string;
  }) {
    return apiClient.post(`/submissions/${encodeURIComponent(submissionId)}/grade`, payload);
  },
  async getAuditLog(submissionId: string): Promise<Array<{
    graderId: string;
    graderName: string;
    action: string;
    timestamp: Date;
    details: any;
  }>> {
    return apiClient.get(`/submissions/${encodeURIComponent(submissionId)}/audit-log`);
  },
};

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  schoolId: string;
  points: number;
  level: number;
  streak?: number;
  status?: 'on_fire' | 'close' | 'rising' | null;
}

export const LeaderboardApi = {
  async getLeaderboard(limit = 15): Promise<LeaderboardEntry[]> {
    return apiClient.get(`/leaderboard?limit=${limit}`);
  },
  async getUserRank(userId: string): Promise<{ rank: number; total: number }> {
    return apiClient.get(`/leaderboard/user/${encodeURIComponent(userId)}`);
  }
};

export interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: string;
  category: string;
  rarity: string;
  points: number;
  requirements: any;
}

export interface UserBadge extends BadgeData {
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
}

export const BadgeApi = {
  async getAllBadges(): Promise<BadgeData[]> {
    return apiClient.get('/badges');
  },
  async getUserBadges(userId: string): Promise<UserBadge[]> {
    return apiClient.get(`/users/${encodeURIComponent(userId)}/badges`);
  }
};

export interface Challenge {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  points: number;
  vulhubPath: string;
  description?: string;
}

export const ChallengeApi = {
  async getAllChallenges(): Promise<Challenge[]> {
    return apiClient.get('/challenges');
  },
  async getChallenge(id: string): Promise<Challenge> {
    return apiClient.get(`/challenges/${encodeURIComponent(id)}`);
  }
};

export interface SubmissionCreate {
  challengeId: string;
  description: string;
  screenshotUrl?: string;
  fileUrl?: string;
}

export const SubmissionApi = {
  async createSubmission(data: SubmissionCreate): Promise<Submission> {
    return apiClient.post('/submissions', data);
  },
  async getUserSubmissions(userId: string): Promise<Submission[]> {
    return apiClient.get(`/users/${encodeURIComponent(userId)}/submissions`);
  },
  async getSubmission(id: string): Promise<Submission> {
    return apiClient.get(`/submissions/${encodeURIComponent(id)}`);
  },
  async listPendingSubmissions(): Promise<Submission[]> {
    return apiClient.get('/submissions?status=pending');
  },
  async getSubmissionsByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<Submission[]> {
    return apiClient.get(`/submissions?status=${status}`);
  },
};
