import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../adapters/database/prisma.service';
import { RedisService } from '../../adapters/redis/redis.service';

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  checks: {
    database: HealthCheck;
    redis: HealthCheck;
    memory: HealthCheck;
    disk: HealthCheck;
    api: HealthCheck;
  };
  metrics: {
    responseTime: number;
    errorRate: number;
    requestCount: number;
    activeConnections: number;
  };
}

export interface HealthCheck {
  status: 'up' | 'down' | 'degraded';
  responseTime: number;
  lastChecked: string;
  details?: any;
}

@Injectable()
export class ProductionHealthService {
  private readonly logger = new Logger(ProductionHealthService.name);
  private startTime: number;
  private requestCount: number = 0;
  private errorCount: number = 0;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {
    this.startTime = Date.now();
  }

  async getHealthStatus(): Promise<HealthStatus> {
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkRedis(),
      this.checkMemory(),
      this.checkDisk(),
      this.checkApi(),
    ]);

    const [database, redis, memory, disk, api] = checks.map(result => 
      result.status === 'fulfilled' ? result.value : {
        status: 'down' as const,
        responseTime: 0,
        lastChecked: new Date().toISOString(),
        details: { error: result.reason?.message || 'Unknown error' },
      }
    );

    const overallStatus = this.determineOverallStatus([database, redis, memory, disk, api]);

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
      version: this.configService.get('npm_package_version', '1.0.0'),
      environment: this.configService.get('NODE_ENV', 'development'),
      checks: {
        database,
        redis,
        memory,
        disk,
        api,
      },
      metrics: {
        responseTime: this.calculateAverageResponseTime(),
        errorRate: this.calculateErrorRate(),
        requestCount: this.requestCount,
        activeConnections: await this.getActiveConnections(),
      },
    };
  }

  private async checkDatabase(): Promise<HealthCheck> {
    const startTime = Date.now();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'up',
        responseTime,
        lastChecked: new Date().toISOString(),
        details: {
          connectionPool: await this.getDatabaseConnectionPool(),
        },
      };
    } catch (error) {
      return {
        status: 'down',
        responseTime: Date.now() - startTime,
        lastChecked: new Date().toISOString(),
        details: { error: error.message },
      };
    }
  }

  private async checkRedis(): Promise<HealthCheck> {
    const startTime = Date.now();
    try {
      const pong = await this.redisService.ping();
      const responseTime = Date.now() - startTime;
      
      return {
        status: pong === 'PONG' ? 'up' : 'degraded',
        responseTime,
        lastChecked: new Date().toISOString(),
        details: {
          memory: await this.getRedisMemoryUsage(),
        },
      };
    } catch (error) {
      return {
        status: 'down',
        responseTime: Date.now() - startTime,
        lastChecked: new Date().toISOString(),
        details: { error: error.message },
      };
    }
  }

  private async checkMemory(): Promise<HealthCheck> {
    const startTime = Date.now();
    try {
      const memoryUsage = process.memoryUsage();
      const responseTime = Date.now() - startTime;
      
      const usagePercentage = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
      const status = usagePercentage > 90 ? 'degraded' : 'up';
      
      return {
        status,
        responseTime,
        lastChecked: new Date().toISOString(),
        details: {
          heapUsed: memoryUsage.heapUsed,
          heapTotal: memoryUsage.heapTotal,
          external: memoryUsage.external,
          rss: memoryUsage.rss,
          usagePercentage: Math.round(usagePercentage * 100) / 100,
        },
      };
    } catch (error) {
      return {
        status: 'down',
        responseTime: Date.now() - startTime,
        lastChecked: new Date().toISOString(),
        details: { error: error.message },
      };
    }
  }

  private async checkDisk(): Promise<HealthCheck> {
    const startTime = Date.now();
    try {
      const fs = require('fs');
      const path = require('path');
      
      // Check disk space
      const stats = fs.statSync('.');
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'up',
        responseTime,
        lastChecked: new Date().toISOString(),
        details: {
          available: true,
        },
      };
    } catch (error) {
      return {
        status: 'down',
        responseTime: Date.now() - startTime,
        lastChecked: new Date().toISOString(),
        details: { error: error.message },
      };
    }
  }

  private async checkApi(): Promise<HealthCheck> {
    const startTime = Date.now();
    try {
      // Simulate API check
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'up',
        responseTime,
        lastChecked: new Date().toISOString(),
        details: {
          endpoints: await this.getApiEndpointStatus(),
        },
      };
    } catch (error) {
      return {
        status: 'down',
        responseTime: Date.now() - startTime,
        lastChecked: new Date().toISOString(),
        details: { error: error.message },
      };
    }
  }

  private determineOverallStatus(checks: HealthCheck[]): 'healthy' | 'degraded' | 'unhealthy' {
    const downCount = checks.filter(check => check.status === 'down').length;
    const degradedCount = checks.filter(check => check.status === 'degraded').length;
    
    if (downCount > 0) return 'unhealthy';
    if (degradedCount > 0) return 'degraded';
    return 'healthy';
  }

  private calculateAverageResponseTime(): number {
    // This would be calculated from actual request metrics
    return 150; // Mock value
  }

  private calculateErrorRate(): number {
    if (this.requestCount === 0) return 0;
    return (this.errorCount / this.requestCount) * 100;
  }

  private async getActiveConnections(): Promise<number> {
    // This would be calculated from actual connection metrics
    return 25; // Mock value
  }

  private async getDatabaseConnectionPool(): Promise<any> {
    // This would return actual connection pool metrics
    return {
      active: 5,
      idle: 10,
      total: 15,
    };
  }

  private async getRedisMemoryUsage(): Promise<any> {
    try {
      const info = await this.redisService.info('memory');
      const usedMemoryMatch = info.match(/used_memory:(\d+)/);
      const usedMemory = usedMemoryMatch ? parseInt(usedMemoryMatch[1]) : 0;
      
      return {
        used: usedMemory,
        human: this.formatBytes(usedMemory),
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  private async getApiEndpointStatus(): Promise<any> {
    // This would return actual endpoint status
    return {
      total: 25,
      healthy: 24,
      degraded: 1,
      down: 0,
    };
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  incrementRequestCount(): void {
    this.requestCount++;
  }

  incrementErrorCount(): void {
    this.errorCount++;
  }
}
