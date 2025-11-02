/**
 * Submission Validators
 * 
 * Validates submission data before sending to server:
 * - Challenge ID validation
 * - Description length and content
 * - File requirements
 * - Duplicate submission prevention
 * - Rate limiting
 */

// ============================================================================
// TYPES
// ============================================================================

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

// ============================================================================
// CONFIGURATION
// ============================================================================

export const SUBMISSION_CONFIG = {
  DESCRIPTION_MIN_LENGTH: 10,
  DESCRIPTION_MAX_LENGTH: 5000,
  FILES_MIN_COUNT: 1,
  FILES_MAX_COUNT: 10,
  DUPLICATE_CHECK_WINDOW_HOURS: 24,
  MAX_SUBMISSIONS_PER_DAY: 5,
};

// ============================================================================
// VALIDATORS
// ============================================================================

/**
 * Validate challenge ID
 */
export function validateChallengeId(challengeId: string): ValidationError | null {
  if (!challengeId || challengeId.trim().length === 0) {
    return {
      field: 'challengeId',
      message: 'Please select a challenge',
      code: 'CHALLENGE_REQUIRED',
    };
  }

  // Additional validation: check if it's a valid UUID or ID format
  if (!isValidChallengeId(challengeId)) {
    return {
      field: 'challengeId',
      message: 'Invalid challenge ID format',
      code: 'CHALLENGE_INVALID',
    };
  }

  return null;
}

/**
 * Validate submission description
 */
export function validateDescription(description: string): ValidationError | null {
  if (!description || description.trim().length === 0) {
    return {
      field: 'description',
      message: 'Description is required',
      code: 'DESCRIPTION_REQUIRED',
    };
  }

  const trimmed = description.trim();

  if (trimmed.length < SUBMISSION_CONFIG.DESCRIPTION_MIN_LENGTH) {
    return {
      field: 'description',
      message: `Description must be at least ${SUBMISSION_CONFIG.DESCRIPTION_MIN_LENGTH} characters`,
      code: 'DESCRIPTION_TOO_SHORT',
    };
  }

  if (trimmed.length > SUBMISSION_CONFIG.DESCRIPTION_MAX_LENGTH) {
    return {
      field: 'description',
      message: `Description must not exceed ${SUBMISSION_CONFIG.DESCRIPTION_MAX_LENGTH} characters`,
      code: 'DESCRIPTION_TOO_LONG',
    };
  }

  // Check for spam/malicious content
  if (containsSuspiciousContent(trimmed)) {
    return {
      field: 'description',
      message: 'Description contains suspicious content',
      code: 'DESCRIPTION_SUSPICIOUS',
    };
  }

  return null;
}

/**
 * Validate file count
 */
export function validateFileCount(fileCount: number): ValidationError | null {
  if (fileCount < SUBMISSION_CONFIG.FILES_MIN_COUNT) {
    return {
      field: 'files',
      message: `Upload at least ${SUBMISSION_CONFIG.FILES_MIN_COUNT} file as proof`,
      code: 'FILES_REQUIRED',
    };
  }

  if (fileCount > SUBMISSION_CONFIG.FILES_MAX_COUNT) {
    return {
      field: 'files',
      message: `Maximum ${SUBMISSION_CONFIG.FILES_MAX_COUNT} files allowed`,
      code: 'FILES_TOO_MANY',
    };
  }

  return null;
}

/**
 * Complete submission validation
 */
export function validateSubmission(payload: {
  challengeId: string;
  description: string;
  fileCount: number;
}): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate each field
  const challengeError = validateChallengeId(payload.challengeId);
  if (challengeError) {errors.push(challengeError);}

  const descriptionError = validateDescription(payload.description);
  if (descriptionError) {errors.push(descriptionError);}

  const fileError = validateFileCount(payload.fileCount);
  if (fileError) {errors.push(fileError);}

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check for duplicate submission (client-side check)
 */
export function checkDuplicateSubmission(
  challengeId: string,
  previousSubmissions: Array<{ challengeId: string; submittedAt: Date }>
): ValidationError | null {
  const now = new Date();
  const checkWindowMs = SUBMISSION_CONFIG.DUPLICATE_CHECK_WINDOW_HOURS * 60 * 60 * 1000;

  // Find recent submission for same challenge
  const recentSubmission = previousSubmissions.find(sub => {
    const timeDiff = now.getTime() - new Date(sub.submittedAt).getTime();
    return sub.challengeId === challengeId && timeDiff < checkWindowMs;
  });

  if (recentSubmission) {
    const hoursAgo = Math.floor(
      (now.getTime() - new Date(recentSubmission.submittedAt).getTime()) / (60 * 60 * 1000)
    );
    return {
      field: 'challengeId',
      message: `You already submitted this challenge ${hoursAgo} hour(s) ago. Wait before resubmitting.`,
      code: 'DUPLICATE_SUBMISSION',
    };
  }

  return null;
}

/**
 * Check daily submission rate limit
 */
export function checkDailyRateLimit(
  submissions: Array<{ submittedAt: Date }>
): ValidationError | null {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const submissionsToday = submissions.filter(
    sub => new Date(sub.submittedAt) > oneDayAgo
  );

  if (submissionsToday.length >= SUBMISSION_CONFIG.MAX_SUBMISSIONS_PER_DAY) {
    return {
      field: 'submission',
      message: `You have reached your daily submission limit (${SUBMISSION_CONFIG.MAX_SUBMISSIONS_PER_DAY}/day). Try again tomorrow.`,
      code: 'RATE_LIMIT_EXCEEDED',
    };
  }

  return null;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if challenge ID is valid format
 */
function isValidChallengeId(id: string): boolean {
  // Accept any non-empty string for now
  // Can be enhanced to check against known challenge IDs
  return id && id.length > 0 && id.length <= 255;
}

/**
 * Check for suspicious content (basic implementation)
 */
function containsSuspiciousContent(text: string): boolean {
  // List of patterns to avoid
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // Event handlers
    /eval\(/i,
    /function\s*\(/i,
    /__proto__/i,
    /constructor/i,
  ];

  return suspiciousPatterns.some(pattern => pattern.test(text));
}

// ============================================================================
// EXPORT HELPER
// ============================================================================

export const SubmissionValidators = {
  validateChallengeId,
  validateDescription,
  validateFileCount,
  validateSubmission,
  checkDuplicateSubmission,
  checkDailyRateLimit,
  SUBMISSION_CONFIG,
};
