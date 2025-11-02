/**
 * Animation Debug Utilities
 *
 * Provides debugging, monitoring, and performance tracking for the animation system
 */

export interface DebugInfo {
  fps: number;
  frameTime: number;
  memoryUsage?: number;
  entityCount: {
    stars: number;
    projectiles: number;
    explosions: number;
    debris: number;
  };
  phase: string;
  elapsedTime: number;
  isPlaying: boolean;
}

export class AnimationDebugger {
  private frameCount: number = 0;
  private lastTime: number = 0;
  private fps: number = 0;
  private frameTimes: number[] = [];
  private maxFrameHistory: number = 60;

  constructor() {
    this.lastTime = performance.now();
  }

  update(): void {
    const now = performance.now();
    const deltaTime = now - this.lastTime;

    this.frameCount++;
    this.frameTimes.push(deltaTime);

    // Keep only recent frames
    if (this.frameTimes.length > this.maxFrameHistory) {
      this.frameTimes.shift();
    }

    // Calculate FPS every second
    if (this.frameCount % 60 === 0) {
      const avgFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
      this.fps = Math.round(1000 / avgFrameTime);
    }

    this.lastTime = now;
  }

  getDebugInfo(
    entityCounts: DebugInfo['entityCount'],
    phase: string,
    elapsedTime: number,
    isPlaying: boolean
  ): DebugInfo {
    const avgFrameTime = this.frameTimes.length > 0
      ? this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length
      : 16.67;

    return {
      fps: this.fps,
      frameTime: Math.round(avgFrameTime * 100) / 100,
      memoryUsage: this.getMemoryUsage(),
      entityCount: entityCounts,
      phase,
      elapsedTime: Math.round(elapsedTime),
      isPlaying,
    };
  }

  private getMemoryUsage(): number | undefined {
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      return Math.round(memory.usedJSHeapSize / 1024 / 1024); // MB
    }
    return undefined;
  }

  logPerformance(info: DebugInfo): void {
    // Development-only logging - not used in production
    // This method is kept for backward compatibility but is not called from components
  }
}

// Error logger
export class AnimationErrorLogger {
  private errors: Array<{ timestamp: number; error: string; context: any }> = [];

  logError(error: string, context: any = {}): void {
    const errorEntry = {
      timestamp: Date.now(),
      error,
      context,
    };

    this.errors.push(errorEntry);

    // Keep only last 10 errors
    if (this.errors.length > 10) {
      this.errors.shift();
    }

    // Error tracking without console - errors are tracked in array
    // Use logger from app for production error reporting
  }

  getRecentErrors(): typeof this.errors {
    return [...this.errors];
  }

  clearErrors(): void {
    this.errors = [];
  }
}

// Global error logger instance
export const errorLogger = new AnimationErrorLogger();

// Performance monitor
export class PerformanceMonitor {
  private startTime: number = 0;
  private measurements: Map<string, number[]> = new Map();

  start(label: string): void {
    this.startTime = performance.now();
  }

  end(label: string): void {
    const duration = performance.now() - this.startTime;

    if (!this.measurements.has(label)) {
      this.measurements.set(label, []);
    }

    const measurements = this.measurements.get(label)!;
    measurements.push(duration);

    // Keep only last 100 measurements
    if (measurements.length > 100) {
      measurements.shift();
    }

    // Development-only performance tracking - not logged to console in production
  }

  getAverage(label: string): number {
    const measurements = this.measurements.get(label);
    if (!measurements || measurements.length === 0) return 0;

    return measurements.reduce((a, b) => a + b, 0) / measurements.length;
  }

  reset(): void {
    this.measurements.clear();
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();
