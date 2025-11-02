/**
 * Performance Optimization Utilities
 * 
 * Provides frame rate management, performance monitoring, and optimization helpers
 */

// ============================================================================
// Frame Rate Manager
// ============================================================================

export interface FrameRateConfig {
  targetFPS: number;
  adaptive: boolean;
  maxDropFrames: number;
  qualityLevels: {
    high: number;   // 60 FPS
    medium: number; // 45 FPS
    low: number;    // 30 FPS
  };
}

export class FrameRateManager {
  private targetFPS: number;
  private frameInterval: number;
  private lastFrameTime: number = 0;
  private frameCount: number = 0;
  private fpsUpdateTime: number = 0;
  private currentFPS: number = 60;
  private droppedFrames: number = 0;
  private maxDropFrames: number;
  private adaptive: boolean;
  private qualityLevel: 'high' | 'medium' | 'low' = 'high';
  private qualityLevels: FrameRateConfig['qualityLevels'];

  constructor(config: Partial<FrameRateConfig> = {}) {
    this.qualityLevels = config.qualityLevels || {
      high: 60,
      medium: 45,
      low: 30
    };
    this.targetFPS = config.targetFPS || this.qualityLevels.high;
    this.frameInterval = 1000 / this.targetFPS;
    this.adaptive = config.adaptive ?? true;
    this.maxDropFrames = config.maxDropFrames || 10;
  }

  /**
   * Check if a frame should be rendered based on target frame rate
   */
  shouldRender(currentTime: number): boolean {
    if (currentTime - this.lastFrameTime >= this.frameInterval) {
      const deltaTime = currentTime - this.lastFrameTime;
      this.lastFrameTime = currentTime;

      // Update FPS calculation
      this.updateFPS(currentTime);

      // Adaptive quality adjustment
      if (this.adaptive) {
        this.adjustQuality();
      }

      return true;
    }

    // Frame dropped
    this.droppedFrames++;
    return false;
  }

  /**
   * Update current FPS calculation
   */
  private updateFPS(currentTime: number): void {
    this.frameCount++;

    if (currentTime - this.fpsUpdateTime >= 1000) {
      this.currentFPS = this.frameCount;
      this.frameCount = 0;
      this.fpsUpdateTime = currentTime;

      // Reset dropped frames counter
      if (this.droppedFrames > 0) {
        this.droppedFrames = 0;
      }
    }
  }

  /**
   * Adjust quality level based on performance
   */
  private adjustQuality(): void {
    // Lower quality if FPS is consistently below target
    if (this.currentFPS < this.targetFPS * 0.8 && this.qualityLevel !== 'low') {
      if (this.qualityLevel === 'high') {
        this.setQuality('medium');
      } else if (this.qualityLevel === 'medium') {
        this.setQuality('low');
      }
    }
    // Raise quality if FPS is stable and above threshold
    else if (this.currentFPS >= this.targetFPS * 1.1 && this.qualityLevel !== 'high') {
      if (this.qualityLevel === 'low') {
        this.setQuality('medium');
      } else if (this.qualityLevel === 'medium') {
        this.setQuality('high');
      }
    }
  }

  /**
   * Set quality level explicitly
   */
  setQuality(level: 'high' | 'medium' | 'low'): void {
    if (this.qualityLevel === level) {return;}

    this.qualityLevel = level;
    this.targetFPS = this.qualityLevels[level];
    this.frameInterval = 1000 / this.targetFPS;

    // Dispatch event for quality change
    window.dispatchEvent(new CustomEvent('animation:quality-change', {
      detail: { level, fps: this.targetFPS }
    }));
  }

  /**
   * Get current FPS
   */
  getFPS(): number {
    return this.currentFPS;
  }

  /**
   * Get current quality level
   */
  getQuality(): 'high' | 'medium' | 'low' {
    return this.qualityLevel;
  }

  /**
   * Reset frame rate manager
   */
  reset(): void {
    this.lastFrameTime = 0;
    this.frameCount = 0;
    this.fpsUpdateTime = 0;
    this.currentFPS = 60;
    this.droppedFrames = 0;
    this.qualityLevel = 'high';
    this.targetFPS = this.qualityLevels.high;
    this.frameInterval = 1000 / this.targetFPS;
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    return {
      currentFPS: this.currentFPS,
      targetFPS: this.targetFPS,
      qualityLevel: this.qualityLevel,
      droppedFrames: this.droppedFrames,
      frameInterval: this.frameInterval
    };
  }
}

// ============================================================================
// Performance Monitor
// ============================================================================

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage?: number;
  entityCount: number;
  renderTime: number;
  updateTime: number;
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private maxHistory: number = 60; // Keep last 60 frames
  private marks: Map<string, number> = new Map();

  /**
   * Mark start of an operation
   */
  mark(name: string): void {
    if (performance && performance.now) {
      this.marks.set(name, performance.now());
    }
  }

  /**
   * Measure time since mark
   */
  measure(name: string): number | null {
    const startTime = this.marks.get(name);
    if (!startTime || !performance || !performance.now) {
      return null;
    }

    const duration = performance.now() - startTime;
    this.marks.delete(name);
    return duration;
  }

  /**
   * Record frame metrics
   */
  recordFrame(metrics: Partial<PerformanceMetrics>): void {
    const frameMetrics: PerformanceMetrics = {
      fps: metrics.fps ?? 60,
      frameTime: metrics.frameTime ?? 16.67,
      memoryUsage: metrics.memoryUsage,
      entityCount: metrics.entityCount ?? 0,
      renderTime: metrics.renderTime ?? 0,
      updateTime: metrics.updateTime ?? 0
    };

    this.metrics.push(frameMetrics);

    // Keep only recent history
    if (this.metrics.length > this.maxHistory) {
      this.metrics.shift();
    }
  }

  /**
   * Get average metrics
   */
  getAverageMetrics(): Partial<PerformanceMetrics> {
    if (this.metrics.length === 0) {
      return {};
    }

    const sums = this.metrics.reduce((acc, m) => ({
      fps: acc.fps + m.fps,
      frameTime: acc.frameTime + m.frameTime,
      memoryUsage: acc.memoryUsage! + (m.memoryUsage || 0),
      entityCount: acc.entityCount + m.entityCount,
      renderTime: acc.renderTime + m.renderTime,
      updateTime: acc.updateTime + m.updateTime
    }), {
      fps: 0,
      frameTime: 0,
      memoryUsage: 0,
      entityCount: 0,
      renderTime: 0,
      updateTime: 0
    });

    const count = this.metrics.length;
    return {
      fps: Math.round(sums.fps / count),
      frameTime: sums.frameTime / count,
      memoryUsage: sums.memoryUsage / count,
      entityCount: Math.round(sums.entityCount / count),
      renderTime: sums.renderTime / count,
      updateTime: sums.updateTime / count
    };
  }

  /**
   * Check if performance is degrading
   */
  isDegrading(): boolean {
    if (this.metrics.length < 10) {return false;}

    const recent = this.metrics.slice(-10);
    const avgFPS = recent.reduce((sum, m) => sum + m.fps, 0) / recent.length;

    return avgFPS < 30; // Degrading if below 30 FPS
  }

  /**
   * Get current metrics
   */
  getCurrentMetrics(): PerformanceMetrics | null {
    return this.metrics[this.metrics.length - 1] || null;
  }

  /**
   * Clear metrics history
   */
  clear(): void {
    this.metrics = [];
    this.marks.clear();
  }
}

// ============================================================================
// Memory Utilities
// ============================================================================

/**
 * Get current memory usage (Chrome only)
 */
export function getMemoryUsage(): number | null {
  if (performance && (performance as any).memory) {
    return (performance as any).memory.usedJSHeapSize / 1048576; // Convert to MB
  }
  return null;
}

/**
 * Check if memory pressure is high
 */
export function isMemoryPressureHigh(thresholdMB: number = 100): boolean {
  const usage = getMemoryUsage();
  return usage !== null && usage > thresholdMB;
}

/**
 * Force garbage collection (if available)
 */
export function forceGarbageCollection(): void {
  // Chrome DevTools Protocol
  if ((window as any).gc) {
    (window as any).gc();
  }
}

// ============================================================================
// Singleton Instances
// ============================================================================

export const frameRateManager = new FrameRateManager({
  targetFPS: 60,
  adaptive: true,
  maxDropFrames: 10,
  qualityLevels: {
    high: 60,
    medium: 45,
    low: 30
  }
});

export const performanceMonitor = new PerformanceMonitor();

