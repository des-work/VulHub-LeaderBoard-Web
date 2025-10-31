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
    const response = await apiClient.post('/auth/login', { schoolId, password });
    
    // Store the access token
    if (response.accessToken) {
      apiClient.setAuthToken(response.accessToken);
    }
    
    return response;
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
  async grade(submissionId: string, payload: { status: 'approved' | 'rejected'; pointsAwarded: number; feedback?: string }) {
    return apiClient.post('/submissions/' + encodeURIComponent(submissionId) + '/grade', payload);
  }
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
  }
};
