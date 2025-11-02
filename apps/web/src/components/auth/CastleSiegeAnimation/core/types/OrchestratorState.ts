/**
 * Orchestrator State Types
 *
 * TypeScript interfaces for the unified animation orchestrator state
 */

export interface AnimationState {
  currentPhase: string;
  elapsedTime: number;
  progress: number;
  isPlaying: boolean;
  isPaused: boolean;
  isComplete: boolean;
  canSkip: boolean;
  startTime?: number;
  endTime?: number;
}

export interface CanvasState {
  canvas: HTMLCanvasElement | null;
  context: CanvasRenderingContext2D | null;
  dimensions: { width: number; height: number };
  isReady: boolean;
  error: string | null;
  devicePixelRatio: number;
}

export interface EntityState {
  activeEntities: Map<string, any>; // Entity ID -> Entity instance
  entityCount: number;
  lastEntityId: number;
  poolStats: {
    created: number;
    recycled: number;
    active: number;
  };
}

export interface SystemState {
  errors: any[]; // Recent error history
  performance: {
    fps: number;
    frameTime: number;
    memoryUsage: number;
    lastUpdate: number;
  };
  health: 'healthy' | 'degraded' | 'critical';
  isInitialized: boolean;
  isRunning: boolean;
}

export interface PluginState {
  loadedPlugins: Map<string, any>; // Plugin ID -> Plugin instance
  activePlugins: Set<string>;
  pluginConfig: Map<string, any>; // Plugin ID -> Config
  pluginHealth: Map<string, 'healthy' | 'error'>;
}

/**
 * Complete orchestrator state
 */
export interface OrchestratorState {
  animation: AnimationState;
  canvas: CanvasState;
  entities: EntityState;
  system: SystemState;
  plugins: PluginState;
}

/**
 * Initial state factory
 */
export function createInitialOrchestratorState(): OrchestratorState {
  return {
    animation: {
      currentPhase: 'intro',
      elapsedTime: 0,
      progress: 0,
      isPlaying: false,
      isComplete: false,
      canSkip: true,
    },
    canvas: {
      canvas: null,
      context: null,
      dimensions: { width: 1920, height: 1080 },
      isReady: false,
      error: null,
      devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
    },
    entities: {
      activeEntities: new Map(),
      entityCount: 0,
      lastEntityId: 0,
      poolStats: {
        created: 0,
        recycled: 0,
        active: 0,
      },
    },
    system: {
      errors: [],
      performance: {
        fps: 60,
        frameTime: 16.67,
        memoryUsage: 0,
        lastUpdate: Date.now(),
      },
      health: 'healthy',
      isInitialized: false,
      isRunning: false,
    },
    plugins: {
      loadedPlugins: new Map(),
      activePlugins: new Set(),
      pluginConfig: new Map(),
      pluginHealth: new Map(),
    },
  };
}
