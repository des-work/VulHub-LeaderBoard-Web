import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  HealthCheckService,
  HealthCheck,
  HealthCheckResult,
} from '@nestjs/terminus';
import { DatabaseHealthIndicator } from './database.health';
import { RedisHealthIndicator } from './redis.health';
import { ProductionHealthService } from './production-health.service';
import { EnvironmentValidator } from '../../config/environment-validator';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private dbHealth: DatabaseHealthIndicator,
    private redisHealth: RedisHealthIndicator,
    private productionHealth: ProductionHealthService,
    private envValidator: EnvironmentValidator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({
    summary: 'Basic health check',
    description: 'Quick health check for load balancers and monitoring systems'
  })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        info: {
          type: 'object',
          properties: {
            api: {
              type: 'object',
              properties: {
                status: { type: 'string', example: 'up' },
                message: { type: 'string', example: 'API is running' }
              }
            }
          }
        },
        error: { type: 'object' },
        details: { type: 'object' }
      }
    }
  })
  @ApiResponse({ status: 503, description: 'Service is unhealthy' })
  async check(): Promise<HealthCheckResult> {
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (isDevelopment) {
      // Simple health check for development
      return this.health.check([
        () => this.dbHealth.isHealthy('database'),
        () => this.redisHealth.isHealthy('redis'),
      ]);
    }

    // Production health check with comprehensive checks
    return this.health.check([
      () => this.dbHealth.isHealthy('database'),
      () => this.redisHealth.isHealthy('redis'),
    ]);
  }

  @Get('ready')
  @HealthCheck()
  @ApiOperation({
    summary: 'Readiness check',
    description: 'Checks if the service is ready to accept traffic'
  })
  @ApiResponse({ status: 200, description: 'Service is ready to accept traffic' })
  @ApiResponse({ status: 503, description: 'Service is not ready' })
  async ready(): Promise<HealthCheckResult> {
    // Readiness check - verify all critical dependencies
    return this.health.check([
      () => this.dbHealth.isHealthy('database'),
      () => this.redisHealth.isHealthy('redis'),
    ]);
  }

  @Get('live')
  @ApiOperation({
    summary: 'Liveness check',
    description: 'Checks if the service is running (for Kubernetes liveness probes)'
  })
  @ApiResponse({
    status: 200,
    description: 'Service is alive',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', format: 'date-time' },
        uptime: { type: 'number', description: 'Process uptime in seconds' },
        version: { type: 'string', description: 'Application version' },
        environment: { type: 'string', description: 'Current environment' }
      }
    }
  })
  alive() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    };
  }

  @Get('detailed')
  @ApiOperation({
    summary: 'Detailed health status',
    description: 'Comprehensive health check with detailed metrics and diagnostics'
  })
  @ApiResponse({
    status: 200,
    description: 'Detailed health status',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['healthy', 'degraded', 'unhealthy'],
          description: 'Overall health status'
        },
        timestamp: { type: 'string', format: 'date-time' },
        uptime: { type: 'number', description: 'Process uptime in milliseconds' },
        version: { type: 'string' },
        environment: { type: 'string' },
        checks: {
          type: 'object',
          properties: {
            database: { $ref: '#/components/schemas/HealthCheck' },
            redis: { $ref: '#/components/schemas/HealthCheck' },
            memory: { $ref: '#/components/schemas/HealthCheck' },
            disk: { $ref: '#/components/schemas/HealthCheck' },
            api: { $ref: '#/components/schemas/HealthCheck' }
          }
        },
        metrics: {
          type: 'object',
          properties: {
            responseTime: { type: 'number' },
            errorRate: { type: 'number' },
            requestCount: { type: 'number' },
            activeConnections: { type: 'number' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 503, description: 'Service has health issues' })
  async detailed() {
    return this.productionHealth.getHealthStatus();
  }

  @Get('config')
  @ApiOperation({
    summary: 'Configuration validation status',
    description: 'Check environment configuration validation results'
  })
  @ApiResponse({
    status: 200,
    description: 'Configuration validation results',
    schema: {
      type: 'object',
      properties: {
        isValid: { type: 'boolean' },
        errors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              field: { type: 'string' },
              message: { type: 'string' },
              severity: { type: 'string', enum: ['critical', 'high', 'medium', 'low'] },
              suggestion: { type: 'string' }
            }
          }
        },
        warnings: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              field: { type: 'string' },
              message: { type: 'string' },
              suggestion: { type: 'string' }
            }
          }
        },
        recommendations: {
          type: 'array',
          items: { type: 'string' }
        }
      }
    }
  })
  getConfigValidation() {
    return this.envValidator.getValidationResult();
  }

  @Get('metrics')
  @ApiOperation({
    summary: 'Application metrics',
    description: 'Get current application performance metrics'
  })
  @ApiResponse({
    status: 200,
    description: 'Current metrics',
    schema: {
      type: 'object',
      properties: {
        memory: {
          type: 'object',
          properties: {
            heapUsed: { type: 'number' },
            heapTotal: { type: 'number' },
            external: { type: 'number' },
            rss: { type: 'number' }
          }
        },
        uptime: { type: 'number' },
        pid: { type: 'number' },
        nodeVersion: { type: 'string' },
        platform: { type: 'string' }
      }
    }
  })
  getMetrics() {
    const memoryUsage = process.memoryUsage();

    return {
      memory: {
        heapUsed: memoryUsage.heapUsed,
        heapTotal: memoryUsage.heapTotal,
        external: memoryUsage.external,
        rss: memoryUsage.rss,
        usagePercentage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100 * 100) / 100,
      },
      uptime: process.uptime(),
      pid: process.pid,
      nodeVersion: process.version,
      platform: process.platform,
      architecture: process.arch,
    };
  }
}
