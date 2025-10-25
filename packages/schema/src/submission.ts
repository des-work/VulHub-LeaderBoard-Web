import { z } from 'zod';
import { IdSchema, TimestampSchema } from './common';

// Submission status enum
export const SubmissionStatusSchema = z.enum(['PENDING', 'APPROVED', 'REJECTED', 'NEEDS_REVIEW']);

// Submission schema
export const SubmissionSchema = z.object({
  id: IdSchema,
  userId: IdSchema,
  projectId: IdSchema,
  tenantId: IdSchema,
  status: SubmissionStatusSchema,
  score: z.number().int().min(0).max(100).optional(),
  evidence: z.object({
    screenshots: z.array(z.string().url()).default([]),
    notes: z.string().max(1000).optional(),
    files: z.array(z.object({
      url: z.string().url(),
      name: z.string(),
      size: z.number().int().positive(),
      type: z.string()
    })).default([])
  }).default({}),
  feedback: z.object({
    instructorId: IdSchema.optional(),
    comments: z.string().max(1000).optional(),
    rubric: z.record(z.number().int().min(0).max(100)).optional()
  }).optional(),
  metadata: z.record(z.any()).optional(),
  submittedAt: TimestampSchema,
  reviewedAt: TimestampSchema.optional(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema
});

// Submission creation schema
export const CreateSubmissionSchema = SubmissionSchema.omit({
  id: true,
  status: true,
  score: true,
  feedback: true,
  reviewedAt: true,
  createdAt: true,
  updatedAt: true
});

// Submission update schema
export const UpdateSubmissionSchema = z.object({
  status: SubmissionStatusSchema.optional(),
  score: z.number().int().min(0).max(100).optional(),
  evidence: SubmissionSchema.shape.evidence.optional(),
  feedback: SubmissionSchema.shape.feedback.optional()
});

// Submission review schema
export const ReviewSubmissionSchema = z.object({
  status: SubmissionStatusSchema,
  score: z.number().int().min(0).max(100),
  feedback: z.object({
    comments: z.string().max(1000).optional(),
    rubric: z.record(z.number().int().min(0).max(100)).optional()
  }).optional()
});

// Types
export type SubmissionStatus = z.infer<typeof SubmissionStatusSchema>;
export type Submission = z.infer<typeof SubmissionSchema>;
export type CreateSubmission = z.infer<typeof CreateSubmissionSchema>;
export type UpdateSubmission = z.infer<typeof UpdateSubmissionSchema>;
export type ReviewSubmission = z.infer<typeof ReviewSubmissionSchema>;
