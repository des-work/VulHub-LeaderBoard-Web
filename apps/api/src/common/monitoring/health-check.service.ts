import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../adapters/database/prisma.service';
import { RedisService } from '../../adapters/redis/redis.service';
import { PerformanceService } from '../services/performance.service';

export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: Date;
  uptime: number;
  version: string;
  environment: string;
  services: {
    database: ServiceHealth;
    redis: ServiceHealth;
    memory: ServiceHealth;
    cpu: ServiceHealth;
  };
  metrics: {
    responseTime: number;
    errorRate: number;
    throughput: number;
  };
}

export interface ServiceHealth {
  status: 'up' | 'down' | 'degraded';
  responseTime?: number;
  lastChecked: Date;
  details?: any;
}

@Injectable()
export class HealthCheckService {
  private readonly logger = new Logger(HealthCheckService.name);
  private readonly startTime = Date.now();

  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
    private performanceService: PerformanceService,
  ) {}

  /**
   * Perform comprehensive health check
   */
  async performHealthCheck(): Promise<HealthCheckResult> {
    const timestamp = new Date();
    const uptime = Date.now() - this.startTime;

    try {
      // Check all services in parallel
      const [databaseHealth, redisHealth, memoryHealth, cpuHealth] = await Promise.all([
        this.checkDatabase(),
        this.checkRedis(),
        this.checkMemory(),
        this.checkCpu(),
      ]);

      // Determine overall status
      const serviceStatuses = [databaseHealth, redisHealth, memoryHealth, cpuHealth];
      const overallStatus = this.determineOverallStatus(serviceStatuses);

      // Get performance metrics
      const metrics = await this.getPerformanceMetrics();

      return {
        status: overallStatus,
        timestamp,
        uptime,
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        services: {
          database: databaseHealth,
          redis: redisHealth,
          memory: memoryHealth,
          cpu: cpuHealth,
        },
        metrics,
      };
    } catch (error) {
      this.logger.error('Health check failed:', error);
      return {
        status: 'unhealthy',
        timestamp,
        uptime,
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        services: {
          database: { status: 'down', lastChecked: timestamp },
          redis: { status: 'down', lastChecked: timestamp },
          memory: { status: 'down', lastChecked: timestamp },
          cpu: { status: 'down', lastChecked: timestamp },
        },
        metrics: {
          responseTime: 0,
          errorRate: 1,
          throughput: 0,
        },
      };
    }
  }

  /**
   * Check database health
   */
  private async checkDatabase(): Promise<ServiceHealth> {
    const startTime = Date.now();
    
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      const responseTime = Date.now() - startTime;
      
      return {
        status: responseTime > 1000 ? 'degraded' : 'up',
        responseTime,
        lastChecked: new Date(),
        details: {
          connectionPool: 'active',
          queryTime: responseTime,
        },
      };
    } catch (error) {
      this.logger.error('Database health check failed:', error);
      return {
        status: 'down',
        lastChecked: new Date(),
        details: { error: error.message },
      };
    }
  }

  /**
   * Check Redis health
   */
  private async checkRedis(): Promise<ServiceHealth> {
    const startTime = Date.now();
    
    try {
      await this.redisService.ping();
      const responseTime = Date.now() - startTime;
      
      return {
        status: responseTime > 500 ? 'degraded' : 'up',
        responseTime,
        lastChecked: new Date(),
        details: {
          connection: 'active',
          pingTime: responseTime,
        },
      };
    } catch (error) {
      this.logger.error('Redis health check failed:', error);
      return {
        status: 'down',
        lastChecked: new Date(),
        details: { error: error.message },
      };
    }
  }

  /**
   * Check memory health
   */
  private async checkMemory(): Promise<ServiceHealth> {
    try {
      const memUsage = process.memoryUsage();
      const heapUsedMB = memUsage.heapUsed / 1024 / 1024;
      const heapTotalMB = memUsage.heapTotal / 1024 / 1024;
      const usagePercentage = (heapUsedMB / heapTotalMB) * 100;

      let status: 'up' | 'down' | 'degraded' = 'up';
      if (usagePercentage > 90) {
        status = 'down';
      } else if (usagePercentage > 80) {
        status = 'degraded';
      }

      return {
        status,
        lastChecked: new Date(),
        details: {
          heapUsed: `${heapUsedMB.toFixed(2)} MB`,
          heapTotal: `${heapTotalMB.toFixed(2)} MB`,
          usagePercentage: `${usagePercentage.toFixed(2)}%`,
          external: `${(memUsage.external / 1024 / 1024).toFixed(2)} MB`,
        },
      };
    } catch (error) {
      this.logger.error('Memory health check failed:', error);
      return {
        status: 'down',
        lastChecked: new Date(),
        details: { error: error.message },
      };
    }
  }

  /**
   * Check CPU health
   */
  private async checkCpu(): Promise<ServiceHealth> {
    try {
      const cpuUsage = process.cpuUsage();
      const totalCpuTime = cpuUsage.user + cpuUsage.system;
      
      // Simple CPU usage estimation
      const cpuPercentage = Math.min(totalCpuTime / 1000000, 100); // Convert to percentage
      
      let status: 'up' | 'down' | 'degraded' = 'up';
      if (cpuPercentage > 90) {
        status = 'down';
      } else if (cpuPercentage > 80) {
        status = 'degraded';
      }

      return {
        status,
        lastChecked: new Date(),
        details: {
          userTime: `${(cpuUsage.user / 1000000).toFixed(2)}s`,
          systemTime: `${(cpuUsage.system / 1000000).toFixed(2)}s`,
          totalTime: `${(totalCpuTime / 1000000).toFixed(2)}s`,
        },
      };
    } catch (error) {
      this.logger.error('CPU health check failed:', error);
      return {
        status: 'down',
        lastChecked: new Date(),
        details: { error: error.message },
      };
    }
  }

  /**
   * Get performance metrics
   */
  private async getPerformanceMetrics() {
    try {
      const performanceSummary = this.performanceService.getPerformanceSummary();
      
      return {
        responseTime: performanceSummary.averageResponseTime,
        errorRate: performanceSummary.errorRate,
        throughput: performanceSummary.totalRequests / (performanceSummary.uptime / 1000), // requests per second
      };
    } catch (error) {
      this.logger.error('Failed to get performance metrics:', error);
      return {
        responseTime: 0,
        errorRate: 0,
        throughput: 0,
      };
    }
  }

  /**
   * Determine overall health status
   */
  private determineOverallStatus(serviceStatuses: ServiceHealth[]): 'healthy' | 'unhealthy' | 'degraded' {
    const downServices = serviceStatuses.filter(s => s.status === 'down').length;
    const degradedServices = serviceStatuses.filter(s => s.status === 'degraded').length;

    if (downServices > 0) {
      return 'unhealthy';
    } else if (degradedServices > 0) {
      return 'degraded';
    } else {
      return 'healthy';
    }
  }

  /**
   * Get detailed health report
   */
  async getDetailedHealthReport(): Promise<any> {
    const healthCheck = await this.performHealthCheck();
    const performanceSummary = this.performanceService.getPerformanceSummary();
    const performanceTrends = this.performanceService.getPerformanceTrends();

    return {
      ...healthCheck,
      performance: {
        summary: performanceSummary,
        trends: performanceTrends,
      },
      recommendations: this.generateRecommendations(healthCheck, performanceSummary),
    };
  }

  /**
   * Generate health recommendations
   */
  private generateRecommendations(healthCheck: HealthCheckResult, performanceSummary: any): string[] {
    const recommendations: string[] = [];

    // Database recommendations
    if (healthCheck.services.database.status === 'degraded') {
      recommendations.push('Database response time is slow. Consider optimizing queries or scaling database resources.');
    }

    // Memory recommendations
    if (healthCheck.services.memory.status === 'degraded') {
      recommendations.push('Memory usage is high. Consider implementing memory optimization strategies or scaling resources.');
    }

    // Performance recommendations
    if (performanceSummary.averageResponseTime > 1000) {
      recommendations.push('Average response time is high. Consider implementing caching or query optimization.');
    }

    if (performanceSummary.errorRate > 0.05) {
      recommendations.push('Error rate is elevated. Investigate and fix error sources.');
    }

    return recommendations;
  }
}
