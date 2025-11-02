/**
 * Grading Utilities
 * 
 * Helper functions for grading operations (no context dependency)
 */

import { Submission, SubmissionFilters } from './types';

/**
 * Search/filter submissions based on criteria
 */
export function searchSubmissions(
  submissions: Submission[],
  filters: SubmissionFilters
): Submission[] {
  return submissions.filter(sub => {
    // Status filter
    if (filters.status && filters.status !== 'all' && sub.status !== filters.status) {
      return false;
    }

    // Student ID filter
    if (filters.studentId && sub.userId !== filters.studentId) {
      return false;
    }

    // Student name filter
    if (filters.studentName && !sub.userName.toLowerCase().includes(filters.studentName.toLowerCase())) {
      return false;
    }

    // Activity ID filter
    if (filters.activityId && sub.activityId !== filters.activityId) {
      return false;
    }

    // Activity name filter
    if (filters.activityName && !sub.activityName.toLowerCase().includes(filters.activityName.toLowerCase())) {
      return false;
    }

    // General search query
    if (filters.q) {
      const query = filters.q.toLowerCase();
      const searchText = `${sub.userName} ${sub.activityName} ${sub.description ?? ''}`.toLowerCase();
      if (!searchText.includes(query)) {
        return false;
      }
    }

    // Date range filters
    if (filters.from && new Date(sub.createdAt) < new Date(filters.from)) {
      return false;
    }
    if (filters.to && new Date(sub.createdAt) > new Date(filters.to)) {
      return false;
    }

    return true;
  });
}

/**
 * Sort submissions by various criteria
 */
export function sortSubmissions(
  submissions: Submission[],
  sortKey: 'date' | 'student' | 'activity' | 'status',
  direction: 'asc' | 'desc' = 'desc'
): Submission[] {
  return [...submissions].sort((a, b) => {
    let aVal: any;
    let bVal: any;

    switch (sortKey) {
      case 'date':
        aVal = new Date(a.createdAt || 0).getTime();
        bVal = new Date(b.createdAt || 0).getTime();
        break;
      case 'student':
        aVal = a.userName.toLowerCase();
        bVal = b.userName.toLowerCase();
        break;
      case 'activity':
        aVal = a.activityName.toLowerCase();
        bVal = b.activityName.toLowerCase();
        break;
      case 'status':
        aVal = a.status;
        bVal = b.status;
        break;
      default:
        return 0;
    }

    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

