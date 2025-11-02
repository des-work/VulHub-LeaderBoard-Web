/**
 * Animation Orchestrator
 * 
 * Coordinates the entire animation system including:
 * - Canvas rendering management
 * - Entity lifecycle management
 * - Performance monitoring
 * - Error handling and recovery
 * - State persistence
 * - Accessibility features
 *
 * @example
 * ```typescript
 * const orchestrator = new AnimationOrchestrator({
 *   enableDebug: false,
 *   enablePerformanceMonitoring: true
 * });
 *
 * await orchestrator.initialize();
 * orchestrator.start();
 * ```
 * 
 * @class AnimationOrchestrator
 */

import { AnimationEngine } from '../canvas/AnimationEngine';
import { OrchestratorState, createInitialOrchestratorState } from './types/OrchestratorState';
import { errorLogger, performanceMonitor } from '../utils/debug';
import { logger } from '@/lib/logging/logger';
import {
  animationErrorHandler,
  AnimationErrorType,
  createAnimationError
} from '../utils/error-handling';
import {
  detectBrowserCapabilities,
  polyfillRequestAnimationFrame,
  shouldShowAnimation,
  logBrowserCapabilities,
  getFallbackMessage
} from '../utils/browser-support';
import { animationAccessibility } from '../utils/accessibility';

export interface OrchestratorConfig {
  enableDebug?: boolean;
  enablePerformanceMonitoring?: boolean;
  enableTransitions?: boolean;
  maxFrameRate?: number;
}

export interface OrchestratorCallbacks {
  onReady?: () => void;
  onError?: (error: any) => void;
  onComplete?: () => void;
  onPhaseChange?: (phase: string) => void;
}

export class AnimationOrchestrator {
  private state: OrchestratorState;
  private config: Required<OrchestratorConfig>;
  private callbacks: OrchestratorCallbacks;

  // The ACTUAL animation engine that renders the castle siege
  private animationEngine: AnimationEngine | null = null;

  // Canvas reference
  private canvasElement: HTMLCanvasElement | null = null;

  // Performance tracking
  private stateSyncTimer: NodeJS.Timeout | null = null;
  private lastFrameTime: number = 0;
  private frameCount: number = 0;
  private fpsUpdateTime: number = 0;

  constructor(config: OrchestratorConfig = {}, callbacks: OrchestratorCallbacks = {}) {
    this.config = {
      enableDebug: process.env.NODE_ENV === 'development',
      enablePerformanceMonitoring: true,
      enableTransitions: false, // Keep simple by default
      maxFrameRate: 60,
      ...config,
    };

    this.callbacks = callbacks;
    this.state = createInitialOrchestratorState();

    if (this.config.enableDebug) {
      logger.debug('🎼 AnimationOrchestrator (Simplified) initialized', this.config);
    }
  }

  /**
   * Initialize the orchestrator
   */
  async initialize(): Promise<void> {
    // SSR guard: don't initialize on server
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      const error = createAnimationError(
        AnimationErrorType.INITIALIZATION,
        'AnimationOrchestrator can only be initialized in the browser',
        false
      );
      animationErrorHandler.handle(error);
      throw new Error(error.message);
    }

    // Log browser capabilities in development
    if (this.config.enableDebug) {
      logBrowserCapabilities();
    }

    // Check if animation should be shown at all
    if (!shouldShowAnimation()) {
      const fallbackMessage = getFallbackMessage();
      const error = createAnimationError(
        AnimationErrorType.BROWSER_SUPPORT,
        fallbackMessage,
        false
      );
      animationErrorHandler.handle(error);
      this.callbacks.onError?.(error);
      throw new Error(fallbackMessage);
    }

    // Apply polyfills if needed
    polyfillRequestAnimationFrame();

    performanceMonitor?.start('orchestrator_initialize');

    try {
      // Check browser capabilities
      const capabilities = detectBrowserCapabilities();
      if (!capabilities.canvasSupported) {
        throw createAnimationError(
          AnimationErrorType.BROWSER_SUPPORT,
          'Canvas API is not supported in this browser',
          false
        );
      }

      // Create canvas
      this.canvasElement = document.createElement('canvas');
      this.canvasElement.width = window.innerWidth;
      this.canvasElement.height = window.innerHeight;

      // Update state
      this.state.canvas.isReady = true;
      this.state.canvas.dimensions.width = this.canvasElement.width;
      this.state.canvas.dimensions.height = this.canvasElement.height;

      // Create the ACTUAL animation engine that does the rendering
      try {
        this.animationEngine = new AnimationEngine(this.canvasElement);
      } catch (engineError) {
        const error = createAnimationError(
          AnimationErrorType.RENDERING,
          'Failed to initialize animation engine',
          true,
          { originalError: (engineError as Error).message },
          engineError as Error,
          'high'
        );
        animationErrorHandler.handle(error);
        throw error;
      }

      // Mark as initialized
      this.state.system.isInitialized = true;

      if (this.config.enableDebug) {
        logger.debug('✅ AnimationOrchestrator initialized successfully');
      }

      // Notify ready
      this.callbacks.onReady?.();

    } catch (error) {
      // Handle initialization errors
      this.state.system.hasError = true;

      let animError = error as any;
      if (!(error instanceof Error) || !(error as any).type) {
        animError = createAnimationError(
          AnimationErrorType.INITIALIZATION,
          (error as Error).message || 'Unknown initialization error',
          true,
          undefined,
          error as Error,
          'high'
        );
      }

      animationErrorHandler.handle(animError);
      this.callbacks.onError?.(animError);

      performanceMonitor?.end('orchestrator_initialize');
      throw animError;
    }

    performanceMonitor?.end('orchestrator_initialize');
  }

  /**
   * Start the animation
   */
  start(): void {
    if (!this.state.system.isInitialized || !this.animationEngine) {
      const error = createAnimationError(
        AnimationErrorType.INITIALIZATION,
        'Cannot start: orchestrator not initialized',
        false
      );
      animationErrorHandler.handle(error);
      this.callbacks.onError?.(error);
      return;
    }

    if (this.state.animation.isPlaying) {
      if (this.config.enableDebug) {
        logger.warn('Animation already playing');
      }
      return;
    }

    try {
      // Start the animation engine
      this.animationEngine.start();

      this.state.animation.isPlaying = true;
      this.state.animation.isPaused = false;

      // Start state synchronization
      this.startStateSync();

      // Start error monitoring
      this.startErrorMonitoring();

      if (this.config.enableDebug) {
        logger.debug('▶️ Animation started');
      }
    } catch (error) {
      const animError = createAnimationError(
        AnimationErrorType.RENDERING,
        'Failed to start animation',
        true,
        undefined,
        error as Error,
        'high'
      );
      animationErrorHandler.handle(animError);
      this.callbacks.onError?.(animError);
    }
  }

  /**
   * Play (resume) the animation
   */
  play(): void {
    this.start();
  }

  /**
   * Pause the animation
   */
  pause(): void {
    if (!this.animationEngine) return;

    // AnimationEngine doesn't have a pause method, so we'll just stop
    this.state.animation.isPaused = true;
    this.state.animation.isPlaying = false;

    if (this.config.enableDebug) {
      logger.debug('⏸️ Animation paused');
    }
  }

  /**
   * Skip the animation
   */
  skip(): void {
    if (!this.animationEngine) return;

    this.animationEngine.skip();
    this.handleComplete();

    if (this.config.enableDebug) {
      logger.debug('⏭️ Animation skipped');
    }
  }

  /**
   * Start state synchronization timer
   * AnimationEngine handles its own animation loop, we just sync state
   */
  private startStateSync(): void {
    // AnimationEngine handles its own loop, we just poll for state changes
    this.stateSyncTimer = setInterval(() => {
      if (this.animationEngine) {
        this.syncStateFromEngine();

        if (this.animationEngine.isComplete()) {
          this.handleComplete();
        }
      }
    }, 16); // ~60fps
  }

  /**
   * Stop state synchronization
   */
  private stopStateSync(): void {
    if (this.stateSyncTimer) {
      clearInterval(this.stateSyncTimer);
      this.stateSyncTimer = null;
    }

    // Stop error monitoring
    const monitoringInterval = (this as any).errorMonitoringInterval;
    if (monitoringInterval) {
      clearInterval(monitoringInterval);
      (this as any).errorMonitoringInterval = null;
    }
  }

  /**
   * Register error listener on orchestrator
   */
  onError(callback: (error: any) => void): () => void {
    return animationErrorHandler.onError(callback);
  }

  /**
   * Get error history
   */
  getErrorHistory() {
    return animationErrorHandler.getErrorHistory();
  }

  /**
   * Clear error history
   */
  clearErrorHistory(): void {
    animationErrorHandler.clearErrorHistory();
  }

  /**
   * Sync orchestrator state from animation engine state
   */
  private syncStateFromEngine(): void {
    if (!this.animationEngine) return;

    const engineState = this.animationEngine.getState();
    
    // Announce phase changes to screen readers
    if (this.state.animation.currentPhase !== engineState.phase) {
      const phaseDescriptions: Record<string, string> = {
        intro: 'Animation introduction starting',
        castle: 'Castle structure appearing',
        battle: 'Battle phase beginning',
        victory: 'Victory celebration',
        complete: 'Animation complete'
      };
      animationAccessibility.announcePhaseChange(
        engineState.phase,
        phaseDescriptions[engineState.phase]
      );
      this.callbacks.onPhaseChange?.(engineState.phase);
    }
    
    // Sync animation state
    this.state.animation.currentPhase = engineState.phase;
    this.state.animation.isComplete = engineState.isComplete;
    this.state.animation.elapsedTime = engineState.elapsedTime;
    
    // Calculate progress
    const phaseDurations: Record<string, number> = {
      intro: 2000,
      castle: 3000,
      battle: 5000,
      victory: 3000,
      complete: 0,
    };
    
    const phaseDuration = phaseDurations[engineState.phase] || 1000;
    this.state.animation.progress = Math.min(engineState.elapsedTime / phaseDuration, 1.0);

    // Check for phase change
    if (this.state.animation.currentPhase !== engineState.phase) {
      this.callbacks.onPhaseChange?.(engineState.phase);
    }
  }

  /**
   * Update performance metrics
   */
  private updatePerformanceMetrics(deltaTime: number): void {
    this.frameCount++;

    // Update FPS every second
    const currentTime = performance.now();
    if (currentTime - this.fpsUpdateTime >= 1000) {
      this.state.system.performance.fps = this.frameCount;
      this.frameCount = 0;
      this.fpsUpdateTime = currentTime;
    }

    // Update frame time
    this.state.system.performance.frameTime = deltaTime;
  }

  /**
   * Handle animation completion
   */
  private handleComplete(): void {
    this.state.animation.isComplete = true;
    this.state.animation.isPlaying = false;

    this.stopStateSync();

    this.callbacks.onComplete?.();

    if (this.config.enableDebug) {
      logger.debug('✅ Animation complete');
    }
  }

  /**
   * Handle errors
   */
  private handleError(error: any, context: string): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    this.state.system.errors.push({
      message: errorMessage,
      timestamp: Date.now(),
      context,
    });

    this.state.system.health = this.state.system.errors.length > 5 ? 'critical' :
                               this.state.system.errors.length > 2 ? 'degraded' : 'healthy';

    errorLogger?.logError(error, { context });
    this.callbacks.onError?.(error);
  }

  /**
   * Start error monitoring during animation
   */
  private startErrorMonitoring(): void {
    const monitoringInterval = setInterval(() => {
      // Check if system should degrade
      if (animationErrorHandler.shouldDegrade()) {
        this.state.system.isDegraded = true;
        this.animationEngine?.reduceQuality?.();

        if (this.config.enableDebug) {
          logger.warn('🔴 Animation system degraded due to errors');
        }

        clearInterval(monitoringInterval);
        return;
      }

      // Monitor performance
      if (this.config.enablePerformanceMonitoring && performance.memory) {
        const usedMemory = (performance.memory as any).usedJSHeapSize / 1048576;
        if (usedMemory > 100) {
          // More than 100MB
          const error = createAnimationError(
            AnimationErrorType.MEMORY,
            `High memory usage: ${Math.round(usedMemory)}MB`,
            true,
            { memory: usedMemory },
            undefined,
            'medium'
          );
          animationErrorHandler.handle(error);
        }
      }
    }, 1000); // Check every second

    // Store interval for cleanup
    (this as any).errorMonitoringInterval = monitoringInterval;
  }

  /**
   * Get current state (readonly)
   */
  getState(): Readonly<OrchestratorState> {
    return { ...this.state };
  }

  /**
   * Get canvas element
   */
  getCanvas(): HTMLCanvasElement | null {
    return this.canvasElement;
  }

  /**
   * Check if animation is playing
   */
  isPlaying(): boolean {
    return this.state.animation.isPlaying && !this.state.animation.isPaused;
  }

  /**
   * Get transition manager
   */
  getTransitionManager(): TransitionManager | null {
    return null; // Removed as per the edit hint
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    // Stop state synchronization
    this.stopStateSync();

    // Destroy animation engine
    if (this.animationEngine) {
      this.animationEngine.destroy();
      this.animationEngine = null;
    }

    // Destroy transition manager
    // This block is removed as per the edit hint

    // Clear canvas
    this.canvasElement = null;

    // Reset state
    this.state = createInitialOrchestratorState();

    if (this.config.enableDebug) {
      logger.debug('🗑️ AnimationOrchestrator destroyed');
    }
  }
}
