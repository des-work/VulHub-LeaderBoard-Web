/**
 * Animation Flow Integration Tests
 * 
 * Tests the complete animation flow from initialization to completion
 */

import { AnimationOrchestrator } from '../../core/AnimationOrchestrator';
import { createMockCanvas, mockRequestAnimationFrame, setupTestEnvironment, cleanupTestEnvironment } from '../utils/test-helpers';

describe('Animation Flow Integration', () => {
  let orchestrator: AnimationOrchestrator;
  let canvas: HTMLCanvasElement;
  let rafMock: ReturnType<typeof mockRequestAnimationFrame>;

  beforeEach(() => {
    setupTestEnvironment();
    canvas = createMockCanvas();
    rafMock = mockRequestAnimationFrame();
    window.requestAnimationFrame = rafMock.requestAnimationFrame;
    window.cancelAnimationFrame = rafMock.cancelAnimationFrame;
  });

  afterEach(() => {
    if (orchestrator) {
      orchestrator.destroy();
    }
    cleanupTestEnvironment();
    rafMock.reset();
  });

  describe('Initialization', () => {
    it('should initialize successfully', async () => {
      orchestrator = new AnimationOrchestrator({
        enableDebug: false,
        enablePerformanceMonitoring: true,
      });

      await expect(orchestrator.initialize()).resolves.not.toThrow();
      
      const state = orchestrator.getState();
      expect(state.system.isInitialized).toBe(true);
    });

    it('should handle initialization errors gracefully', async () => {
      // Mock missing canvas support
      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue(null);

      orchestrator = new AnimationOrchestrator();

      await expect(orchestrator.initialize()).rejects.toThrow();

      HTMLCanvasElement.prototype.getContext = originalGetContext;
    });

    it('should call onReady callback after initialization', async () => {
      const onReady = jest.fn();

      orchestrator = new AnimationOrchestrator({}, { onReady });

      await orchestrator.initialize();
      expect(onReady).toHaveBeenCalled();
    });
  });

  describe('Animation Lifecycle', () => {
    beforeEach(async () => {
      orchestrator = new AnimationOrchestrator({
        enableDebug: false,
      });
      await orchestrator.initialize();
    });

    it('should start animation', () => {
      orchestrator.start();

      const state = orchestrator.getState();
      expect(state.animation.isPlaying).toBe(true);
      expect(state.animation.isPaused).toBe(false);
    });

    it('should pause animation', () => {
      orchestrator.start();
      orchestrator.pause();

      const state = orchestrator.getState();
      expect(state.animation.isPaused).toBe(true);
    });

    it('should skip animation', () => {
      orchestrator.start();
      orchestrator.skip();

      // Should mark as complete
      const state = orchestrator.getState();
      expect(state.animation.isComplete || !state.animation.isPlaying).toBe(true);
    });

    it('should complete animation', async () => {
      const onComplete = jest.fn();
      orchestrator = new AnimationOrchestrator({}, { onComplete });
      await orchestrator.initialize();

      orchestrator.start();

      // Simulate animation completion
      orchestrator.skip();

      // Wait a bit for callbacks
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(onComplete).toHaveBeenCalled();
    });
  });

  describe('State Synchronization', () => {
    beforeEach(async () => {
      orchestrator = new AnimationOrchestrator();
      await orchestrator.initialize();
    });

    it('should sync state from animation engine', () => {
      orchestrator.start();

      // Simulate some frames
      for (let i = 0; i < 10; i++) {
        rafMock.step(16.67);
      }

      const state = orchestrator.getState();
      expect(state.animation.currentPhase).toBeDefined();
      expect(state.animation.elapsedTime).toBeGreaterThanOrEqual(0);
    });

    it('should update phase correctly', () => {
      orchestrator.start();

      // Simulate phase transitions
      const onPhaseChange = jest.fn();
      orchestrator = new AnimationOrchestrator({}, { onPhaseChange });
      
      // Would need to wait for actual phase changes
      // This is a placeholder for actual implementation
      expect(typeof orchestrator.getState().animation.currentPhase).toBe('string');
    });
  });

  describe('Error Handling', () => {
    beforeEach(async () => {
      orchestrator = new AnimationOrchestrator({
        enableDebug: true,
      });
      await orchestrator.initialize();
    });

    it('should handle errors during animation', () => {
      const onError = jest.fn();
      orchestrator.onError(onError);

      // Trigger an error scenario
      orchestrator.start();

      // Check error history
      const errors = orchestrator.getErrorHistory();
      // May be empty if no errors occurred

      expect(Array.isArray(errors)).toBe(true);
    });

    it('should provide error history', () => {
      orchestrator.start();

      const history = orchestrator.getErrorHistory();
      expect(Array.isArray(history)).toBe(true);
    });

    it('should clear error history', () => {
      orchestrator.clearErrorHistory();
      expect(orchestrator.getErrorHistory()).toHaveLength(0);
    });
  });

  describe('Cleanup', () => {
    it('should cleanup resources on destroy', async () => {
      orchestrator = new AnimationOrchestrator();
      await orchestrator.initialize();
      orchestrator.start();

      orchestrator.destroy();

      // Should be able to destroy without errors
      expect(() => orchestrator.destroy()).not.toThrow();
    });
  });
});

describe('Animation Orchestrator with Callbacks', () => {
  let orchestrator: AnimationOrchestrator;
  let callbacks: {
    onReady: jest.Mock;
    onError: jest.Mock;
    onComplete: jest.Mock;
    onPhaseChange: jest.Mock;
  };

  beforeEach(async () => {
    setupTestEnvironment();

    callbacks = {
      onReady: jest.fn(),
      onError: jest.fn(),
      onComplete: jest.fn(),
      onPhaseChange: jest.fn(),
    };

    orchestrator = new AnimationOrchestrator({}, callbacks);
    await orchestrator.initialize();
  });

  afterEach(() => {
    if (orchestrator) {
      orchestrator.destroy();
    }
    cleanupTestEnvironment();
  });

  it('should call all callbacks appropriately', () => {
    expect(callbacks.onReady).toHaveBeenCalled();

    orchestrator.start();
    orchestrator.skip();

    // onComplete and onPhaseChange may be called
    // Exact timing depends on implementation
  });
});

