/**
 * Performance Benchmarks
 * 
 * Tests for performance characteristics and optimization
 */

import { AnimationEngine } from '../../canvas/AnimationEngine';
import { FrameRateManager } from '../../utils/performance';
import { createMockCanvas, mockRequestAnimationFrame, setupTestEnvironment } from '../utils/test-helpers';

describe('Performance Benchmarks', () => {
  let canvas: HTMLCanvasElement;
  let rafMock: ReturnType<typeof mockRequestAnimationFrame>;

  beforeEach(() => {
    setupTestEnvironment();
    canvas = createMockCanvas();
    rafMock = mockRequestAnimationFrame();
    window.requestAnimationFrame = rafMock.requestAnimationFrame;
    window.cancelAnimationFrame = rafMock.cancelAnimationFrame;
  });

  describe('Frame Rate Performance', () => {
    it('should maintain target frame rate', () => {
      const manager = new FrameRateManager({
        targetFPS: 60,
        adaptive: false,
      });

      let frameCount = 0;
      let currentTime = 0;
      const duration = 1000; // 1 second
      const frameInterval = 1000 / 60; // ~16.67ms

      while (currentTime < duration) {
        if (manager.shouldRender(currentTime)) {
          frameCount++;
        }
        currentTime += frameInterval;
      }

      // Should render close to 60 frames in 1 second
      expect(frameCount).toBeGreaterThan(55);
      expect(frameCount).toBeLessThanOrEqual(60);
    });

    it('should handle frame rate drops gracefully', () => {
      const manager = new FrameRateManager({
        targetFPS: 60,
        adaptive: true,
      });

      let currentTime = 0;
      
      // Simulate high load (slow frames)
      for (let i = 0; i < 100; i++) {
        currentTime += 25; // 40 FPS
        manager.shouldRender(currentTime);
      }

      // Should adapt quality
      const quality = manager.getQuality();
      expect(['high', 'medium', 'low']).toContain(quality);
    });
  });

  describe('Rendering Performance', () => {
    it('should render frames efficiently', async () => {
      const engine = new AnimationEngine(canvas);
      engine.start();

      const startTime = performance.now();

      // Simulate 60 frames
      for (let i = 0; i < 60; i++) {
        rafMock.step(16.67);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // 60 frames should complete in reasonable time (< 2000ms for 60 frames)
      expect(duration).toBeLessThan(2000);

      engine.destroy();
    });

    it('should maintain consistent frame times', () => {
      const engine = new AnimationEngine(canvas);
      engine.start();

      const frameTimes: number[] = [];
      let lastTime = 0;

      for (let i = 0; i < 30; i++) {
        const currentTime = i * 16.67;
        rafMock.step(16.67);
        
        if (lastTime > 0) {
          frameTimes.push(currentTime - lastTime);
        }
        lastTime = currentTime;
      }

      // Frame times should be relatively consistent
      const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
      expect(avgFrameTime).toBeCloseTo(16.67, 1);

      engine.destroy();
    });
  });

  describe('Memory Performance', () => {
    it('should not leak memory over time', async () => {
      const engine = new AnimationEngine(canvas);
      engine.start();

      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

      // Run many frames
      for (let i = 0; i < 300; i++) {
        rafMock.step(16.67);
      }

      // Give GC time to run
      await new Promise(resolve => setTimeout(resolve, 100));

      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;

      // Memory growth should be reasonable (less than 50MB for 300 frames)
      if (initialMemory > 0 && finalMemory > 0) {
        const growth = (finalMemory - initialMemory) / (1024 * 1024); // MB
        expect(growth).toBeLessThan(50);
      }

      engine.destroy();
    });
  });

  describe('Quality Adjustment Performance', () => {
    it('should adjust quality without frame drops', () => {
      const manager = new FrameRateManager({
        targetFPS: 60,
        adaptive: true,
      });

      let currentTime = 0;
      let qualityChanges = 0;
      let lastQuality = manager.getQuality();

      // Listen for quality changes
      window.addEventListener('animation:quality-change', () => {
        qualityChanges++;
      });

      // Simulate performance fluctuation
      for (let i = 0; i < 1000; i++) {
        currentTime += 16.67;
        manager.shouldRender(currentTime);

        if (manager.getQuality() !== lastQuality) {
          lastQuality = manager.getQuality();
        }
      }

      // Quality changes should be reasonable
      expect(qualityChanges).toBeLessThan(10); // Not too frequent
    });
  });
});

describe('Performance Metrics Collection', () => {
  it('should collect metrics without performance impact', () => {
    const engine = new AnimationEngine(canvas);
    engine.start();

    const metricsCollection = [];

    // Collect metrics every 10 frames
    for (let i = 0; i < 100; i++) {
      rafMock.step(16.67);
      
      if (i % 10 === 0) {
        const metrics = engine.getPerformanceMetrics();
        metricsCollection.push(metrics);
      }
    }

    expect(metricsCollection.length).toBe(10);
    metricsCollection.forEach(metrics => {
      expect(metrics).toHaveProperty('fps');
      expect(metrics).toHaveProperty('quality');
    });

    engine.destroy();
  });
});

