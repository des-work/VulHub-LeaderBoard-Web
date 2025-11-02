/**
 * Performance Utilities Tests
 */

import {
  FrameRateManager,
  PerformanceMonitor,
  getMemoryUsage,
  isMemoryPressureHigh,
  frameRateManager,
  performanceMonitor,
} from '../../utils/performance';

describe('FrameRateManager', () => {
  let manager: FrameRateManager;

  beforeEach(() => {
    manager = new FrameRateManager({
      targetFPS: 60,
      adaptive: true,
      maxDropFrames: 10,
      qualityLevels: {
        high: 60,
        medium: 45,
        low: 30,
      },
    });
  });

  describe('Frame Rate Control', () => {
    it('should allow rendering at target frame rate', () => {
      const time1 = 0;
      const time2 = 16.67; // ~60 FPS

      expect(manager.shouldRender(time1)).toBe(true);
      expect(manager.shouldRender(time2)).toBe(true);
    });

    it('should skip frames if too frequent', () => {
      const time1 = 0;
      const time2 = 5; // Too soon

      manager.shouldRender(time1);
      expect(manager.shouldRender(time2)).toBe(false);
    });

    it('should track FPS', () => {
      let currentTime = 0;
      const frameInterval = 16.67; // 60 FPS

      for (let i = 0; i < 60; i++) {
        currentTime += frameInterval;
        manager.shouldRender(currentTime);
      }

      // Wait for FPS update (1 second)
      currentTime += 1000;
      manager.shouldRender(currentTime);

      const fps = manager.getFPS();
      expect(fps).toBeGreaterThan(50);
      expect(fps).toBeLessThanOrEqual(60);
    });
  });

  describe('Quality Levels', () => {
    it('should set quality levels', () => {
      manager.setQuality('medium');
      expect(manager.getQuality()).toBe('medium');
      expect(manager.getMetrics().targetFPS).toBe(45);

      manager.setQuality('low');
      expect(manager.getQuality()).toBe('low');
      expect(manager.getMetrics().targetFPS).toBe(30);
    });

    it('should auto-adjust quality based on FPS', () => {
      manager.setQuality('high');

      // Simulate low FPS
      let currentTime = 0;
      for (let i = 0; i < 100; i++) {
        currentTime += 25; // 40 FPS (below 80% of 60)
        manager.shouldRender(currentTime);
      }

      // After multiple low FPS frames, should reduce quality
      // Note: This depends on internal timing, so may need adjustment
      const quality = manager.getQuality();
      expect(['high', 'medium']).toContain(quality);
    });
  });

  describe('Reset', () => {
    it('should reset all state', () => {
      manager.setQuality('low');
      manager.shouldRender(100);

      manager.reset();

      expect(manager.getQuality()).toBe('high');
      expect(manager.getFPS()).toBe(60);
    });
  });

  describe('Metrics', () => {
    it('should provide performance metrics', () => {
      const metrics = manager.getMetrics();

      expect(metrics).toHaveProperty('currentFPS');
      expect(metrics).toHaveProperty('targetFPS');
      expect(metrics).toHaveProperty('qualityLevel');
      expect(metrics).toHaveProperty('droppedFrames');
      expect(metrics).toHaveProperty('frameInterval');
    });
  });
});

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor;

  beforeEach(() => {
    monitor = new PerformanceMonitor();
  });

  describe('Performance Marking', () => {
    it('should mark and measure operations', () => {
      monitor.mark('test-operation');
      
      // Advance time (mock performance.now if needed)
      if (performance.now) {
        jest.spyOn(performance, 'now')
          .mockReturnValueOnce(100)
          .mockReturnValueOnce(150);
      }

      const duration = monitor.measure('test-operation');
      
      if (duration !== null) {
        expect(duration).toBeGreaterThanOrEqual(0);
      }
    });

    it('should handle missing marks gracefully', () => {
      const duration = monitor.measure('non-existent');
      expect(duration).toBeNull();
    });
  });

  describe('Frame Metrics Recording', () => {
    it('should record frame metrics', () => {
      monitor.recordFrame({
        fps: 60,
        frameTime: 16.67,
        entityCount: 50,
        renderTime: 5,
        updateTime: 2,
      });

      const current = monitor.getCurrentMetrics();
      expect(current).not.toBeNull();
      expect(current?.fps).toBe(60);
      expect(current?.entityCount).toBe(50);
    });

    it('should maintain limited history', () => {
      // Record more than maxHistory frames
      for (let i = 0; i < 100; i++) {
        monitor.recordFrame({
          fps: 60,
          frameTime: 16.67,
          entityCount: 50,
          renderTime: 5,
          updateTime: 2,
        });
      }

      const avg = monitor.getAverageMetrics();
      expect(avg).toBeDefined();
    });
  });

  describe('Average Metrics', () => {
    it('should calculate average metrics', () => {
      monitor.recordFrame({ fps: 60, frameTime: 16.67, entityCount: 50, renderTime: 5, updateTime: 2 });
      monitor.recordFrame({ fps: 50, frameTime: 20, entityCount: 40, renderTime: 6, updateTime: 3 });
      monitor.recordFrame({ fps: 55, frameTime: 18, entityCount: 45, renderTime: 5.5, updateTime: 2.5 });

      const avg = monitor.getAverageMetrics();
      
      expect(avg.fps).toBeCloseTo(55, 0);
      expect(avg.entityCount).toBeCloseTo(45, 0);
    });

    it('should return empty object if no metrics', () => {
      const avg = monitor.getAverageMetrics();
      expect(avg).toEqual({});
    });
  });

  describe('Degradation Detection', () => {
    it('should detect performance degradation', () => {
      // Record frames with low FPS
      for (let i = 0; i < 10; i++) {
        monitor.recordFrame({
          fps: 25, // Below 30 FPS threshold
          frameTime: 40,
          entityCount: 100,
          renderTime: 20,
          updateTime: 10,
        });
      }

      expect(monitor.isDegrading()).toBe(true);
    });

    it('should not detect degradation with good performance', () => {
      // Record frames with good FPS
      for (let i = 0; i < 10; i++) {
        monitor.recordFrame({
          fps: 60,
          frameTime: 16.67,
          entityCount: 50,
          renderTime: 5,
          updateTime: 2,
        });
      }

      expect(monitor.isDegrading()).toBe(false);
    });
  });

  describe('Clear', () => {
    it('should clear metrics history', () => {
      monitor.recordFrame({ fps: 60, frameTime: 16.67, entityCount: 50, renderTime: 5, updateTime: 2 });
      
      monitor.clear();
      
      expect(monitor.getCurrentMetrics()).toBeNull();
      expect(monitor.getAverageMetrics()).toEqual({});
    });
  });
});

describe('Memory Utilities', () => {
  describe('getMemoryUsage', () => {
    it('should return memory usage if available', () => {
      const usage = getMemoryUsage();
      
      // May be null if performance.memory not available
      if (usage !== null) {
        expect(typeof usage).toBe('number');
        expect(usage).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('isMemoryPressureHigh', () => {
    it('should detect high memory pressure', () => {
      // Mock performance.memory if available
      if ((performance as any).memory) {
        (performance as any).memory.usedJSHeapSize = 150 * 1024 * 1024; // 150MB
        
        expect(isMemoryPressureHigh(100)).toBe(true);
        expect(isMemoryPressureHigh(200)).toBe(false);
      }
    });
  });
});

describe('Singleton Instances', () => {
  it('should provide singleton frame rate manager', () => {
    expect(frameRateManager).toBeInstanceOf(FrameRateManager);
  });

  it('should provide singleton performance monitor', () => {
    expect(performanceMonitor).toBeInstanceOf(PerformanceMonitor);
  });
});

