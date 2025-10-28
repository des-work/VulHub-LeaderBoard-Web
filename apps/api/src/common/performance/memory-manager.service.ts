import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MemoryManagerService {
  private readonly logger = new Logger(MemoryManagerService.name);
  private memoryThreshold = 0.8; // 80% memory usage threshold
  private gcInterval: NodeJS.Timeout | null = null;
  private memoryHistory: Array<{
    timestamp: Date;
    memoryUsage: NodeJS.MemoryUsage;
  }> = [];
  private readonly MAX_HISTORY_SIZE = 1000;

  constructor() {
    this.startMemoryMonitoring();
  }

  /**
   * Start memory monitoring
   */
  private startMemoryMonitoring(): void {
    this.gcInterval = setInterval(() => {
      this.checkMemoryUsage();
    }, 30000); // Check every 30 seconds
  }

  /**
   * Check memory usage and trigger GC if needed
   */
  private checkMemoryUsage(): void {
    const memUsage = process.memoryUsage();
    const heapUsedMB = memUsage.heapUsed / 1024 / 1024;
    const heapTotalMB = memUsage.heapTotal / 1024 / 1024;
    const usagePercentage = heapUsedMB / heapTotalMB;

    // Record memory usage
    this.recordMemoryUsage(memUsage);

    if (usagePercentage > this.memoryThreshold) {
      this.logger.warn(`High memory usage detected: ${usagePercentage.toFixed(2)}%`);
      this.forceGarbageCollection();
    }
  }

  /**
   * Record memory usage
   */
  private recordMemoryUsage(memUsage: NodeJS.MemoryUsage): void {
    this.memoryHistory.push({
      timestamp: new Date(),
      memoryUsage: { ...memUsage },
    });

    // Keep only recent history
    if (this.memoryHistory.length > this.MAX_HISTORY_SIZE) {
      this.memoryHistory = this.memoryHistory.slice(-this.MAX_HISTORY_SIZE);
    }
  }

  /**
   * Force garbage collection
   */
  forceGarbageCollection(): void {
    if (global.gc) {
      const beforeGC = process.memoryUsage();
      global.gc();
      const afterGC = process.memoryUsage();
      
      const freedMB = (beforeGC.heapUsed - afterGC.heapUsed) / 1024 / 1024;
      this.logger.log(`Garbage collection completed. Freed: ${freedMB.toFixed(2)}MB`);
    } else {
      this.logger.warn('Garbage collection not available. Run with --expose-gc flag');
    }
  }

  /**
   * Get memory usage statistics
   */
  getMemoryStats(): {
    current: NodeJS.MemoryUsage;
    formatted: {
      rss: string;
      heapTotal: string;
      heapUsed: string;
      external: string;
      arrayBuffers: string;
    };
    usagePercentage: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    peak: NodeJS.MemoryUsage;
    average: NodeJS.MemoryUsage;
  } {
    const memUsage = process.memoryUsage();
    const usagePercentage = (memUsage.heapUsed / memUsage.heapTotal) * 100;

    // Calculate trend
    const trend = this.calculateMemoryTrend();

    // Calculate peak and average
    const peak = this.getPeakMemoryUsage();
    const average = this.getAverageMemoryUsage();

    return {
      current: memUsage,
      formatted: {
        rss: this.formatBytes(memUsage.rss),
        heapTotal: this.formatBytes(memUsage.heapTotal),
        heapUsed: this.formatBytes(memUsage.heapUsed),
        external: this.formatBytes(memUsage.external),
        arrayBuffers: this.formatBytes(memUsage.arrayBuffers),
      },
      usagePercentage,
      trend,
      peak,
      average,
    };
  }

  /**
   * Calculate memory trend
   */
  private calculateMemoryTrend(): 'increasing' | 'decreasing' | 'stable' {
    if (this.memoryHistory.length < 2) {
      return 'stable';
    }

    const recent = this.memoryHistory.slice(-5); // Last 5 measurements
    const first = recent[0].memoryUsage.heapUsed;
    const last = recent[recent.length - 1].memoryUsage.heapUsed;
    
    const change = (last - first) / first;
    
    if (change > 0.05) return 'increasing';
    if (change < -0.05) return 'decreasing';
    return 'stable';
  }

  /**
   * Get peak memory usage
   */
  private getPeakMemoryUsage(): NodeJS.MemoryUsage {
    if (this.memoryHistory.length === 0) {
      return process.memoryUsage();
    }

    return this.memoryHistory.reduce((peak, entry) => ({
      rss: Math.max(peak.rss, entry.memoryUsage.rss),
      heapTotal: Math.max(peak.heapTotal, entry.memoryUsage.heapTotal),
      heapUsed: Math.max(peak.heapUsed, entry.memoryUsage.heapUsed),
      external: Math.max(peak.external, entry.memoryUsage.external),
      arrayBuffers: Math.max(peak.arrayBuffers, entry.memoryUsage.arrayBuffers),
    }), this.memoryHistory[0].memoryUsage);
  }

  /**
   * Get average memory usage
   */
  private getAverageMemoryUsage(): NodeJS.MemoryUsage {
    if (this.memoryHistory.length === 0) {
      return process.memoryUsage();
    }

    const sum = this.memoryHistory.reduce((acc, entry) => ({
      rss: acc.rss + entry.memoryUsage.rss,
      heapTotal: acc.heapTotal + entry.memoryUsage.heapTotal,
      heapUsed: acc.heapUsed + entry.memoryUsage.heapUsed,
      external: acc.external + entry.memoryUsage.external,
      arrayBuffers: acc.arrayBuffers + entry.memoryUsage.arrayBuffers,
    }), {
      rss: 0,
      heapTotal: 0,
      heapUsed: 0,
      external: 0,
      arrayBuffers: 0,
    });

    const count = this.memoryHistory.length;
    return {
      rss: sum.rss / count,
      heapTotal: sum.heapTotal / count,
      heapUsed: sum.heapUsed / count,
      external: sum.external / count,
      arrayBuffers: sum.arrayBuffers / count,
    };
  }

  /**
   * Get memory usage history
   */
  getMemoryHistory(): Array<{
    timestamp: Date;
    heapUsed: number;
    heapTotal: number;
    usagePercentage: number;
  }> {
    return this.memoryHistory.map(entry => ({
      timestamp: entry.timestamp,
      heapUsed: entry.memoryUsage.heapUsed,
      heapTotal: entry.memoryUsage.heapTotal,
      usagePercentage: (entry.memoryUsage.heapUsed / entry.memoryUsage.heapTotal) * 100,
    }));
  }

  /**
   * Set memory threshold
   */
  setMemoryThreshold(threshold: number): void {
    if (threshold > 0 && threshold <= 1) {
      this.memoryThreshold = threshold;
      this.logger.log(`Memory threshold set to ${(threshold * 100).toFixed(1)}%`);
    }
  }

  /**
   * Get memory leak detection
   */
  detectMemoryLeaks(): {
    hasLeak: boolean;
    leakSeverity: 'low' | 'medium' | 'high';
    description: string;
  } {
    if (this.memoryHistory.length < 10) {
      return {
        hasLeak: false,
        leakSeverity: 'low',
        description: 'Insufficient data for leak detection',
      };
    }

    const recent = this.memoryHistory.slice(-10);
    const first = recent[0].memoryUsage.heapUsed;
    const last = recent[recent.length - 1].memoryUsage.heapUsed;
    
    const growthRate = (last - first) / first;
    
    if (growthRate > 0.2) {
      return {
        hasLeak: true,
        leakSeverity: 'high',
        description: `High memory growth detected: ${(growthRate * 100).toFixed(1)}% increase`,
      };
    } else if (growthRate > 0.1) {
      return {
        hasLeak: true,
        leakSeverity: 'medium',
        description: `Moderate memory growth detected: ${(growthRate * 100).toFixed(1)}% increase`,
      };
    } else if (growthRate > 0.05) {
      return {
        hasLeak: true,
        leakSeverity: 'low',
        description: `Low memory growth detected: ${(growthRate * 100).toFixed(1)}% increase`,
      };
    }

    return {
      hasLeak: false,
      leakSeverity: 'low',
      description: 'No significant memory leak detected',
    };
  }

  /**
   * Format bytes to human readable format
   */
  private formatBytes(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Stop memory monitoring
   */
  stopMonitoring(): void {
    if (this.gcInterval) {
      clearInterval(this.gcInterval);
      this.gcInterval = null;
    }
  }

  /**
   * Clear memory history
   */
  clearHistory(): void {
    this.memoryHistory = [];
    this.logger.log('Memory history cleared');
  }
}
