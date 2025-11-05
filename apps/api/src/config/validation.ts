import Joi from 'joi';

export const validationSchema = Joi.object({
  // Core Application
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number()
    .integer()
    .min(1)
    .max(65535)
    .default(4000),
  HOST: Joi.string()
    .default('0.0.0.0'),
  CORS_ORIGIN: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.string().required(),
    otherwise: Joi.string().default('http://localhost:3000')
  }),

  // Database
  DATABASE_URL: Joi.string()
    .when('NODE_ENV', {
      is: 'production',
      then: Joi.required(),
      otherwise: Joi.optional().default('file:./prisma/dev.db') // SQLite for local dev
    })
    .custom((value, helpers) => {
      // SQLite file paths
      if (value.startsWith('file:')) {
        const pattern = /^file:(\.\/|\/tmp\/|\/var\/|\.\/prisma\/).+\.db$/;
        if (!pattern.test(value)) {
          return helpers.error('string.pattern.base', {
            pattern: 'file:./path/to/db.db or file:/tmp/db.db'
          });
        }
        return value;
      }
      // PostgreSQL URLs
      if (value.startsWith('postgresql://')) {
        const pattern = /^postgresql:\/\/.+:.+@.+:\d+\/.+$/;
        if (!pattern.test(value)) {
          return helpers.error('string.pattern.base', {
            pattern: 'postgresql://user:password@host:port/database'
          });
        }
        return value;
      }
      return helpers.error('string.custom', {
        message: 'DATABASE_URL must start with file: or postgresql://'
      });
    }),
  DATABASE_MAX_CONNECTIONS: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10),
  DATABASE_CONNECTION_TIMEOUT: Joi.number()
    .integer()
    .min(1000)
    .max(120000)
    .default(30000),

  // Redis
  REDIS_HOST: Joi.string()
    .default('localhost'),
  REDIS_PORT: Joi.number()
    .integer()
    .min(1)
    .max(65535)
    .default(6379),
  REDIS_PASSWORD: Joi.string()
    .optional(),
  REDIS_DB: Joi.number()
    .integer()
    .min(0)
    .max(15)
    .default(0),
  REDIS_KEY_PREFIX: Joi.string()
    .pattern(/^[^:]*:$/)
    .default('vulhub:'),

  // JWT Security
  JWT_SECRET: Joi.string()
    .min(32)
    .when('NODE_ENV', {
      is: 'production',
      then: Joi.required(),
      otherwise: Joi.optional().default('dev-jwt-secret-key-change-in-production')
    }),
  JWT_EXPIRES_IN: Joi.string()
    .pattern(/^\d+[smhd]$/)
    .default('15m'),
  JWT_REFRESH_SECRET: Joi.string()
    .min(32)
    .when('NODE_ENV', {
      is: 'production',
      then: Joi.required(),
      otherwise: Joi.optional().default('dev-refresh-secret-key-change-in-production')
    }),
  JWT_REFRESH_EXPIRES_IN: Joi.string()
    .pattern(/^\d+[smhd]$/)
    .default('7d'),

  // OIDC/SSO (Optional)
  OIDC_ISSUER: Joi.string()
    .uri({ scheme: ['https'] })
    .optional(),
  OIDC_CLIENT_ID: Joi.string()
    .when('OIDC_ISSUER', {
      is: Joi.exist(),
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
  OIDC_CLIENT_SECRET: Joi.string()
    .when('OIDC_ISSUER', {
      is: Joi.exist(),
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
  OIDC_REDIRECT_URI: Joi.string()
    .uri()
    .when('OIDC_ISSUER', {
      is: Joi.exist(),
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
  OIDC_SCOPE: Joi.string()
    .default('openid profile email'),

  // Storage
  STORAGE_PROVIDER: Joi.string()
    .valid('minio', 's3', 'local')
    .default('minio'),
  MINIO_ENDPOINT: Joi.string()
    .when('STORAGE_PROVIDER', {
      is: 'minio',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
  MINIO_PORT: Joi.number()
    .integer()
    .min(1)
    .max(65535)
    .default(9000),
  MINIO_ACCESS_KEY: Joi.string()
    .when('STORAGE_PROVIDER', {
      is: 'minio',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
  MINIO_SECRET_KEY: Joi.string()
    .when('STORAGE_PROVIDER', {
      is: 'minio',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
  MINIO_USE_SSL: Joi.boolean()
    .default(false),
  MINIO_BUCKET: Joi.string()
    .default('vulhub-uploads'),

  // AWS S3 (Alternative to MinIO)
  AWS_REGION: Joi.string()
    .when('STORAGE_PROVIDER', {
      is: 's3',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
  AWS_ACCESS_KEY_ID: Joi.string()
    .when('STORAGE_PROVIDER', {
      is: 's3',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
  AWS_SECRET_ACCESS_KEY: Joi.string()
    .when('STORAGE_PROVIDER', {
      is: 's3',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
  AWS_S3_BUCKET: Joi.string()
    .when('STORAGE_PROVIDER', {
      is: 's3',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),

  // Email
  SMTP_HOST: Joi.string()
    .optional(),
  SMTP_PORT: Joi.number()
    .integer()
    .min(1)
    .max(65535)
    .default(587),
  SMTP_SECURE: Joi.boolean()
    .default(false),
  SMTP_USER: Joi.string()
    .when('SMTP_HOST', {
      is: Joi.exist(),
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
  SMTP_PASS: Joi.string()
    .when('SMTP_HOST', {
      is: Joi.exist(),
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
  SMTP_FROM: Joi.string()
    .email()
    .default('noreply@vulhub.edu'),

  // Rate Limiting
  RATE_LIMIT_TTL: Joi.number()
    .integer()
    .min(1000)
    .max(3600000)
    .default(60000),
  RATE_LIMIT_MAX: Joi.number()
    .integer()
    .min(1)
    .max(10000)
    .default(100),

  // File Upload
  MAX_FILE_SIZE: Joi.number()
    .integer()
    .min(1024) // 1KB minimum
    .max(1073741824) // 1GB maximum
    .default(10485760), // 10MB default
  SCAN_FOR_VIRUSES: Joi.boolean()
    .default(false),

  // Monitoring
  MONITORING_ENABLED: Joi.boolean()
    .default(false),
  OTEL_EXPORTER_OTLP_ENDPOINT: Joi.string()
    .uri()
    .when('MONITORING_ENABLED', {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
  OTEL_SERVICE_NAME: Joi.string()
    .default('vulhub-api'),

  // Security
  BCRYPT_ROUNDS: Joi.number()
    .integer()
    .min(8)
    .max(20)
    .default(12),
  SESSION_SECRET: Joi.string()
    .min(32)
    .optional(),
  COOKIE_SECURE: Joi.boolean()
    .default(true),
  COOKIE_SAME_SITE: Joi.string()
    .valid('strict', 'lax', 'none')
    .default('lax'),

  // Additional optional configurations
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug')
    .default('info'),
  REQUEST_TIMEOUT: Joi.number()
    .integer()
    .min(1000)
    .max(300000)
    .default(30000),
  SHUTDOWN_TIMEOUT: Joi.number()
    .integer()
    .min(1000)
    .max(60000)
    .default(10000),
});
