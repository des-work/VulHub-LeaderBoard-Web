import { Injectable, Logger } from '@nestjs/common';

export interface ResponseMetrics {
  endpoint: string;
  method: string;
  responseTime: number;
  statusCode: number;
  timestamp: Date;
  memoryUsage: NodeJS.MemoryUsage;
}

@Injectable()
export class ResponseOptimizerService {
  private readonly logger = new Logger(ResponseOptimizerService.name);
  private responseMetrics: ResponseMetrics[] = [];
  private readonly MAX_METRICS_HISTORY = 1000;
  private readonly SLOW_RESPONSE_THRESHOLD = 200; // 200ms

  /**
   * Record response metrics
   */
  recordResponse(metrics: ResponseMetrics): void {
    this.responseMetrics.push(metrics);
    
    // Keep only recent metrics
    if (this.responseMetrics.length > this.MAX_METRICS_HISTORY) {
      this.responseMetrics = this.responseMetrics.slice(-this.MAX_METRICS_HISTORY);
    }

    // Log slow responses
    if (metrics.responseTime > this.SLOW_RESPONSE_THRESHOLD) {
      this.logger.warn(`Slow response: ${metrics.responseTime}ms - ${metrics.method} ${metrics.endpoint}`);
    }
  }

  /**
   * Get response performance statistics
   */
  getResponseStats(): {
    totalRequests: number;
    slowRequests: number;
    averageResponseTime: number;
    slowestEndpoints: Array<{
      endpoint: string;
      method: string;
      avgResponseTime: number;
      requestCount: number;
    }>;
    errorRate: number;
    throughput: number;
  } {
    const totalRequests = this.responseMetrics.length;
    const slowRequests = this.responseMetrics.filter(m => m.responseTime > this.SLOW_RESPONSE_THRESHOLD).length;
    const averageResponseTime = totalRequests > 0 
      ? this.responseMetrics.reduce((sum, m) => sum + m.responseTime, 0) / totalRequests 
      : 0;

    // Group by endpoint
    const endpointMap = new Map<string, { count: number; totalTime: number }>();
    this.responseMetrics.forEach(m => {
      const key = `${m.method} ${m.endpoint}`;
      const existing = endpointMap.get(key) || { count: 0, totalTime: 0 };
      endpointMap.set(key, {
        count: existing.count + 1,
        totalTime: existing.totalTime + m.responseTime,
      });
    });

    const slowestEndpoints = Array.from(endpointMap.entries()).map(([key, data]) => {
      const [method, endpoint] = key.split(' ', 2);
      return {
        endpoint,
        method,
        avgResponseTime: data.totalTime / data.count,
        requestCount: data.count,
      };
    }).sort((a, b) => b.avgResponseTime - a.avgResponseTime).slice(0, 10);

    const errorRequests = this.responseMetrics.filter(m => m.statusCode >= 400).length;
    const errorRate = totalRequests > 0 ? (errorRequests / totalRequests) * 100 : 0;

    // Calculate throughput (requests per minute)
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
    const recentRequests = this.responseMetrics.filter(m => m.timestamp >= oneMinuteAgo).length;
    const throughput = recentRequests;

    return {
      totalRequests,
      slowRequests,
      averageResponseTime,
      slowestEndpoints,
      errorRate,
      throughput,
    };
  }

  /**
   * Get memory usage statistics
   */
  getMemoryStats(): {
    current: NodeJS.MemoryUsage;
    average: NodeJS.MemoryUsage;
    peak: NodeJS.MemoryUsage;
  } {
    const current = process.memoryUsage();
    
    const avgMemory = this.responseMetrics.reduce((acc, m) => ({
      rss: acc.rss + m.memoryUsage.rss,
      heapTotal: acc.heapTotal + m.memoryUsage.heapTotal,
      heapUsed: acc.heapUsed + m.memoryUsage.heapUsed,
      external: acc.external + m.memoryUsage.external,
      arrayBuffers: acc.arrayBuffers + m.memoryUsage.arrayBuffers,
    }), {
      rss: 0,
      heapTotal: 0,
      heapUsed: 0,
      external: 0,
      arrayBuffers: 0,
    });

    const count = this.responseMetrics.length || 1;
    const average: NodeJS.MemoryUsage = {
      rss: avgMemory.rss / count,
      heapTotal: avgMemory.heapTotal / count,
      heapUsed: avgMemory.heapUsed / count,
      external: avgMemory.external / count,
      arrayBuffers: avgMemory.arrayBuffers / count,
    };

    const peak: NodeJS.MemoryUsage = this.responseMetrics.reduce((acc, m) => ({
      rss: Math.max(acc.rss, m.memoryUsage.rss),
      heapTotal: Math.max(acc.heapTotal, m.memoryUsage.heapTotal),
      heapUsed: Math.max(acc.heapUsed, m.memoryUsage.heapUsed),
      external: Math.max(acc.external, m.memoryUsage.external),
      arrayBuffers: Math.max(acc.arrayBuffers, m.memoryUsage.arrayBuffers),
    }), current);

    return { current, average, peak };
  }

  /**
   * Get response time trends
   */
  getResponseTimeTrends(): Array<{
    timestamp: Date;
    avgResponseTime: number;
    requestCount: number;
    errorCount: number;
  }> {
    const trends: Array<{
      timestamp: Date;
      avgResponseTime: number;
      requestCount: number;
      errorCount: number;
    }> = [];

    // Group responses by 1-minute intervals
    const intervalMs = 60 * 1000; // 1 minute
    const now = new Date();
    const startTime = new Date(now.getTime() - 60 * 60 * 1000); // Last hour

    for (let time = startTime.getTime(); time < now.getTime(); time += intervalMs) {
      const intervalStart = new Date(time);
      const intervalEnd = new Date(time + intervalMs);
      
      const intervalResponses = this.responseMetrics.filter(r => 
        r.timestamp >= intervalStart && r.timestamp < intervalEnd
      );

      if (intervalResponses.length > 0) {
        const avgResponseTime = intervalResponses.reduce((sum, r) => sum + r.responseTime, 0) / intervalResponses.length;
        const errorCount = intervalResponses.filter(r => r.statusCode >= 400).length;
        
        trends.push({
          timestamp: intervalStart,
          avgResponseTime,
          requestCount: intervalResponses.length,
          errorCount,
        });
      }
    }

    return trends;
  }

  /**
   * Get endpoint performance analysis
   */
  getEndpointAnalysis(): Array<{
    endpoint: string;
    method: string;
    totalRequests: number;
    avgResponseTime: number;
    minResponseTime: number;
    maxResponseTime: number;
    errorRate: number;
    p95ResponseTime: number;
    p99ResponseTime: number;
  }> {
    const endpointMap = new Map<string, ResponseMetrics[]>();
    
    this.responseMetrics.forEach(m => {
      const key = `${m.method} ${m.endpoint}`;
      if (!endpointMap.has(key)) {
        endpointMap.set(key, []);
      }
      endpointMap.get(key)!.push(m);
    });

    return Array.from(endpointMap.entries()).map(([key, responses]) => {
      const [method, endpoint] = key.split(' ', 2);
      const responseTimes = responses.map(r => r.responseTime).sort((a, b) => a - b);
      const errorCount = responses.filter(r => r.statusCode >= 400).length;
      
      const p95Index = Math.floor(responseTimes.length * 0.95);
      const p99Index = Math.floor(responseTimes.length * 0.99);
      
      return {
        endpoint,
        method,
        totalRequests: responses.length,
        avgResponseTime: responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length,
        minResponseTime: responseTimes[0] || 0,
        maxResponseTime: responseTimes[responseTimes.length - 1] || 0,
        errorRate: (errorCount / responses.length) * 100,
        p95ResponseTime: responseTimes[p95Index] || 0,
        p99ResponseTime: responseTimes[p99Index] || 0,
      };
    }).sort((a, b) => b.totalRequests - a.totalRequests);
  }

  /**
   * Clear metrics
   */
  clearMetrics(): void {
    this.responseMetrics = [];
    this.logger.log('Response metrics cleared');
  }

  /**
   * Set slow response threshold
   */
  setSlowResponseThreshold(threshold: number): void {
    this.logger.log(`Slow response threshold set to ${threshold}ms`);
  }
}
