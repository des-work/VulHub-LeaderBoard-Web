/**
 * Animation Accessibility Utilities
 *
 * Accessibility features and screen reader support for animation system
 */

import React from 'react';

export interface AccessibilityConfig {
  enableScreenReader: boolean;
  announcePhaseChanges: boolean;
  announcePerformanceIssues: boolean;
  provideSkipInstructions: boolean;
  respectReducedMotion: boolean;
  highContrastMode: boolean;
}

export class AnimationAccessibility {
  private config: AccessibilityConfig;
  private liveRegion: HTMLElement | null = null;
  private announcementQueue: string[] = [];
  private isProcessingQueue = false;

  constructor(config: Partial<AccessibilityConfig> = {}) {
    this.config = {
      enableScreenReader: true,
      announcePhaseChanges: true,
      announcePerformanceIssues: false,
      provideSkipInstructions: true,
      respectReducedMotion: this.detectReducedMotion(),
      highContrastMode: this.detectHighContrast(),
      ...config,
    };

    this.initializeLiveRegion();
  }

  /**
   * Detect if user prefers reduced motion
   */
  private detectReducedMotion(): boolean {
    return typeof window !== 'undefined' &&
           window.matchMedia &&
           window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Detect if user prefers high contrast
   */
  private detectHighContrast(): boolean {
    return typeof window !== 'undefined' &&
           window.matchMedia &&
           window.matchMedia('(prefers-contrast: high)').matches;
  }

  /**
   * Initialize screen reader live region
   */
  private initializeLiveRegion(): void {
    if (typeof document === 'undefined' || !this.config.enableScreenReader) return;

    // Create or find live region
    this.liveRegion = document.getElementById('animation-live-region');

    if (!this.liveRegion) {
      this.liveRegion = document.createElement('div');
      this.liveRegion.id = 'animation-live-region';
      this.liveRegion.setAttribute('aria-live', 'polite');
      this.liveRegion.setAttribute('aria-atomic', 'true');
      this.liveRegion.style.position = 'absolute';
      this.liveRegion.style.left = '-10000px';
      this.liveRegion.style.width = '1px';
      this.liveRegion.style.height = '1px';
      this.liveRegion.style.overflow = 'hidden';

      document.body.appendChild(this.liveRegion);
    }
  }

  /**
   * Announce message to screen readers
   */
  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.config.enableScreenReader || !this.liveRegion) return;

    this.announcementQueue.push(message);

    if (!this.isProcessingQueue) {
      this.processAnnouncementQueue(priority);
    }
  }

  /**
   * Process announcement queue to avoid overwhelming screen readers
   */
  private async processAnnouncementQueue(priority: 'polite' | 'assertive'): Promise<void> {
    if (this.isProcessingQueue || !this.liveRegion) return;

    this.isProcessingQueue = true;

    while (this.announcementQueue.length > 0) {
      const message = this.announcementQueue.shift();
      if (!message) continue;

      this.liveRegion.setAttribute('aria-live', priority);
      this.liveRegion.textContent = message;

      // Wait for screen reader to process before next announcement
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    this.isProcessingQueue = false;
  }

  /**
   * Announce animation phase changes
   */
  announcePhaseChange(phase: string, description?: string): void {
    if (!this.config.announcePhaseChanges) return;

    const message = `Animation phase changed to ${phase}${description ? `: ${description}` : ''}`;
    this.announce(message, 'polite');
  }

  /**
   * Announce performance issues (only if enabled)
   */
  announcePerformanceIssue(issue: string): void {
    if (!this.config.announcePerformanceIssues) return;

    this.announce(`Performance issue detected: ${issue}`, 'assertive');
  }

  /**
   * Provide skip instructions
   */
  announceSkipInstructions(): void {
    if (!this.config.provideSkipInstructions) return;

    const message = 'Press Tab to focus skip button, or press Escape to skip animation immediately';
    this.announce(message, 'polite');
  }

  /**
   * Handle keyboard navigation
   */
  handleKeyboardNavigation(event: KeyboardEvent, onSkip: () => void): void {
    // Escape key skips animation
    if (event.key === 'Escape') {
      event.preventDefault();
      onSkip();
      this.announce('Animation skipped', 'polite');
    }
  }

  /**
   * Get accessibility attributes for animation container
   */
  getAccessibilityAttributes(): Record<string, string | boolean> {
    const attributes: Record<string, string | boolean> = {
      role: 'img',
      'aria-label': 'VulHub Leaderboard animation',
      'aria-describedby': 'animation-description',
    };

    if (this.config.respectReducedMotion) {
      attributes['data-reduced-motion'] = true;
    }

    if (this.config.highContrastMode) {
      attributes['data-high-contrast'] = true;
    }

    return attributes;
  }

  /**
   * Get skip button accessibility attributes
   */
  getSkipButtonAttributes(): Record<string, string | boolean> {
    return {
      'aria-label': 'Skip animation and go to login form',
      'aria-describedby': 'skip-description',
      type: 'button',
    };
  }

  /**
   * Create hidden description elements for screen readers
   */
  createScreenReaderDescriptions(): React.ReactElement {
    return React.createElement(React.Fragment, null,
      React.createElement('div', {
        id: 'animation-description',
        className: 'sr-only'
      }, 'Interactive animation showing VulHub Leaderboard castle siege battle'),
      React.createElement('div', {
        id: 'skip-description',
        className: 'sr-only'
      }, 'Skip the animation to immediately access the login form')
    );
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<AccessibilityConfig>): void {
    this.config = { ...this.config, ...newConfig };

    // Re-initialize if screen reader support changed
    if (newConfig.enableScreenReader !== undefined) {
      this.initializeLiveRegion();
    }
  }

  /**
   * Check if animation should be disabled for accessibility
   */
  shouldDisableAnimation(): boolean {
    return this.config.respectReducedMotion;
  }

  /**
   * Get current accessibility configuration
   */
  getConfig(): AccessibilityConfig {
    return { ...this.config };
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.liveRegion && this.liveRegion.parentNode) {
      this.liveRegion.parentNode.removeChild(this.liveRegion);
    }
    this.announcementQueue = [];
    this.isProcessingQueue = false;
  }
}

// Global accessibility instance
export const animationAccessibility = new AnimationAccessibility();

// React hook for using accessibility features
export function useAnimationAccessibility(config?: Partial<AccessibilityConfig>) {
  const [accessibility] = React.useState(() => {
    if (config) {
      animationAccessibility.updateConfig(config);
    }
    return animationAccessibility;
  });

  React.useEffect(() => {
    return () => {
      // Don't destroy global instance on unmount
    };
  }, []);

  return accessibility;
}
