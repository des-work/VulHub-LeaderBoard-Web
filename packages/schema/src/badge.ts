import { z } from 'zod';
import { IdSchema, TimestampSchema } from './common';

// Badge type enum
export const BadgeTypeSchema = z.enum(['ACHIEVEMENT', 'MILESTONE', 'SPECIAL', 'SEASONAL']);

// Badge rarity enum
export const BadgeRaritySchema = z.enum(['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY']);

// Badge schema
export const BadgeSchema = z.object({
  id: IdSchema,
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  icon: z.string().url(),
  type: BadgeTypeSchema,
  rarity: BadgeRaritySchema,
  criteria: z.object({
    submissions: z.number().int().min(0).optional(),
    score: z.number().int().min(0).max(100).optional(),
    streak: z.number().int().min(0).optional(),
    projects: z.array(IdSchema).optional(),
    categories: z.array(z.string()).optional()
  }).optional(),
  points: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  tenantId: IdSchema,
  metadata: z.record(z.any()).optional(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema
});

// Badge creation schema
export const CreateBadgeSchema = BadgeSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Badge update schema
export const UpdateBadgeSchema = CreateBadgeSchema.partial();

// User badge schema
export const UserBadgeSchema = z.object({
  id: IdSchema,
  userId: IdSchema,
  badgeId: IdSchema,
  earnedAt: TimestampSchema,
  metadata: z.record(z.any()).optional()
});

// Badge assignment schema
export const AssignBadgeSchema = z.object({
  userId: IdSchema,
  badgeId: IdSchema,
  metadata: z.record(z.any()).optional()
});

// Types
export type BadgeType = z.infer<typeof BadgeTypeSchema>;
export type BadgeRarity = z.infer<typeof BadgeRaritySchema>;
export type Badge = z.infer<typeof BadgeSchema>;
export type CreateBadge = z.infer<typeof CreateBadgeSchema>;
export type UpdateBadge = z.infer<typeof UpdateBadgeSchema>;
export type UserBadge = z.infer<typeof UserBadgeSchema>;
export type AssignBadge = z.infer<typeof AssignBadgeSchema>;
