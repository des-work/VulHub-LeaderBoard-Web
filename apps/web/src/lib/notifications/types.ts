/**
 * Notification System Types
 * 
 * Defines all notification types, statuses, and data structures
 * for the in-app notification system
 */

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export type NotificationDuration = 'short' | 'medium' | 'long' | 'persistent';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration: NotificationDuration;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  metadata?: Record<string, any>;
}

export interface ToastNotification extends Notification {
  dismissible: boolean;
}

export interface NotificationEvent {
  id: string;
  type: 'submission' | 'grade' | 'system' | 'feedback';
  userId: string;
  title: string;
  message: string;
  relatedId?: string; // submission ID, grade ID, etc.
  timestamp: Date;
  read: boolean;
}

// ============================================================================
// NOTIFICATION CATEGORIES
// ============================================================================

export const NOTIFICATION_CATEGORIES = {
  SUBMISSION: 'submission',
  GRADE: 'grade',
  SYSTEM: 'system',
  FEEDBACK: 'feedback',
} as const;

// ============================================================================
// NOTIFICATION PRESETS
// ============================================================================

export const NOTIFICATION_PRESETS = {
  // Submission notifications
  SUBMISSION_CREATED: {
    type: 'success' as const,
    title: 'Submission Created',
    duration: 'medium' as const,
  },
  SUBMISSION_UPLOADED: {
    type: 'success' as const,
    title: 'Files Uploaded',
    duration: 'short' as const,
  },
  SUBMISSION_FAILED: {
    type: 'error' as const,
    title: 'Submission Failed',
    duration: 'long' as const,
  },
  SUBMISSION_PENDING: {
    type: 'info' as const,
    title: 'Submission Pending',
    duration: 'persistent' as const,
  },

  // Grade notifications
  GRADE_RECEIVED: {
    type: 'success' as const,
    title: 'Grade Received',
    duration: 'long' as const,
  },
  GRADE_APPROVED: {
    type: 'success' as const,
    title: 'Submission Approved',
    duration: 'long' as const,
  },
  GRADE_REJECTED: {
    type: 'error' as const,
    title: 'Submission Rejected',
    duration: 'long' as const,
  },
  GRADE_NEEDS_REVISION: {
    type: 'warning' as const,
    title: 'Needs Revision',
    duration: 'long' as const,
  },

  // System notifications
  SAVE_SUCCESS: {
    type: 'success' as const,
    title: 'Saved Successfully',
    duration: 'short' as const,
  },
  SAVE_ERROR: {
    type: 'error' as const,
    title: 'Save Failed',
    duration: 'medium' as const,
  },
  LOAD_ERROR: {
    type: 'error' as const,
    title: 'Load Failed',
    duration: 'medium' as const,
  },
  AUTH_ERROR: {
    type: 'error' as const,
    title: 'Authentication Error',
    duration: 'persistent' as const,
  },

  // Feedback notifications
  FEEDBACK_SUBMITTED: {
    type: 'success' as const,
    title: 'Feedback Submitted',
    duration: 'short' as const,
  },
  FEEDBACK_VIEWED: {
    type: 'info' as const,
    title: 'Feedback Viewed',
    duration: 'short' as const,
  },
} as const;

// ============================================================================
// DURATION SETTINGS (in milliseconds)
// ============================================================================

export const NOTIFICATION_DURATIONS: Record<NotificationDuration, number> = {
  short: 2000,      // 2 seconds
  medium: 4000,     // 4 seconds
  long: 6000,       // 6 seconds
  persistent: 0,    // Never auto-dismiss
};

// ============================================================================
// NOTIFICATION STORE LIMITS
// ============================================================================

export const NOTIFICATION_STORE_CONFIG = {
  MAX_NOTIFICATIONS: 100,        // Max stored notifications
  MAX_TOAST_AT_ONCE: 3,          // Max toasts visible simultaneously
  RETENTION_HOURS: 24,           // Keep notifications for 24 hours
  CLEANUP_INTERVAL_MS: 300000,   // Clean up every 5 minutes
};

// ============================================================================
// NOTIFICATION STATE
// ============================================================================

export interface NotificationState {
  notifications: Notification[];
  toasts: ToastNotification[];
  unreadCount: number;
}

export interface NotificationContextType {
  state: NotificationState;
  notify: (notification: Omit<Notification, 'id' | 'timestamp'>) => string;
  dismiss: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clear: () => void;
  getUnreadCount: () => number;
}
