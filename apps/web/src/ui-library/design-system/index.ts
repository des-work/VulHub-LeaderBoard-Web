/**
 * Unified Design System - Main Export
 * Re-exports everything from the design system
 */

// Export types and defaults
export type { DesignConfig } from './types';
export { defaultDesignConfig } from './types';

// Export context and provider
export { DesignProvider, useDesign } from './context';

// Export components and utilities
export * from './components';
export * from './customization';
export * from './application';
