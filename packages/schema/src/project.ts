import { z } from 'zod';
import { IdSchema, TimestampSchema } from './common';

// Project difficulty enum
export const ProjectDifficultySchema = z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']);

// Project category enum
export const ProjectCategorySchema = z.enum([
  'WEB_APPLICATION',
  'NETWORK_SECURITY',
  'CRYPTOGRAPHY',
  'REVERSE_ENGINEERING',
  'FORENSICS',
  'MALWARE_ANALYSIS',
  'SOCIAL_ENGINEERING',
  'INCIDENT_RESPONSE'
]);

// Project schema
export const ProjectSchema = z.object({
  id: IdSchema,
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  category: ProjectCategorySchema,
  difficulty: ProjectDifficultySchema,
  maxScore: z.number().int().positive().default(100),
  vulhubId: z.string().min(1).max(50), // Reference to VulHub project
  instructions: z.string().min(1).max(5000),
  requirements: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  isPublic: z.boolean().default(true),
  tenantId: IdSchema,
  metadata: z.record(z.any()).optional(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema
});

// Project creation schema
export const CreateProjectSchema = ProjectSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Project update schema
export const UpdateProjectSchema = CreateProjectSchema.partial();

// Project search schema
export const ProjectSearchSchema = z.object({
  query: z.string().optional(),
  category: ProjectCategorySchema.optional(),
  difficulty: ProjectDifficultySchema.optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  isPublic: z.boolean().optional()
});

// Types
export type ProjectDifficulty = z.infer<typeof ProjectDifficultySchema>;
export type ProjectCategory = z.infer<typeof ProjectCategorySchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type CreateProject = z.infer<typeof CreateProjectSchema>;
export type UpdateProject = z.infer<typeof UpdateProjectSchema>;
export type ProjectSearch = z.infer<typeof ProjectSearchSchema>;
