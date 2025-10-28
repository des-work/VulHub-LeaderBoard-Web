import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { QueryPerformanceService } from '../performance/query-performance.service';
import { ResponseOptimizerService } from '../performance/response-optimizer.service';
import { MemoryManagerService } from '../performance/memory-manager.service';

@ApiTags('performance')
@Controller('performance')
export class PerformanceController {
  constructor(
    private queryPerformanceService: QueryPerformanceService,
    private responseOptimizerService: ResponseOptimizerService,
    private memoryManagerService: MemoryManagerService,
  ) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get performance overview' })
  @ApiResponse({ status: 200, description: 'Performance overview retrieved' })
  getPerformanceOverview(): {
    database: any;
    api: any;
    memory: any;
    system: {
      uptime: number;
      nodeVersion: string;
      platform: string;
      cpuUsage: NodeJS.CpuUsage;
    };
  } {
    return {
      database: this.queryPerformanceService.getPerformanceStats(),
      api: this.responseOptimizerService.getResponseStats(),
      memory: this.memoryManagerService.getMemoryStats(),
      system: {
        uptime: process.uptime(),
        nodeVersion: process.version,
        platform: process.platform,
        cpuUsage: process.cpuUsage(),
      },
    };
  }

  @Get('database/stats')
  @ApiOperation({ summary: 'Get database performance statistics' })
  @ApiResponse({ status: 200, description: 'Database stats retrieved' })
  getDatabaseStats(): any {
    return this.queryPerformanceService.getPerformanceStats();
  }

  @Get('database/slow-queries')
  @ApiOperation({ summary: 'Get slow queries' })
  @ApiResponse({ status: 200, description: 'Slow queries retrieved' })
  getSlowQueries(): any {
    return this.queryPerformanceService.getSlowQueries();
  }

  @Get('database/frequency')
  @ApiOperation({ summary: 'Get query frequency analysis' })
  @ApiResponse({ status: 200, description: 'Query frequency analysis retrieved' })
  getQueryFrequency(): any {
    return this.queryPerformanceService.getQueryFrequencyAnalysis();
  }

  @Get('database/trends')
  @ApiOperation({ summary: 'Get query performance trends' })
  @ApiResponse({ status: 200, description: 'Query trends retrieved' })
  getQueryTrends(): any {
    return this.queryPerformanceService.getQueryTrends();
  }

  @Get('database/connections')
  @ApiOperation({ summary: 'Get database connection statistics' })
  @ApiResponse({ status: 200, description: 'Connection stats retrieved' })
  async getConnectionStats(): Promise<any> {
    return await this.queryPerformanceService.getConnectionStats();
  }

  @Get('api/stats')
  @ApiOperation({ summary: 'Get API performance statistics' })
  @ApiResponse({ status: 200, description: 'API stats retrieved' })
  getApiStats(): any {
    return this.responseOptimizerService.getResponseStats();
  }

  @Get('api/trends')
  @ApiOperation({ summary: 'Get API response time trends' })
  @ApiResponse({ status: 200, description: 'Response time trends retrieved' })
  getResponseTimeTrends(): any {
    return this.responseOptimizerService.getResponseTimeTrends();
  }

  @Get('api/endpoints')
  @ApiOperation({ summary: 'Get endpoint performance analysis' })
  @ApiResponse({ status: 200, description: 'Endpoint analysis retrieved' })
  getEndpointAnalysis(): any {
    return this.responseOptimizerService.getEndpointAnalysis();
  }

  @Get('memory/stats')
  @ApiOperation({ summary: 'Get memory statistics' })
  @ApiResponse({ status: 200, description: 'Memory stats retrieved' })
  getMemoryStats(): any {
    return this.memoryManagerService.getMemoryStats();
  }

  @Get('memory/history')
  @ApiOperation({ summary: 'Get memory usage history' })
  @ApiResponse({ status: 200, description: 'Memory history retrieved' })
  getMemoryHistory(): any {
    return this.memoryManagerService.getMemoryHistory();
  }

  @Get('memory/leaks')
  @ApiOperation({ summary: 'Detect memory leaks' })
  @ApiResponse({ status: 200, description: 'Memory leak detection completed' })
  detectMemoryLeaks(): any {
    return this.memoryManagerService.detectMemoryLeaks();
  }

  @Post('memory/gc')
  @ApiOperation({ summary: 'Force garbage collection' })
  @ApiResponse({ status: 200, description: 'Garbage collection triggered' })
  forceGarbageCollection(): { message: string } {
    this.memoryManagerService.forceGarbageCollection();
    return { message: 'Garbage collection triggered' };
  }

  @Post('memory/threshold/:threshold')
  @ApiOperation({ summary: 'Set memory threshold' })
  @ApiParam({ name: 'threshold', description: 'Memory threshold (0.1-1.0)' })
  @ApiResponse({ status: 200, description: 'Memory threshold updated' })
  setMemoryThreshold(@Param('threshold') threshold: string): { message: string } {
    const thresholdValue = parseFloat(threshold);
    this.memoryManagerService.setMemoryThreshold(thresholdValue);
    return { message: `Memory threshold set to ${thresholdValue}` };
  }

  @Post('memory/clear-history')
  @ApiOperation({ summary: 'Clear memory history' })
  @ApiResponse({ status: 200, description: 'Memory history cleared' })
  clearMemoryHistory(): { message: string } {
    this.memoryManagerService.clearHistory();
    return { message: 'Memory history cleared' };
  }

  @Post('clear-metrics')
  @ApiOperation({ summary: 'Clear all performance metrics' })
  @ApiResponse({ status: 200, description: 'Metrics cleared' })
  clearMetrics(): { message: string } {
    this.queryPerformanceService.clearMetrics();
    this.responseOptimizerService.clearMetrics();
    this.memoryManagerService.clearHistory();
    return { message: 'All performance metrics cleared' };
  }

  @Get('health')
  @ApiOperation({ summary: 'Get performance health status' })
  @ApiResponse({ status: 200, description: 'Performance health retrieved' })
  getPerformanceHealth(): {
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check database performance
    const dbStats = this.queryPerformanceService.getPerformanceStats();
    if (dbStats.slowQueries > 0) {
      issues.push(`${dbStats.slowQueries} slow queries detected`);
      recommendations.push('Review and optimize slow queries');
    }

    // Check API performance
    const apiStats = this.responseOptimizerService.getResponseStats();
    if (apiStats.averageResponseTime > 200) {
      issues.push(`High average response time: ${apiStats.averageResponseTime.toFixed(2)}ms`);
      recommendations.push('Optimize API endpoints and database queries');
    }

    if (apiStats.errorRate > 5) {
      issues.push(`High error rate: ${apiStats.errorRate.toFixed(2)}%`);
      recommendations.push('Investigate and fix API errors');
    }

    // Check memory usage
    const memoryStats = this.memoryManagerService.getMemoryStats();
    if (memoryStats.usagePercentage > 80) {
      issues.push(`High memory usage: ${memoryStats.usagePercentage.toFixed(2)}%`);
      recommendations.push('Consider increasing memory or optimizing memory usage');
    }

    const leakDetection = this.memoryManagerService.detectMemoryLeaks();
    if (leakDetection.hasLeak) {
      issues.push(`Memory leak detected: ${leakDetection.description}`);
      recommendations.push('Investigate and fix memory leaks');
    }

    // Determine overall status
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (issues.length > 0) {
      status = issues.length > 2 ? 'critical' : 'warning';
    }

    return {
      status,
      issues,
      recommendations,
    };
  }
}
