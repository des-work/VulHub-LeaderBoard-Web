/**
 * Grading Configuration System
 * 
 * Centralized configuration for:
 * - Scoring rubrics and guidelines
 * - Feedback templates
 * - Status definitions
 * - Grading workflow stages
 * - Points allocations
 */

// ============================================================================
// TYPES
// ============================================================================

export type SubmissionStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'appealed' | 'needs_revision';

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  maxPoints: number;
  weights: Record<string, number>; // 'excellent' | 'good' | 'fair' | 'poor'
}

export interface ScoringGuideline {
  criterion: string;
  excellent: string;
  good: string;
  fair: string;
  poor: string;
  points: Record<string, number>;
}

export interface FeedbackTemplate {
  id: string;
  title: string;
  category: 'positive' | 'neutral' | 'improvement' | 'critical';
  content: string;
  shortcut?: string;
}

// ============================================================================
// RUBRIC CONFIGURATION
// ============================================================================

export const GRADING_RUBRIC: RubricCriterion[] = [
  {
    id: 'approach',
    name: 'Approach & Methodology',
    description: 'How well the student understood and approached the challenge',
    maxPoints: 25,
    weights: {
      excellent: 1,
      good: 0.8,
      fair: 0.6,
      poor: 0.3,
    },
  },
  {
    id: 'execution',
    name: 'Execution & Results',
    description: 'Whether the exploit was successful and correctly executed',
    maxPoints: 30,
    weights: {
      excellent: 1,
      good: 0.8,
      fair: 0.6,
      poor: 0.2,
    },
  },
  {
    id: 'documentation',
    name: 'Documentation & Clarity',
    description: 'Quality of proof files and written explanation',
    maxPoints: 20,
    weights: {
      excellent: 1,
      good: 0.8,
      fair: 0.6,
      poor: 0.4,
    },
  },
  {
    id: 'learning',
    name: 'Learning Demonstrated',
    description: 'Evidence of understanding and knowledge gained',
    maxPoints: 15,
    weights: {
      excellent: 1,
      good: 0.8,
      fair: 0.6,
      poor: 0.3,
    },
  },
  {
    id: 'initiative',
    name: 'Bonus: Initiative & Depth',
    description: 'Extra credit for going above and beyond',
    maxPoints: 10,
    weights: {
      excellent: 1,
      good: 0.6,
      fair: 0,
      poor: 0,
    },
  },
];

// ============================================================================
// SCORING GUIDELINES
// ============================================================================

export const SCORING_GUIDELINES: Record<string, ScoringGuideline> = {
  approach: {
    criterion: 'Approach & Methodology',
    excellent: 'Demonstrates clear understanding of the vulnerability. Strategy is well-researched and efficiently executed.',
    good: 'Shows good understanding with a logical approach. Minor inefficiencies but fundamentally sound.',
    fair: 'Basic understanding present. Approach is somewhat logical but has notable gaps.',
    poor: 'Minimal understanding. Approach is confused or significantly flawed.',
    points: {
      excellent: 25,
      good: 20,
      fair: 15,
      poor: 7,
    },
  },
  execution: {
    criterion: 'Execution & Results',
    excellent: 'Exploit executed flawlessly. Submission is complete and demonstrates mastery.',
    good: 'Exploit successful with minor issues. Mostly complete submission.',
    fair: 'Exploit partially successful. Some key elements missing.',
    poor: 'Exploit unsuccessful or significantly incomplete.',
    points: {
      excellent: 30,
      good: 24,
      fair: 18,
      poor: 6,
    },
  },
  documentation: {
    criterion: 'Documentation & Clarity',
    excellent: 'Excellent proof files. Clear, detailed written explanation. Easy to verify.',
    good: 'Good proof files. Clear explanation with adequate detail.',
    fair: 'Basic proof files. Explanation present but lacks some clarity.',
    poor: 'Insufficient proof or unclear documentation.',
    points: {
      excellent: 20,
      good: 16,
      fair: 12,
      poor: 8,
    },
  },
  learning: {
    criterion: 'Learning Demonstrated',
    excellent: 'Exceptional understanding shown. Student can explain concepts deeply.',
    good: 'Good understanding demonstrated through explanations.',
    fair: 'Basic understanding shown. Some explanation gaps.',
    poor: 'Minimal evidence of learning.',
    points: {
      excellent: 15,
      good: 12,
      fair: 9,
      poor: 4,
    },
  },
  initiative: {
    criterion: 'Bonus: Initiative & Depth',
    excellent: 'Exceptional effort beyond requirements. Novel insights or extensions.',
    good: 'Solid effort beyond minimum. Some additional learning demonstrated.',
    fair: 'Meets requirements exactly, nothing extra.',
    poor: 'Below expectations, minimal effort.',
    points: {
      excellent: 10,
      good: 6,
      fair: 0,
      poor: 0,
    },
  },
};

// ============================================================================
// FEEDBACK TEMPLATES
// ============================================================================

export const FEEDBACK_TEMPLATES: FeedbackTemplate[] = [
  // Positive Feedback
  {
    id: 'excellent_work',
    title: 'Excellent Work',
    category: 'positive',
    content: 'Excellent submission! Your approach was methodical and your execution was flawless. Keep up this great work!',
    shortcut: '!ex',
  },
  {
    id: 'great_effort',
    title: 'Great Effort',
    category: 'positive',
    content: 'Great effort on this challenge. You demonstrated solid understanding of the vulnerability.',
    shortcut: '!great',
  },
  {
    id: 'well_documented',
    title: 'Well Documented',
    category: 'positive',
    content: 'Your proof files and documentation were clear and easy to verify. Excellent presentation!',
    shortcut: '!doc',
  },

  // Neutral Feedback
  {
    id: 'meets_expectations',
    title: 'Meets Expectations',
    category: 'neutral',
    content: 'Your submission meets the requirements for this challenge. Good work!',
    shortcut: '!meets',
  },
  {
    id: 'competent_work',
    title: 'Competent Work',
    category: 'neutral',
    content: 'Competent execution of the challenge. You understand the concepts and demonstrated adequate skill.',
    shortcut: '!comp',
  },

  // Improvement Needed
  {
    id: 'needs_revision',
    title: 'Needs Revision',
    category: 'improvement',
    content: 'Your submission needs revision. Review the feedback above and resubmit with corrections.',
    shortcut: '!rev',
  },
  {
    id: 'more_explanation',
    title: 'More Explanation Needed',
    category: 'improvement',
    content: 'Your proof is good, but please provide more detailed explanation of your approach and findings.',
    shortcut: '!explain',
  },
  {
    id: 'incomplete_files',
    title: 'Incomplete Files',
    category: 'improvement',
    content: 'Your submitted files are incomplete. Please include all relevant proof and resubmit.',
    shortcut: '!files',
  },

  // Critical Issues
  {
    id: 'exploit_not_verified',
    title: 'Exploit Not Verified',
    category: 'critical',
    content: 'The exploit could not be verified from your proof files. Please review and resubmit with clearer evidence.',
    shortcut: '!verify',
  },
  {
    id: 'lacks_understanding',
    title: 'Lacks Understanding',
    category: 'critical',
    content: 'Your submission suggests insufficient understanding of the vulnerability. Study the concept more deeply and resubmit.',
    shortcut: '!understand',
  },
  {
    id: 'plagiarism_concern',
    title: 'Plagiarism Concern',
    category: 'critical',
    content: 'This submission appears to be copied or plagiarized. Please provide original work demonstrating your own learning.',
    shortcut: '!plagiarism',
  },
];

// ============================================================================
// STATUS CONFIGURATION
// ============================================================================

export const STATUS_CONFIG: Record<SubmissionStatus, {
  label: string;
  color: string;
  icon: string;
  description: string;
  canTransitionTo: SubmissionStatus[];
}> = {
  pending: {
    label: 'Pending',
    color: 'blue',
    icon: 'Clock',
    description: 'Awaiting grader review',
    canTransitionTo: ['under_review', 'appealed'],
  },
  under_review: {
    label: 'Under Review',
    color: 'yellow',
    icon: 'Eye',
    description: 'Currently being graded',
    canTransitionTo: ['approved', 'rejected', 'needs_revision'],
  },
  approved: {
    label: 'Approved',
    color: 'green',
    icon: 'CheckCircle',
    description: 'Successfully graded and points awarded',
    canTransitionTo: ['appealed'],
  },
  rejected: {
    label: 'Rejected',
    color: 'red',
    icon: 'XCircle',
    description: 'Not approved for points',
    canTransitionTo: ['appealed', 'under_review'],
  },
  needs_revision: {
    label: 'Needs Revision',
    color: 'orange',
    icon: 'AlertCircle',
    description: 'Resubmit with requested changes',
    canTransitionTo: ['under_review', 'pending'],
  },
  appealed: {
    label: 'Appealed',
    color: 'purple',
    icon: 'Flag',
    description: 'Student appealed the grade',
    canTransitionTo: ['approved', 'rejected', 'pending'],
  },
};

// ============================================================================
// GRADING WORKFLOW
// ============================================================================

export const GRADING_WORKFLOW = {
  NEW_SUBMISSION_STATUS: 'pending' as SubmissionStatus,
  
  GRADER_START_ACTION: 'under_review' as SubmissionStatus,
  
  FINAL_STATUSES: ['approved', 'rejected'] as SubmissionStatus[],
  
  APPEALABLE_STATUSES: ['approved', 'rejected'] as SubmissionStatus[],
};

// ============================================================================
// GRADING LIMITS & REQUIREMENTS
// ============================================================================

export const GRADING_CONFIG = {
  // Time limits
  GRADING_TIME_LIMIT_MINUTES: 30,
  WARNING_TIME_MINUTES: 5,
  
  // Quality limits
  MIN_FEEDBACK_LENGTH: 20,
  MAX_FEEDBACK_LENGTH: 5000,
  
  // Performance targets
  TARGET_GRADING_TIME_MINUTES: 10,
  TARGET_DAILY_SUBMISSIONS: 15,
  
  // Appeal limits
  MAX_APPEALS_PER_SUBMISSION: 2,
  APPEAL_REVIEW_TIME_HOURS: 48,
  
  // Grader assignment
  AUTO_ASSIGN_AFTER_HOURS: 24,
  SUBMISSIONS_PER_GRADER: 5,
};

// ============================================================================
// EXPORT HELPER
// ============================================================================

export const GradingConfig = {
  GRADING_RUBRIC,
  SCORING_GUIDELINES,
  FEEDBACK_TEMPLATES,
  STATUS_CONFIG,
  GRADING_WORKFLOW,
  GRADING_CONFIG,
};
