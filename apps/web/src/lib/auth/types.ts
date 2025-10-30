export interface User {
  id: string;
  schoolId: string;
  name: string;
  email?: string;
  role: 'student' | 'grader' | 'admin';
  points: number;
  level: number;
  joinDate: Date;
  lastActive: Date;
  avatar?: string;
  completedActivities: string[];
  pendingSubmissions: Submission[];
  approvedSubmissions: Submission[];
}

export interface Submission {
  id: string;
  userId: string;
  activityName: string;
  activityId: string;
  files: FileUpload[];
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  gradedAt?: Date;
  gradedBy?: string;
  feedback?: string;
  pointsAwarded?: number;
}

export interface FileUpload {
  id: string;
  name: string;
  type: 'image' | 'text' | 'other';
  size: number;
  url: string;
  uploadedAt: Date;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  points: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  requirements: string[];
  isActive: boolean;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  schoolId: string;
  password: string;
}

export interface RegisterData {
  schoolId: string;
  name: string;
  password: string;
  confirmPassword: string;
}
