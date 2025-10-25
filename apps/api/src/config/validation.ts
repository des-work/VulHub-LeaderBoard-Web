import { plainToClass, Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  PORT: number;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_REFRESH_SECRET: string;

  @IsOptional()
  @IsString()
  REDIS_HOST?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  REDIS_PORT?: number;

  @IsOptional()
  @IsString()
  REDIS_PASSWORD?: string;

  @IsOptional()
  @IsString()
  OIDC_ISSUER?: string;

  @IsOptional()
  @IsString()
  OIDC_CLIENT_ID?: string;

  @IsOptional()
  @IsString()
  OIDC_CLIENT_SECRET?: string;

  @IsOptional()
  @IsString()
  SMTP_HOST?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  SMTP_PORT?: number;

  @IsOptional()
  @IsString()
  SMTP_USER?: string;

  @IsOptional()
  @IsString()
  SMTP_PASS?: string;

  @IsOptional()
  @IsString()
  MINIO_ENDPOINT?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  MINIO_PORT?: number;

  @IsOptional()
  @IsString()
  MINIO_ACCESS_KEY?: string;

  @IsOptional()
  @IsString()
  MINIO_SECRET_KEY?: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}

export const validationSchema = {
  NODE_ENV: {
    type: 'string',
    enum: ['development', 'production', 'test'],
    default: 'development',
  },
  PORT: {
    type: 'number',
    default: 4000,
  },
  DATABASE_URL: {
    type: 'string',
  },
  JWT_SECRET: {
    type: 'string',
  },
  JWT_REFRESH_SECRET: {
    type: 'string',
  },
  REDIS_HOST: {
    type: 'string',
    default: 'localhost',
  },
  REDIS_PORT: {
    type: 'number',
    default: 6379,
  },
  CORS_ORIGIN: {
    type: 'string',
    default: 'http://localhost:3000',
  },
};
