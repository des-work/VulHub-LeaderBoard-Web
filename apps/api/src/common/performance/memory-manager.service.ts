import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MemoryManagerService {
  private readonly logger = new Logger(MemoryManagerService.name);
  private memoryHistory: any[] = [];
  private memoryThreshold: number = 0.8; // 80%

  constructor() {
    this.initializeMemoryTracking();
  }

  private initializeMemoryTracking(): void {
    // Initialize with some sample data
    this.memoryHistory = [
      { timestamp: new Date(Date.now() - 300000).toISOString(), usage: 0.65 },
      { timestamp: new Date(Date.now() - 240000).toISOString(), usage: 0.68 },
      { timestamp: new Date(Date.now() - 180000).toISOString(), usage: 0.72 },
      { timestamp: new Date(Date.now() - 120000).toISOString(), usage: 0.75 },
      { timestamp: new Date(Date.now() - 60000).toISOString(), usage: 0.78 },
    ];
  }

  getMemoryStats(): any {
    const memoryUsage = process.memoryUsage();
    const usagePercentage = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
    
    return {
      heapUsed: memoryUsage.heapUsed,
      heapTotal: memoryUsage.heapTotal,
      external: memoryUsage.external,
      rss: memoryUsage.rss,
      usagePercentage: Math.round(usagePercentage * 100) / 100,
      threshold: this.memoryThreshold,
      timestamp: new Date().toISOString(),
    };
  }

  getMemoryHistory(): any[] {
    return this.memoryHistory;
  }

  detectMemoryLeaks(): any {
    // Simple memory leak detection based on trend
    if (this.memoryHistory.length < 5) {
      return {
        hasLeak: false,
        description: 'Insufficient data for leak detection',
      };
    }

    const recent = this.memoryHistory.slice(-5);
    const trend = recent.map((item, index) => ({
      time: index,
      usage: item.usage,
    }));

    // Check if memory usage is consistently increasing
    const isIncreasing = trend.every((item, index) => 
      index === 0 || item.usage > trend[index - 1].usage
    );

    if (isIncreasing && recent[recent.length - 1].usage > this.memoryThreshold) {
      return {
        hasLeak: true,
        description: 'Memory usage is consistently increasing and above threshold',
        trend: recent,
      };
    }

    return {
      hasLeak: false,
      description: 'No memory leak detected',
    };
  }

  forceGarbageCollection(): void {
    if (global.gc) {
      global.gc();
      this.logger.log('Garbage collection triggered');
    } else {
      this.logger.warn('Garbage collection not available');
    }
  }

  setMemoryThreshold(threshold: number): void {
    if (threshold < 0.1 || threshold > 1.0) {
      throw new Error('Memory threshold must be between 0.1 and 1.0');
    }
    this.memoryThreshold = threshold;
    this.logger.log(`Memory threshold set to ${threshold}`);
  }

  clearHistory(): void {
    this.memoryHistory = [];
    this.logger.log('Memory history cleared');
  }
}
