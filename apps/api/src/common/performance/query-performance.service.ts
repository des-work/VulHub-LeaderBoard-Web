import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../adapters/database/prisma.service';

export interface QueryMetrics {
  query: string;
  duration: number;
  timestamp: Date;
  parameters?: any[];
  slowQuery?: boolean;
}

export interface PerformanceStats {
  totalQueries: number;
  slowQueries: number;
  averageResponseTime: number;
  slowestQueries: QueryMetrics[];
  queryFrequency: Map<string, number>;
}

@Injectable()
export class QueryPerformanceService {
  private readonly logger = new Logger(QueryPerformanceService.name);
  private queryMetrics: QueryMetrics[] = [];
  private readonly SLOW_QUERY_THRESHOLD = 1000; // 1 second
  private readonly MAX_METRICS_HISTORY = 1000;

  constructor(private prisma: PrismaService) {
    this.setupQueryLogging();
  }

  /**
   * Setup Prisma query logging
   */
  private setupQueryLogging(): void {
    this.prisma.$on('query', (e) => {
      const queryMetric: QueryMetrics = {
        query: e.query,
        duration: e.duration,
        timestamp: new Date(),
        parameters: e.params,
        slowQuery: e.duration > this.SLOW_QUERY_THRESHOLD,
      };

      this.recordQuery(queryMetric);
    });
  }

  /**
   * Record query metrics
   */
  private recordQuery(metric: QueryMetrics): void {
    this.queryMetrics.push(metric);
    
    // Keep only recent metrics
    if (this.queryMetrics.length > this.MAX_METRICS_HISTORY) {
      this.queryMetrics = this.queryMetrics.slice(-this.MAX_METRICS_HISTORY);
    }

    // Log slow queries
    if (metric.slowQuery) {
      this.logger.warn(`Slow query detected: ${metric.duration}ms - ${metric.query}`);
    }
  }

  /**
   * Get performance statistics
   */
  getPerformanceStats(): PerformanceStats {
    const totalQueries = this.queryMetrics.length;
    const slowQueries = this.queryMetrics.filter(q => q.slowQuery).length;
    const averageResponseTime = totalQueries > 0 
      ? this.queryMetrics.reduce((sum, q) => sum + q.duration, 0) / totalQueries 
      : 0;

    const slowestQueries = this.queryMetrics
      .filter(q => q.slowQuery)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10);

    const queryFrequency = new Map<string, number>();
    this.queryMetrics.forEach(q => {
      const normalizedQuery = this.normalizeQuery(q.query);
      queryFrequency.set(normalizedQuery, (queryFrequency.get(normalizedQuery) || 0) + 1);
    });

    return {
      totalQueries,
      slowQueries,
      averageResponseTime,
      slowestQueries,
      queryFrequency,
    };
  }

  /**
   * Get slow queries
   */
  getSlowQueries(limit: number = 10): QueryMetrics[] {
    return this.queryMetrics
      .filter(q => q.slowQuery)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, limit);
  }

  /**
   * Get query frequency analysis
   */
  getQueryFrequencyAnalysis(): Array<{ query: string; count: number; avgDuration: number }> {
    const queryMap = new Map<string, { count: number; totalDuration: number }>();
    
    this.queryMetrics.forEach(q => {
      const normalizedQuery = this.normalizeQuery(q.query);
      const existing = queryMap.get(normalizedQuery) || { count: 0, totalDuration: 0 };
      queryMap.set(normalizedQuery, {
        count: existing.count + 1,
        totalDuration: existing.totalDuration + q.duration,
      });
    });

    return Array.from(queryMap.entries()).map(([query, data]) => ({
      query,
      count: data.count,
      avgDuration: data.totalDuration / data.count,
    })).sort((a, b) => b.count - a.count);
  }

  /**
   * Normalize query for frequency analysis
   */
  private normalizeQuery(query: string): string {
    return query
      .replace(/\$\d+/g, '$?') // Replace parameter placeholders
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .toLowerCase();
  }

  /**
   * Clear metrics history
   */
  clearMetrics(): void {
    this.queryMetrics = [];
    this.logger.log('Query metrics cleared');
  }

  /**
   * Get query performance trends
   */
  getQueryTrends(): Array<{
    timestamp: Date;
    avgDuration: number;
    queryCount: number;
  }> {
    const trends: Array<{
      timestamp: Date;
      avgDuration: number;
      queryCount: number;
    }> = [];

    // Group queries by 5-minute intervals
    const intervalMs = 5 * 60 * 1000; // 5 minutes
    const now = new Date();
    const startTime = new Date(now.getTime() - 60 * 60 * 1000); // Last hour

    for (let time = startTime.getTime(); time < now.getTime(); time += intervalMs) {
      const intervalStart = new Date(time);
      const intervalEnd = new Date(time + intervalMs);
      
      const intervalQueries = this.queryMetrics.filter(q => 
        q.timestamp >= intervalStart && q.timestamp < intervalEnd
      );

      if (intervalQueries.length > 0) {
        const avgDuration = intervalQueries.reduce((sum, q) => sum + q.duration, 0) / intervalQueries.length;
        trends.push({
          timestamp: intervalStart,
          avgDuration,
          queryCount: intervalQueries.length,
        });
      }
    }

    return trends;
  }

  /**
   * Get database connection stats
   */
  async getConnectionStats(): Promise<{
    activeConnections: number;
    maxConnections: number;
    connectionUtilization: number;
  }> {
    try {
      const result = await this.prisma.$queryRaw`
        SELECT 
          COUNT(*) as active_connections,
          (SELECT setting::int FROM pg_settings WHERE name = 'max_connections') as max_connections
        FROM pg_stat_activity 
        WHERE state = 'active'
      `;

      const data = (result as any[])[0];
      const activeConnections = parseInt(data.active_connections || '0');
      const maxConnections = parseInt(data.max_connections || '100');
      const connectionUtilization = (activeConnections / maxConnections) * 100;

      return {
        activeConnections,
        maxConnections,
        connectionUtilization,
      };
    } catch (error) {
      this.logger.error('Failed to get connection stats:', error);
      return {
        activeConnections: 0,
        maxConnections: 100,
        connectionUtilization: 0,
      };
    }
  }
}
