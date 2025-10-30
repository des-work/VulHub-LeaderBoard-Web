// Grading domain types

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface SubmissionFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
}

export interface Submission {
  id: string;
  userId: string;
  userName: string;
  activityId: string;
  activityName: string;
  description?: string;
  files: SubmissionFile[];
  createdAt: string; // ISO
  status: SubmissionStatus;
  gradedAt?: string; // ISO
  gradedBy?: string; // userId
  feedback?: string;
  pointsAwarded?: number;
}

export interface GradeInput {
  submissionId: string;
  status: Exclude<SubmissionStatus, 'pending'>; // approved or rejected
  pointsAwarded: number; // 0 allowed for reject
  feedback?: string;
}

export interface SubmissionFilters {
  q?: string; // free text across student/activity
  studentId?: string;
  studentName?: string;
  activityId?: string;
  activityName?: string;
  status?: SubmissionStatus | 'all';
  from?: string; // ISO
  to?: string;   // ISO
}

export interface GradeEvent {
  submissionId: string;
  userId: string;
  deltaPoints: number;
  newTotalPoints: number;
  status: Exclude<SubmissionStatus, 'pending'>;
  gradedAt: string;
}
