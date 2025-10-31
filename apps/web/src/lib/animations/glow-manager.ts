/**
 * Sophisticated Glow Effect Manager
 * Provides subtle, professional glow effects
 */

import { GlowConfig } from './types';

export class GlowManager {
  private config: GlowConfig;
  private elements: Map<HTMLElement, GlowConfig> = new Map();

  constructor(config: GlowConfig) {
    this.config = config;
  }

  /**
   * Apply glow effect to element
   */
  applyGlow(element: HTMLElement, customConfig?: Partial<GlowConfig>): void {
    const config = { ...this.config, ...customConfig };
    this.elements.set(element, config);
    
    this.updateElementGlow(element, config);
  }

  /**
   * Update glow effect for element
   */
  updateGlow(element: HTMLElement, config: Partial<GlowConfig>): void {
    const currentConfig = this.elements.get(element) || this.config;
    const newConfig = { ...currentConfig, ...config };
    
    this.elements.set(element, newConfig);
    this.updateElementGlow(element, newConfig);
  }

  /**
   * Remove glow effect from element
   */
  removeGlow(element: HTMLElement): void {
    element.style.textShadow = '';
    element.style.boxShadow = '';
    element.style.filter = '';
    this.elements.delete(element);
  }

  /**
   * Update all glow effects
   */
  updateAllGlows(): void {
    this.elements.forEach((config, element) => {
      this.updateElementGlow(element, config);
    });
  }

  /**
   * Update glow configuration
   */
  updateConfig(newConfig: Partial<GlowConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.updateAllGlows();
  }

  /**
   * Update element glow based on configuration
   */
  private updateElementGlow(element: HTMLElement, config: GlowConfig): void {
    const { intensity, color, spread, blur, opacity, animate, pulseSpeed, pulseIntensity, gradient, gradientColors, gradientAngle } = config;
    
    // Calculate glow properties based on intensity
    const glowIntensity = this.getGlowIntensity(intensity);
    const glowSpread = (spread / 100) * glowIntensity;
    const glowBlur = (blur / 50) * glowIntensity;
    const glowOpacity = opacity * glowIntensity;
    
    // Create glow effect
    let glowEffect = '';
    
    if (gradient && gradientColors.length > 1) {
      // Gradient glow
      const gradientString = `linear-gradient(${gradientAngle}deg, ${gradientColors.join(', ')})`;
      glowEffect = `0 0 ${glowSpread}px ${color}, 0 0 ${glowSpread * 2}px ${color}`;
    } else {
      // Solid color glow
      glowEffect = `0 0 ${glowSpread}px ${color}, 0 0 ${glowSpread * 2}px ${color}`;
    }
    
    // Apply glow effect
    element.style.textShadow = glowEffect;
    
    // Apply box shadow for container elements
    if (element.tagName !== 'TEXT' && element.tagName !== 'SPAN') {
      element.style.boxShadow = glowEffect;
    }
    
    // Apply pulse animation if enabled
    if (animate) {
      this.applyPulseAnimation(element, pulseSpeed, pulseIntensity, glowEffect);
    }
  }

  /**
   * Get glow intensity based on preset
   */
  private getGlowIntensity(intensity: GlowConfig['intensity']): number {
    switch (intensity) {
      case 'subtle': return 0.3;
      case 'medium': return 0.6;
      case 'strong': return 0.8;
      case 'dramatic': return 1.0;
      default: return 0.5;
    }
  }

  /**
   * Apply pulse animation
   */
  private applyPulseAnimation(element: HTMLElement, speed: number, intensity: number, baseGlow: string): void {
    const duration = (11 - speed) * 1000; // Convert speed to duration
    const intensityVariation = intensity * 0.5;
    
    element.style.animation = `glow-pulse ${duration}ms ease-in-out infinite`;
    
    // Create keyframes for pulse animation
    const keyframes = `
      @keyframes glow-pulse {
        0%, 100% { 
          text-shadow: ${baseGlow};
          filter: brightness(1);
        }
        50% { 
          text-shadow: ${baseGlow.replace(/\d+px/g, (match) => 
            `${parseFloat(match) * (1 + intensityVariation)}px`
          )};
          filter: brightness(${1 + intensityVariation});
        }
      }
    `;
    
    // Inject keyframes if not already present
    if (!document.querySelector('#glow-pulse-keyframes')) {
      const style = document.createElement('style');
      style.id = 'glow-pulse-keyframes';
      style.textContent = keyframes;
      document.head.appendChild(style);
    }
  }

  /**
   * Create sophisticated glow effect
   */
  createSophisticatedGlow(element: HTMLElement, options: {
    color: string;
    intensity?: 'subtle' | 'medium' | 'strong' | 'dramatic';
    gradient?: boolean;
    gradientColors?: string[];
    animate?: boolean;
    pulseSpeed?: number;
    pulseIntensity?: number;
  }): void {
    const config: GlowConfig = {
      intensity: options.intensity || 'medium',
      color: options.color,
      spread: 60,
      blur: 30,
      opacity: 0.8,
      animate: options.animate || false,
      pulseSpeed: options.pulseSpeed || 5,
      pulseIntensity: options.pulseIntensity || 0.3,
      gradient: options.gradient || false,
      gradientColors: options.gradientColors || [options.color],
      gradientAngle: 45
    };
    
    this.applyGlow(element, config);
  }

  /**
   * Create professional glow effect
   */
  createProfessionalGlow(element: HTMLElement, color: string): void {
    this.createSophisticatedGlow(element, {
      color,
      intensity: 'subtle',
      gradient: true,
      gradientColors: [color, `${color}80`, `${color}40`],
      animate: false
    });
  }

  /**
   * Create subtle accent glow
   */
  createAccentGlow(element: HTMLElement, color: string): void {
    this.createSophisticatedGlow(element, {
      color,
      intensity: 'subtle',
      gradient: false,
      animate: true,
      pulseSpeed: 8,
      pulseIntensity: 0.2
    });
  }

  /**
   * Cleanup all glow effects
   */
  cleanup(): void {
    this.elements.forEach((_, element) => {
      this.removeGlow(element);
    });
    this.elements.clear();
  }
}

// Singleton instance
export const glowManager = new GlowManager({
  intensity: 'medium',
  color: '#a855f7',
  spread: 50,
  blur: 25,
  opacity: 0.7,
  animate: false,
  pulseSpeed: 5,
  pulseIntensity: 0.3,
  gradient: false,
  gradientColors: ['#a855f7'],
  gradientAngle: 45
});
