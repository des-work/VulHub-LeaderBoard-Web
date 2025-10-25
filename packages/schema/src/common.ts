import { z } from 'zod';

// Base schemas
export const IdSchema = z.string().uuid();
export const EmailSchema = z.string().email();
export const UrlSchema = z.string().url();
export const TimestampSchema = z.date();

// Pagination schemas
export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  cursor: z.string().optional()
});

export const CursorPaginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().positive().max(100).default(20)
});

// Response schemas
export const SuccessResponseSchema = z.object({
  success: z.literal(true),
  data: z.any(),
  meta: z.object({
    timestamp: TimestampSchema,
    requestId: z.string().uuid()
  }).optional()
});

export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional()
  }),
  meta: z.object({
    timestamp: TimestampSchema,
    requestId: z.string().uuid()
  })
});

// Tenant schema
export const TenantSchema = z.object({
  id: IdSchema,
  name: z.string().min(1).max(100),
  domain: z.string().min(1).max(100),
  settings: z.record(z.any()).optional()
});

// Types
export type Id = z.infer<typeof IdSchema>;
export type Email = z.infer<typeof EmailSchema>;
export type Url = z.infer<typeof UrlSchema>;
export type Timestamp = z.infer<typeof TimestampSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
export type CursorPagination = z.infer<typeof CursorPaginationSchema>;
export type SuccessResponse<T = any> = z.infer<typeof SuccessResponseSchema> & { data: T };
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type Tenant = z.infer<typeof TenantSchema>;
