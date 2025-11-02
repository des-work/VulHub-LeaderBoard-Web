/**
 * Orchestrator Action Types
 *
 * TypeScript interfaces for orchestrator actions and events
 */

import { OrchestratorState } from './OrchestratorState';

export type OrchestratorActionType =
  // Animation actions
  | 'ANIMATION_PLAY'
  | 'ANIMATION_PAUSE'
  | 'ANIMATION_SKIP'
  | 'ANIMATION_COMPLETE'
  | 'ANIMATION_SET_PHASE'
  | 'ANIMATION_UPDATE_PROGRESS'

  // Canvas actions
  | 'CANVAS_INITIALIZE'
  | 'CANVAS_READY'
  | 'CANVAS_ERROR'
  | 'CANVAS_RESIZE'

  // Entity actions
  | 'ENTITY_CREATE'
  | 'ENTITY_DESTROY'
  | 'ENTITY_UPDATE'
  | 'ENTITY_BATCH_UPDATE'

  // System actions
  | 'SYSTEM_INITIALIZE'
  | 'SYSTEM_START'
  | 'SYSTEM_STOP'
  | 'SYSTEM_ERROR'
  | 'SYSTEM_UPDATE_PERFORMANCE'

  // Plugin actions
  | 'PLUGIN_LOAD'
  | 'PLUGIN_UNLOAD'
  | 'PLUGIN_CONFIGURE'
  | 'PLUGIN_ERROR'
  | 'PLUGIN_EXECUTE_HOOK';

export interface BaseAction {
  type: OrchestratorActionType;
  payload?: any;
  timestamp: number;
  source?: string;
}

// Animation Actions
export interface AnimationPlayAction extends BaseAction {
  type: 'ANIMATION_PLAY';
}

export interface AnimationPauseAction extends BaseAction {
  type: 'ANIMATION_PAUSE';
}

export interface AnimationSkipAction extends BaseAction {
  type: 'ANIMATION_SKIP';
}

export interface AnimationCompleteAction extends BaseAction {
  type: 'ANIMATION_COMPLETE';
}

export interface AnimationSetPhaseAction extends BaseAction {
  type: 'ANIMATION_SET_PHASE';
  payload: {
    phase: string;
    transition?: boolean;
  };
}

export interface AnimationUpdateProgressAction extends BaseAction {
  type: 'ANIMATION_UPDATE_PROGRESS';
  payload: {
    progress: number;
    elapsedTime: number;
  };
}

// Canvas Actions
export interface CanvasInitializeAction extends BaseAction {
  type: 'CANVAS_INITIALIZE';
  payload: {
    canvas: HTMLCanvasElement;
  };
}

export interface CanvasReadyAction extends BaseAction {
  type: 'CANVAS_READY';
  payload: {
    context: CanvasRenderingContext2D;
    dimensions: { width: number; height: number };
  };
}

export interface CanvasErrorAction extends BaseAction {
  type: 'CANVAS_ERROR';
  payload: {
    error: string;
  };
}

export interface CanvasResizeAction extends BaseAction {
  type: 'CANVAS_RESIZE';
  payload: {
    dimensions: { width: number; height: number };
  };
}

// Entity Actions
export interface EntityCreateAction extends BaseAction {
  type: 'ENTITY_CREATE';
  payload: {
    entityId: string;
    entityType: string;
    config: any;
  };
}

export interface EntityDestroyAction extends BaseAction {
  type: 'ENTITY_DESTROY';
  payload: {
    entityId: string;
  };
}

export interface EntityUpdateAction extends BaseAction {
  type: 'ENTITY_UPDATE';
  payload: {
    entityId: string;
    updates: any;
  };
}

export interface EntityBatchUpdateAction extends BaseAction {
  type: 'ENTITY_BATCH_UPDATE';
  payload: {
    updates: Array<{ entityId: string; updates: any }>;
  };
}

// System Actions
export interface SystemInitializeAction extends BaseAction {
  type: 'SYSTEM_INITIALIZE';
}

export interface SystemStartAction extends BaseAction {
  type: 'SYSTEM_START';
}

export interface SystemStopAction extends BaseAction {
  type: 'SYSTEM_STOP';
}

export interface SystemErrorAction extends BaseAction {
  type: 'SYSTEM_ERROR';
  payload: {
    error: any;
    context?: any;
  };
}

export interface SystemUpdatePerformanceAction extends BaseAction {
  type: 'SYSTEM_UPDATE_PERFORMANCE';
  payload: {
    fps: number;
    frameTime: number;
    memoryUsage: number;
  };
}

// Plugin Actions
export interface PluginLoadAction extends BaseAction {
  type: 'PLUGIN_LOAD';
  payload: {
    pluginId: string;
    plugin: any;
    config?: any;
  };
}

export interface PluginUnloadAction extends BaseAction {
  type: 'PLUGIN_UNLOAD';
  payload: {
    pluginId: string;
  };
}

export interface PluginConfigureAction extends BaseAction {
  type: 'PLUGIN_CONFIGURE';
  payload: {
    pluginId: string;
    config: any;
  };
}

export interface PluginErrorAction extends BaseAction {
  type: 'PLUGIN_ERROR';
  payload: {
    pluginId: string;
    error: any;
  };
}

export interface PluginExecuteHookAction extends BaseAction {
  type: 'PLUGIN_EXECUTE_HOOK';
  payload: {
    hookName: string;
    args?: any[];
  };
}

// Union type for all actions
export type OrchestratorAction =
  | AnimationPlayAction
  | AnimationPauseAction
  | AnimationSkipAction
  | AnimationCompleteAction
  | AnimationSetPhaseAction
  | AnimationUpdateProgressAction
  | CanvasInitializeAction
  | CanvasReadyAction
  | CanvasErrorAction
  | CanvasResizeAction
  | EntityCreateAction
  | EntityDestroyAction
  | EntityUpdateAction
  | EntityBatchUpdateAction
  | SystemInitializeAction
  | SystemStartAction
  | SystemStopAction
  | SystemErrorAction
  | SystemUpdatePerformanceAction
  | PluginLoadAction
  | PluginUnloadAction
  | PluginConfigureAction
  | PluginErrorAction
  | PluginExecuteHookAction;

// Action creators for easier usage
export const OrchestratorActions = {
  // Animation
  play: (): AnimationPlayAction => ({
    type: 'ANIMATION_PLAY',
    timestamp: Date.now(),
  }),

  pause: (): AnimationPauseAction => ({
    type: 'ANIMATION_PAUSE',
    timestamp: Date.now(),
  }),

  skip: (): AnimationSkipAction => ({
    type: 'ANIMATION_SKIP',
    timestamp: Date.now(),
  }),

  complete: (): AnimationCompleteAction => ({
    type: 'ANIMATION_COMPLETE',
    timestamp: Date.now(),
  }),

  setPhase: (phase: string, transition = false): AnimationSetPhaseAction => ({
    type: 'ANIMATION_SET_PHASE',
    payload: { phase, transition },
    timestamp: Date.now(),
  }),

  updateProgress: (progress: number, elapsedTime: number): AnimationUpdateProgressAction => ({
    type: 'ANIMATION_UPDATE_PROGRESS',
    payload: { progress, elapsedTime },
    timestamp: Date.now(),
  }),

  // Canvas
  canvasInitialize: (canvas: HTMLCanvasElement): CanvasInitializeAction => ({
    type: 'CANVAS_INITIALIZE',
    payload: { canvas },
    timestamp: Date.now(),
  }),

  canvasReady: (context: CanvasRenderingContext2D, dimensions: { width: number; height: number }): CanvasReadyAction => ({
    type: 'CANVAS_READY',
    payload: { context, dimensions },
    timestamp: Date.now(),
  }),

  canvasError: (error: string): CanvasErrorAction => ({
    type: 'CANVAS_ERROR',
    payload: { error },
    timestamp: Date.now(),
  }),

  canvasResize: (dimensions: { width: number; height: number }): CanvasResizeAction => ({
    type: 'CANVAS_RESIZE',
    payload: { dimensions },
    timestamp: Date.now(),
  }),

  // System
  systemInitialize: (): SystemInitializeAction => ({
    type: 'SYSTEM_INITIALIZE',
    timestamp: Date.now(),
  }),

  systemStart: (): SystemStartAction => ({
    type: 'SYSTEM_START',
    timestamp: Date.now(),
  }),

  systemStop: (): SystemStopAction => ({
    type: 'SYSTEM_STOP',
    timestamp: Date.now(),
  }),

  systemError: (error: any, context?: any): SystemErrorAction => ({
    type: 'SYSTEM_ERROR',
    payload: { error, context },
    timestamp: Date.now(),
  }),

  updatePerformance: (fps: number, frameTime: number, memoryUsage: number): SystemUpdatePerformanceAction => ({
    type: 'SYSTEM_UPDATE_PERFORMANCE',
    payload: { fps, frameTime, memoryUsage },
    timestamp: Date.now(),
  }),
};
