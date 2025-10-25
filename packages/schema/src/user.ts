import { z } from 'zod';
import { IdSchema, EmailSchema, TimestampSchema } from './common';

// User role enum
export const UserRoleSchema = z.enum(['STUDENT', 'INSTRUCTOR', 'ADMIN', 'SUPER_ADMIN']);

// User status enum
export const UserStatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING']);

// User schema
export const UserSchema = z.object({
  id: IdSchema,
  email: EmailSchema,
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  role: UserRoleSchema,
  status: UserStatusSchema,
  tenantId: IdSchema,
  avatarUrl: z.string().url().optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).default('system'),
    notifications: z.object({
      email: z.boolean().default(true),
      push: z.boolean().default(false),
      leaderboard: z.boolean().default(true)
    }).default({})
  }).default({}),
  metadata: z.record(z.any()).optional(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
  lastLoginAt: TimestampSchema.optional()
});

// User creation schema
export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true
});

// User update schema
export const UpdateUserSchema = CreateUserSchema.partial().omit({
  email: true,
  tenantId: true
});

// User profile schema (public view)
export const UserProfileSchema = UserSchema.pick({
  id: true,
  firstName: true,
  lastName: true,
  avatarUrl: true,
  role: true,
  createdAt: true
});

// Authentication schemas
export const LoginSchema = z.object({
  email: EmailSchema,
  password: z.string().min(8)
});

export const RegisterSchema = z.object({
  email: EmailSchema,
  password: z.string().min(8).max(128),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  tenantId: IdSchema.optional()
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string()
});

// Types
export type UserRole = z.infer<typeof UserRoleSchema>;
export type UserStatus = z.infer<typeof UserStatusSchema>;
export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type Login = z.infer<typeof LoginSchema>;
export type Register = z.infer<typeof RegisterSchema>;
export type RefreshToken = z.infer<typeof RefreshTokenSchema>;
