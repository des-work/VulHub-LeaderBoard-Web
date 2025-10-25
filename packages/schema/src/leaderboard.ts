import { z } from 'zod';
import { IdSchema, TimestampSchema } from './common';

// Leaderboard type enum
export const LeaderboardTypeSchema = z.enum(['OVERALL', 'PROJECT', 'CATEGORY', 'WEEKLY', 'MONTHLY']);

// Leaderboard entry schema
export const LeaderboardEntrySchema = z.object({
  rank: z.number().int().positive(),
  userId: IdSchema,
  score: z.number().int().min(0),
  submissions: z.number().int().min(0),
  averageScore: z.number().min(0).max(100),
  badges: z.array(IdSchema).default([]),
  streak: z.number().int().min(0).default(0),
  lastSubmissionAt: TimestampSchema.optional(),
  metadata: z.record(z.any()).optional()
});

// Leaderboard schema
export const LeaderboardSchema = z.object({
  id: IdSchema,
  type: LeaderboardTypeSchema,
  projectId: IdSchema.optional(),
  category: z.string().optional(),
  period: z.object({
    start: TimestampSchema,
    end: TimestampSchema
  }).optional(),
  entries: z.array(LeaderboardEntrySchema),
  totalParticipants: z.number().int().min(0),
  tenantId: IdSchema,
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema
});

// Leaderboard creation schema
export const CreateLeaderboardSchema = LeaderboardSchema.omit({
  id: true,
  entries: true,
  totalParticipants: true,
  createdAt: true,
  updatedAt: true
});

// Leaderboard query schema
export const LeaderboardQuerySchema = z.object({
  type: LeaderboardTypeSchema,
  projectId: IdSchema.optional(),
  category: z.string().optional(),
  period: z.object({
    start: TimestampSchema,
    end: TimestampSchema
  }).optional(),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().min(0).default(0)
});

// Types
export type LeaderboardType = z.infer<typeof LeaderboardTypeSchema>;
export type LeaderboardEntry = z.infer<typeof LeaderboardEntrySchema>;
export type Leaderboard = z.infer<typeof LeaderboardSchema>;
export type CreateLeaderboard = z.infer<typeof CreateLeaderboardSchema>;
export type LeaderboardQuery = z.infer<typeof LeaderboardQuerySchema>;
