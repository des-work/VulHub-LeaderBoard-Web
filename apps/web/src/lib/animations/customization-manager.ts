/**
 * Comprehensive Customization Manager
 * Handles all aspects of design customization for professional appearance
 */

import { CustomizationConfig, ColorConfig, TypographyConfig, GlowConfig, AnimationConfig, ScrollStage } from './types';
import { scrollAnimationManager } from './scroll-manager';
import { glowManager } from './glow-manager';

export class CustomizationManager {
  private config: CustomizationConfig;
  private isInitialized = false;

  constructor() {
    this.config = this.getDefaultConfig();
  }

  /**
   * Initialize customization system
   */
  init(): void {
    if (this.isInitialized) return;
    
    this.applyColors();
    this.applyTypography();
    this.applyGlowEffects();
    this.initializeScrollAnimations();
    this.isInitialized = true;
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<CustomizationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (this.isInitialized) {
      this.applyColors();
      this.applyTypography();
      this.applyGlowEffects();
      this.updateScrollAnimations();
    }
  }

  /**
   * Apply color configuration
   */
  private applyColors(): void {
    const { colors } = this.config;
    
    // Apply CSS custom properties
    const root = document.documentElement;
    
    // Primary colors
    root.style.setProperty('--color-primary', colors.primary.base);
    root.style.setProperty('--color-primary-light', colors.primary.light);
    root.style.setProperty('--color-primary-dark', colors.primary.dark);
    root.style.setProperty('--color-primary-muted', colors.primary.muted);
    
    // Secondary colors
    root.style.setProperty('--color-secondary', colors.secondary.base);
    root.style.setProperty('--color-secondary-light', colors.secondary.light);
    root.style.setProperty('--color-secondary-dark', colors.secondary.dark);
    root.style.setProperty('--color-secondary-muted', colors.secondary.muted);
    
    // Neutral colors
    root.style.setProperty('--color-neutral-white', colors.neutral.white);
    root.style.setProperty('--color-neutral-black', colors.neutral.black);
    
    // Gray scale
    Object.entries(colors.neutral.gray).forEach(([key, value]) => {
      root.style.setProperty(`--color-neutral-${key}`, value);
    });
    
    // Semantic colors
    root.style.setProperty('--color-success', colors.semantic.success);
    root.style.setProperty('--color-warning', colors.semantic.warning);
    root.style.setProperty('--color-error', colors.semantic.error);
    root.style.setProperty('--color-info', colors.semantic.info);
    
    // Sophistication settings
    root.style.setProperty('--color-saturation', `${colors.sophistication.saturation}%`);
    root.style.setProperty('--color-brightness', `${colors.sophistication.brightness}%`);
    root.style.setProperty('--color-contrast', `${colors.sophistication.contrast}%`);
    root.style.setProperty('--color-temperature', colors.sophistication.temperature);
  }

  /**
   * Apply typography configuration
   */
  private applyTypography(): void {
    const { typography } = this.config;
    const root = document.documentElement;
    
    // Font families
    root.style.setProperty('--font-primary', typography.fonts.primary);
    root.style.setProperty('--font-secondary', typography.fonts.secondary);
    root.style.setProperty('--font-mono', typography.fonts.mono);
    root.style.setProperty('--font-display', typography.fonts.display);
    root.style.setProperty('--font-serif', typography.fonts.serif);
    
    // Font weights
    Object.entries(typography.weights).forEach(([key, value]) => {
      root.style.setProperty(`--font-weight-${key}`, value.toString());
    });
    
    // Font sizes
    Object.entries(typography.sizes).forEach(([key, value]) => {
      root.style.setProperty(`--font-size-${key}`, value);
    });
    
    // Line heights
    Object.entries(typography.lineHeights).forEach(([key, value]) => {
      root.style.setProperty(`--line-height-${key}`, value.toString());
    });
    
    // Letter spacing
    Object.entries(typography.letterSpacing).forEach(([key, value]) => {
      root.style.setProperty(`--letter-spacing-${key}`, value);
    });
  }

  /**
   * Apply glow effects
   */
  private applyGlowEffects(): void {
    const { glow, professional } = this.config;
    
    if (professional.minimalGlow) {
      // Apply subtle glow effects
      this.applySubtleGlows();
    } else {
      // Apply configured glow effects
      glowManager.updateConfig(glow);
    }
  }

  /**
   * Apply subtle glow effects for professional look
   */
  private applySubtleGlows(): void {
    // Apply subtle glows to specific elements
    const glowElements = document.querySelectorAll('[data-glow]');
    
    glowElements.forEach(element => {
      const glowType = element.getAttribute('data-glow');
      const color = element.getAttribute('data-glow-color') || '#a855f7';
      
      switch (glowType) {
        case 'primary':
          glowManager.createProfessionalGlow(element as HTMLElement, color);
          break;
        case 'accent':
          glowManager.createAccentGlow(element as HTMLElement, color);
          break;
        case 'subtle':
          glowManager.createSophisticatedGlow(element as HTMLElement, {
            color,
            intensity: 'subtle',
            gradient: true,
            gradientColors: [color, `${color}60`, `${color}30`],
            animate: false
          });
          break;
      }
    });
  }

  /**
   * Initialize scroll animations
   */
  private initializeScrollAnimations(): void {
    const { scrollStages, animations } = this.config;
    
    if (scrollStages.length > 0) {
      scrollAnimationManager.init(scrollStages);
    }
    
    // Add common elements to animation system
    this.addCommonAnimations();
  }

  /**
   * Update scroll animations
   */
  private updateScrollAnimations(): void {
    const { scrollStages } = this.config;
    scrollAnimationManager.updateScrollStages(scrollStages);
  }

  /**
   * Add common animations to elements
   */
  private addCommonAnimations(): void {
    const { animations } = this.config;
    
    // Add animations to common elements
    const selectors = [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      '.card', '.button', '.leaderboard-item',
      '.fade-in', '.slide-in', '.scale-in'
    ];
    
    selectors.forEach(selector => {
      scrollAnimationManager.addElement(selector, animations);
    });
  }

  /**
   * Get default configuration
   */
  private getDefaultConfig(): CustomizationConfig {
    return {
      colors: {
        primary: {
          base: '#6366f1',
          light: '#818cf8',
          dark: '#4f46e5',
          muted: '#a5b4fc'
        },
        secondary: {
          base: '#ec4899',
          light: '#f472b6',
          dark: '#db2777',
          muted: '#f9a8d4'
        },
        neutral: {
          white: '#ffffff',
          black: '#000000',
          gray: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827'
          }
        },
        semantic: {
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6'
        },
        sophistication: {
          saturation: 85,
          brightness: 90,
          contrast: 95,
          temperature: 'neutral'
        }
      },
      typography: {
        fonts: {
          primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          secondary: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          mono: "'Fira Code', 'JetBrains Mono', 'Consolas', monospace",
          display: "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif",
          serif: "'Playfair Display', Georgia, serif"
        },
        weights: {
          light: 300,
          normal: 400,
          medium: 500,
          semibold: 600,
          bold: 700,
          extrabold: 800
        },
        sizes: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem',
          '4xl': '2.25rem',
          '5xl': '3rem',
          '6xl': '3.75rem'
        },
        lineHeights: {
          tight: 1.25,
          normal: 1.5,
          relaxed: 1.75,
          loose: 2
        },
        letterSpacing: {
          tight: '-0.025em',
          normal: '0em',
          wide: '0.025em',
          wider: '0.05em'
        }
      },
      glow: {
        intensity: 'subtle',
        color: '#6366f1',
        spread: 30,
        blur: 15,
        opacity: 0.6,
        animate: false,
        pulseSpeed: 5,
        pulseIntensity: 0.2,
        gradient: true,
        gradientColors: ['#6366f1', '#8b5cf6', '#a855f7'],
        gradientAngle: 45
      },
      animations: {
        scroll: {
          enabled: true,
          threshold: 0.1,
          duration: 600,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          stagger: 100
        },
        entrance: {
          enabled: true,
          type: 'fade',
          direction: 'up',
          duration: 800,
          delay: 0,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        },
        hover: {
          enabled: true,
          scale: 1.05,
          duration: 200,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        },
        text: {
          enabled: true,
          type: 'fade',
          duration: 600,
          delay: 0,
          stagger: 50
        }
      },
      scrollStages: [
        {
          id: 'hero',
          name: 'Hero Section',
          start: 0,
          end: 0.3,
          animations: {
            scroll: { enabled: true, threshold: 0.1, duration: 800, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', stagger: 150 },
            entrance: { enabled: true, type: 'fade', direction: 'up', duration: 1000, delay: 0, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
            hover: { enabled: true, scale: 1.02, duration: 300, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
            text: { enabled: true, type: 'fade', duration: 800, delay: 200, stagger: 100 }
          },
          elements: ['h1', 'h2', '.hero-content']
        },
        {
          id: 'content',
          name: 'Content Section',
          start: 0.3,
          end: 0.7,
          animations: {
            scroll: { enabled: true, threshold: 0.1, duration: 600, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', stagger: 100 },
            entrance: { enabled: true, type: 'slide', direction: 'up', duration: 700, delay: 0, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
            hover: { enabled: true, scale: 1.03, duration: 250, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
            text: { enabled: true, type: 'fade', duration: 500, delay: 0, stagger: 75 }
          },
          elements: ['.card', '.leaderboard-item', '.content-section']
        },
        {
          id: 'footer',
          name: 'Footer Section',
          start: 0.7,
          end: 1,
          animations: {
            scroll: { enabled: true, threshold: 0.1, duration: 500, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', stagger: 50 },
            entrance: { enabled: true, type: 'fade', direction: 'up', duration: 600, delay: 0, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
            hover: { enabled: true, scale: 1.01, duration: 200, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
            text: { enabled: true, type: 'fade', duration: 400, delay: 0, stagger: 25 }
          },
          elements: ['.footer', '.footer-content']
        }
      ],
      professional: {
        subtleEffects: true,
        refinedColors: true,
        sophisticatedTypography: true,
        minimalGlow: true
      },
      performance: {
        reduceMotion: false,
        lowEndDevice: false,
        gpuAcceleration: true
      }
    };
  }

  /**
   * Get current configuration
   */
  getConfig(): CustomizationConfig {
    return { ...this.config };
  }

  /**
   * Cleanup
   */
  destroy(): void {
    scrollAnimationManager.destroy();
    glowManager.cleanup();
    this.isInitialized = false;
  }
}

// Singleton instance
export const customizationManager = new CustomizationManager();
