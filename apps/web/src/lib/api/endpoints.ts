import { apiClient } from './client';
import { Submission, User } from '../auth/types';

export const AuthApi = {
  async login(schoolId: string, password: string): Promise<User> {
    return apiClient.post('/auth/login', { schoolId, password });
  },
  async register(payload: { schoolId: string; name: string; password: string }): Promise<User> {
    return apiClient.post('/auth/register', payload);
  },
  async me(): Promise<User> {
    return apiClient.get('/auth/me');
  },
  async updateProfile(update: Partial<User>): Promise<User> {
    return apiClient.put('/auth/me', update);
  },
  async addPoints(userId: string, delta: number): Promise<{ total: number }> {
    return apiClient.post('/users/' + encodeURIComponent(userId) + '/points', { delta });
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
