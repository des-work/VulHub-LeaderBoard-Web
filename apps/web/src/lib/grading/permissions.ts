/**
 * Grading Permissions Module
 * 
 * Enforces role-based access control:
 * - Only graders and admins can grade
 * - Prevent self-grading
 * - Admin override capabilities
 * - Audit trail for compliance
 */

import { User } from '../auth/types';

// ============================================================================
// TYPES
// ============================================================================

export type UserRole = 'student' | 'grader' | 'admin';

export interface PermissionCheck {
  allowed: boolean;
  reason?: string;
}

export interface GradingAuditLog {
  submissionId: string;
  graderId: string;
  graderName: string;
  action: 'viewed' | 'graded' | 'commented' | 'appealed';
  timestamp: Date;
  details?: Record<string, any>;
}

// ============================================================================
// PERMISSION CHECKS
// ============================================================================

/**
 * Check if user can access grading interface
 */
export function canAccessGradingInterface(user: User | null): PermissionCheck {
  if (!user) {
    return {
      allowed: false,
      reason: 'Not authenticated',
    };
  }

  const allowedRoles: UserRole[] = ['grader', 'admin'];
  
  if (!allowedRoles.includes(user.role as UserRole)) {
    return {
      allowed: false,
      reason: `Role "${user.role}" does not have grading permissions`,
    };
  }

  return { allowed: true };
}

/**
 * Check if user can view a specific submission
 */
export function canViewSubmission(
  user: User | null,
  submissionUserId: string
): PermissionCheck {
  if (!user) {
    return {
      allowed: false,
      reason: 'Not authenticated',
    };
  }

  // Students can only view their own submissions
  if (user.role === 'student') {
    if (user.id !== submissionUserId) {
      return {
        allowed: false,
        reason: 'Students can only view their own submissions',
      };
    }
    return { allowed: true };
  }

  // Graders and admins can view any submission
  if (user.role === 'grader' || user.role === 'admin') {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: `Role "${user.role}" cannot view submissions`,
  };
}

/**
 * Check if user can grade a submission
 */
export function canGradeSubmission(
  user: User | null,
  submissionUserId: string,
  options?: { allowSelfGrading?: boolean }
): PermissionCheck {
  if (!user) {
    return {
      allowed: false,
      reason: 'Not authenticated',
    };
  }

  const allowedRoles: UserRole[] = ['grader', 'admin'];

  if (!allowedRoles.includes(user.role as UserRole)) {
    return {
      allowed: false,
      reason: `Role "${user.role}" cannot grade submissions`,
    };
  }

  // Prevent self-grading unless explicitly allowed
  if (user.id === submissionUserId && !options?.allowSelfGrading) {
    return {
      allowed: false,
      reason: 'Graders cannot grade their own submissions',
    };
  }

  return { allowed: true };
}

/**
 * Check if user can edit/override a grade
 */
export function canEditGrade(
  user: User | null,
  graderIdOfOriginalGrade: string,
  options?: { allowOverride?: boolean }
): PermissionCheck {
  if (!user) {
    return {
      allowed: false,
      reason: 'Not authenticated',
    };
  }

  // Only the original grader or admin can edit/override
  if (user.role === 'admin') {
    return { allowed: true };
  }

  if (user.id === graderIdOfOriginalGrade) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: 'Only the original grader or admin can edit this grade',
  };
}

/**
 * Check if user can appeal a grade
 */
export function canAppealGrade(
  user: User | null,
  submissionUserId: string
): PermissionCheck {
  if (!user) {
    return {
      allowed: false,
      reason: 'Not authenticated',
    };
  }

  // Only the student who submitted can appeal
  if (user.role === 'student' && user.id === submissionUserId) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: 'Only the student who submitted can appeal',
  };
}

/**
 * Check if user can view audit logs
 */
export function canViewAuditLogs(user: User | null): PermissionCheck {
  if (!user) {
    return {
      allowed: false,
      reason: 'Not authenticated',
    };
  }

  // Only admins and graders can view audit logs
  if (user.role === 'admin' || user.role === 'grader') {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: `Role "${user.role}" cannot view audit logs`,
  };
}

/**
 * Check if user can assign grader to submission
 */
export function canAssignGrader(user: User | null): PermissionCheck {
  if (!user) {
    return {
      allowed: false,
      reason: 'Not authenticated',
    };
  }

  // Only admins can assign graders
  if (user.role === 'admin') {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: 'Only admins can assign graders to submissions',
  };
}

/**
 * Check if user can view grading statistics
 */
export function canViewGradingStats(user: User | null): PermissionCheck {
  if (!user) {
    return {
      allowed: false,
      reason: 'Not authenticated',
    };
  }

  // Graders can see their own stats, admins can see all
  if (user.role === 'grader' || user.role === 'admin') {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: `Role "${user.role}" cannot view grading statistics`,
  };
}

// ============================================================================
// ROLE HELPERS
// ============================================================================

/**
 * Check if user has grader role or higher
 */
export function isGrader(user: User | null): boolean {
  if (!user) return false;
  return user.role === 'grader' || user.role === 'admin';
}

/**
 * Check if user is admin
 */
export function isAdmin(user: User | null): boolean {
  if (!user) return false;
  return user.role === 'admin';
}

/**
 * Check if user is student
 */
export function isStudent(user: User | null): boolean {
  if (!user) return false;
  return user.role === 'student';
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  const displayNames: Record<UserRole, string> = {
    student: 'Student',
    grader: 'Grader',
    admin: 'Administrator',
  };
  return displayNames[role] || role;
}

// ============================================================================
// AUDIT LOGGING
// ============================================================================

/**
 * Create audit log entry for grading action
 */
export function createGradingAuditLog(
  submissionId: string,
  grader: User,
  action: GradingAuditLog['action'],
  details?: Record<string, any>
): GradingAuditLog {
  return {
    submissionId,
    graderId: grader.id,
    graderName: grader.name,
    action,
    timestamp: new Date(),
    details,
  };
}

// ============================================================================
// EXPORT HELPER
// ============================================================================

export const GradingPermissions = {
  canAccessGradingInterface,
  canViewSubmission,
  canGradeSubmission,
  canEditGrade,
  canAppealGrade,
  canViewAuditLogs,
  canAssignGrader,
  canViewGradingStats,
  isGrader,
  isAdmin,
  isStudent,
  getRoleDisplayName,
  createGradingAuditLog,
};
