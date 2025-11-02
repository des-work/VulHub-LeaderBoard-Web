/**
 * Browser Support Tests
 */

import {
  detectBrowserCapabilities,
  supportsCanvas,
  supportsRequestAnimationFrame,
  supportsReduceMotion,
  shouldShowAnimation,
  polyfillRequestAnimationFrame,
  getAnimationConfig,
} from '../../utils/browser-support';

describe('Browser Support Detection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Canvas Support', () => {
    it('should detect Canvas support', () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      // Mock getContext if needed
      if (!context) {
        canvas.getContext = jest.fn().mockReturnValue({});
      }

      const supported = supportsCanvas();
      expect(typeof supported).toBe('boolean');
    });
  });

  describe('requestAnimationFrame Support', () => {
    it('should detect RAF support', () => {
      const supported = supportsRequestAnimationFrame();
      expect(typeof supported).toBe('boolean');
    });

    it('should polyfill RAF if missing', () => {
      const originalRAF = window.requestAnimationFrame;
      (window as any).requestAnimationFrame = undefined;

      polyfillRequestAnimationFrame();

      expect(window.requestAnimationFrame).toBeDefined();
      expect(typeof window.requestAnimationFrame).toBe('function');

      // Restore
      window.requestAnimationFrame = originalRAF;
    });
  });

  describe('Reduce Motion', () => {
    it('should detect reduced motion preference', () => {
      const originalMatchMedia = window.matchMedia;
      
      window.matchMedia = jest.fn().mockReturnValue({
        matches: true,
        media: '(prefers-reduced-motion: reduce)',
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      } as any);

      const supports = supportsReduceMotion();
      expect(supports).toBe(true);

      window.matchMedia = originalMatchMedia;
    });
  });

  describe('Capability Detection', () => {
    it('should detect all capabilities', () => {
      const capabilities = detectBrowserCapabilities();

      expect(capabilities).toHaveProperty('canvasSupported');
      expect(capabilities).toHaveProperty('webGLSupported');
      expect(capabilities).toHaveProperty('requestAnimationFrameSupported');
      expect(capabilities).toHaveProperty('performanceAPISupported');
      expect(capabilities).toHaveProperty('reduceMotionSupported');
      expect(capabilities).toHaveProperty('localStorageSupported');
      expect(capabilities).toHaveProperty('canUseFullFeatures');
      expect(capabilities).toHaveProperty('degradedMode');
    });
  });

  describe('Animation Display Decision', () => {
    it('should allow animation if capabilities support it', () => {
      // This will depend on actual browser capabilities
      const shouldShow = shouldShowAnimation();
      expect(typeof shouldShow).toBe('boolean');
    });

    it('should prevent animation if reduced motion preferred', () => {
      const originalMatchMedia = window.matchMedia;
      
      window.matchMedia = jest.fn().mockReturnValue({
        matches: true,
        media: '(prefers-reduced-motion: reduce)',
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      } as any);

      const shouldShow = shouldShowAnimation();
      expect(shouldShow).toBe(false);

      window.matchMedia = originalMatchMedia;
    });
  });

  describe('Animation Configuration', () => {
    it('should generate configuration based on capabilities', () => {
      const config = getAnimationConfig();

      expect(config).toHaveProperty('maxFrameRate');
      expect(config).toHaveProperty('enableParticles');
      expect(config).toHaveProperty('enableEffects');
      expect(config).toHaveProperty('enableObjectPooling');
      expect(config).toHaveProperty('respectReduceMotion');
      expect(config).toHaveProperty('enableAnnouncements');
    });

    it('should reduce frame rate in degraded mode', () => {
      // Mock degraded mode
      const originalMatchMedia = window.matchMedia;
      
      window.matchMedia = jest.fn((query: string) => {
        if (query === '(prefers-reduced-motion: reduce)') {
          return {
            matches: true,
            media: query,
            onchange: null,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
          } as any;
        }
        return {
          matches: false,
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
        } as any;
      });

      const config = getAnimationConfig();
      expect(config.maxFrameRate).toBe(30); // Degraded mode

      window.matchMedia = originalMatchMedia;
    });
  });
});

