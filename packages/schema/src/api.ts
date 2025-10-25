import { z } from 'zod';
import { PaginationSchema, CursorPaginationSchema, SuccessResponseSchema, ErrorResponseSchema } from './common';

// API version schema
export const ApiVersionSchema = z.enum(['v1']);

// Health check schema
export const HealthCheckSchema = z.object({
  status: z.enum(['healthy', 'degraded', 'unhealthy']),
  timestamp: z.date(),
  services: z.record(z.object({
    status: z.enum(['up', 'down']),
    responseTime: z.number().optional(),
    lastCheck: z.date().optional()
  })),
  version: z.string(),
  environment: z.string()
});

// Paginated response schema
export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: z.array(dataSchema),
    pagination: z.object({
      page: z.number().int().positive(),
      limit: z.number().int().positive(),
      total: z.number().int().min(0),
      totalPages: z.number().int().min(0),
      hasNext: z.boolean(),
      hasPrev: z.boolean()
    })
  });

// Cursor paginated response schema
export const CursorPaginatedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: z.array(dataSchema),
    pagination: z.object({
      cursor: z.string().optional(),
      limit: z.number().int().positive(),
      hasNext: z.boolean()
    })
  });

// Search query schema
export const SearchQuerySchema = z.object({
  q: z.string().min(1).max(100),
  filters: z.record(z.any()).optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc')
});

// File upload schema
export const FileUploadSchema = z.object({
  file: z.instanceof(File),
  type: z.enum(['image', 'document', 'video']),
  maxSize: z.number().int().positive().optional(),
  allowedTypes: z.array(z.string()).optional()
});

// WebSocket message schema
export const WebSocketMessageSchema = z.object({
  type: z.string(),
  payload: z.any(),
  timestamp: z.date(),
  id: z.string().uuid()
});

// Types
export type ApiVersion = z.infer<typeof ApiVersionSchema>;
export type HealthCheck = z.infer<typeof HealthCheckSchema>;
export type PaginatedResponse<T> = z.infer<ReturnType<typeof PaginatedResponseSchema<T>>>;
export type CursorPaginatedResponse<T> = z.infer<ReturnType<typeof CursorPaginatedResponseSchema<T>>>;
export type SearchQuery = z.infer<typeof SearchQuerySchema>;
export type FileUpload = z.infer<typeof FileUploadSchema>;
export type WebSocketMessage = z.infer<typeof WebSocketMessageSchema>;
