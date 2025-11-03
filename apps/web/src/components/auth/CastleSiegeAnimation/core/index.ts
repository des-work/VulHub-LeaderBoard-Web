/**
 * Core Animation System Exports
 * 
 * Simplified: Only exports what's actually used
 * Orchestration system disabled for production launch
 */

// DISABLED FOR PRODUCTION - Using simple AnimationEngine instead
// export { AnimationOrchestrator } from './AnimationOrchestrator';
// export type { OrchestratorConfig, OrchestratorCallbacks } from './AnimationOrchestrator';

// DISABLED FOR PRODUCTION
// export { createInitialOrchestratorState } from './types/OrchestratorState';
// export type { OrchestratorState, AnimationState as OrchestratorAnimationState } from './types/OrchestratorState';

// DISABLED FOR PRODUCTION
// export { OrchestratorActions } from './types/OrchestratorActions';
// export type { OrchestratorAction } from './types/OrchestratorActions';

// Transitions (removed - was unused and disabled by default)

// Note: The following are NOT exported as they're not used:
// - RenderQueue, RenderExecutor (Phase 2) - AnimationEngine handles rendering
// - EntityLifecycleManager (Phase 3) - Existing entity classes work fine
// - PluginSystem (Phase 4) - Over-engineered for our needs

