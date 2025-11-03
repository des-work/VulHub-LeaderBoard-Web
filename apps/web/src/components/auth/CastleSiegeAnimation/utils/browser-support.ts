/**
 * Browser Support Detection
 * 
 * Checks for required browser capabilities and provides fallback information
 */

export interface BrowserCapabilities {
  canvasSupported: boolean;
  webGLSupported: boolean;
  requestAnimationFrameSupported: boolean;
  performanceAPISupported: boolean;
  reduceMotionSupported: boolean;
  localStorageSupported: boolean;
  canUseFullFeatures: boolean;
  degradedMode: boolean;
}

/**
 * Detect all browser capabilities
 */
export function detectBrowserCapabilities(): BrowserCapabilities {
  return {
    canvasSupported: supportsCanvas(),
    webGLSupported: supportsWebGL(),
    requestAnimationFrameSupported: supportsRequestAnimationFrame(),
    performanceAPISupported: supportsPerformanceAPI(),
    reduceMotionSupported: supportsReduceMotion(),
    localStorageSupported: supportsLocalStorage(),
    canUseFullFeatures: canUseFullFeatures(),
    degradedMode: shouldUseDegradedMode()
  };
}

/**
 * Check if Canvas API is supported
 */
export function supportsCanvas(): boolean {
  const canvas = document.createElement('canvas');
  return !!(canvas.getContext && canvas.getContext('2d'));
}

/**
 * Check if WebGL is supported
 */
export function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      (window as any).WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

/**
 * Check if requestAnimationFrame is supported
 */
export function supportsRequestAnimationFrame(): boolean {
  return !!(
    window.requestAnimationFrame ||
    (window as any).webkitRequestAnimationFrame ||
    (window as any).mozRequestAnimationFrame ||
    (window as any).msRequestAnimationFrame
  );
}

/**
 * Check if Performance API is supported
 */
export function supportsPerformanceAPI(): boolean {
  return !!(
    window.performance &&
    typeof window.performance.now === 'function' &&
    typeof window.performance.mark === 'function' &&
    typeof window.performance.measure === 'function'
  );
}

/**
 * Check if user prefers reduced motion
 */
export function supportsReduceMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if localStorage is available
 */
export function supportsLocalStorage(): boolean {
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if we can use full animation features
 */
export function canUseFullFeatures(): boolean {
  const capabilities = detectBrowserCapabilities();
  return (
    capabilities.canvasSupported &&
    capabilities.requestAnimationFrameSupported &&
    !capabilities.reduceMotionSupported
  );
}

/**
 * Check if we should use degraded mode
 */
export function shouldUseDegradedMode(): boolean {
  const capabilities = detectBrowserCapabilities();

  // Degraded if missing critical features
  if (!capabilities.canvasSupported || !capabilities.requestAnimationFrameSupported) {
    return true;
  }

  // Degraded if user prefers reduced motion
  if (capabilities.reduceMotionSupported) {
    return true;
  }

  // Degraded on very low-end devices
  if (!supportsPerformanceAPI()) {
    return true;
  }

  return false;
}

/**
 * Get fallback message for unsupported features
 */
export function getFallbackMessage(): string {
  const capabilities = detectBrowserCapabilities();

  if (!capabilities.canvasSupported) {
    return 'Canvas animations are not supported in your browser. Showing sign-in form.';
  }

  if (!capabilities.requestAnimationFrameSupported) {
    return 'Animation support is limited. Showing sign-in form.';
  }

  if (capabilities.reduceMotionSupported) {
    return 'Respecting your motion preferences. Showing sign-in form.';
  }

  return 'Animation temporarily unavailable. Showing sign-in form.';
}

/**
 * Get polyfill for requestAnimationFrame if needed
 */
export function polyfillRequestAnimationFrame(): void {
  if (!window.requestAnimationFrame) {
    let lastTime = 0;
    const vendors = ['webkit', 'moz', 'ms', 'o'];

    for (let i = 0; i < vendors.length && !window.requestAnimationFrame; i++) {
      const vendor = vendors[i];
      window.requestAnimationFrame = (window as any)[`${vendor}RequestAnimationFrame`];
      (window as any).cancelAnimationFrame =
        (window as any)[`${vendor}CancelAnimationFrame`] ||
        (window as any)[`${vendor}CancelRequestAnimationFrame`];
    }

    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function (callback) {
        const currentTime = Date.now();
        const timeToCall = Math.max(0, 16 - (currentTime - lastTime));
        const id = window.setTimeout(() => callback(currentTime + timeToCall), timeToCall);
        lastTime = currentTime + timeToCall;
        return id as any;
      };
    }

    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
      };
    }
  }
}

/**
 * Check if animation should be shown at all
 */
export function shouldShowAnimation(): boolean {
  const capabilities = detectBrowserCapabilities();

  // Don't show if critical features missing
  if (!capabilities.canvasSupported || !capabilities.requestAnimationFrameSupported) {
    return false;
  }

  // Don't show if user prefers reduced motion and system is in strict mode
  if (capabilities.reduceMotionSupported) {
    return false;
  }

  return true;
}

/**
 * Get animation configuration based on device capabilities
 */
export function getAnimationConfig() {
  const capabilities = detectBrowserCapabilities();

  return {
    // Rendering
    maxFrameRate: capabilities.degradedMode ? 30 : 60,
    enableParticles: !capabilities.degradedMode,
    enableEffects: !capabilities.degradedMode,

    // Performance
    enableObjectPooling: capabilities.performanceAPISupported,
    enablePerformanceMonitoring: capabilities.performanceAPISupported,

    // Accessibility
    respectReduceMotion: capabilities.reduceMotionSupported,
    enableAnnouncements: true,

    // Debug
    enableDebug: process.env.NODE_ENV === 'development',
    enablePerformanceLogs: process.env.NODE_ENV === 'development' && capabilities.performanceAPISupported
  };
}

/**
 * Log browser capabilities (development only)
 */
export function logBrowserCapabilities(): void {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const capabilities = detectBrowserCapabilities();
  console.group('🖥️ Browser Capabilities');
  console.log('Canvas Support:', capabilities.canvasSupported);
  console.log('WebGL Support:', capabilities.webGLSupported);
  console.log('requestAnimationFrame:', capabilities.requestAnimationFrameSupported);
  console.log('Performance API:', capabilities.performanceAPISupported);
  console.log('Reduce Motion:', capabilities.reduceMotionSupported);
  console.log('LocalStorage:', capabilities.localStorageSupported);
  console.log('Full Features:', capabilities.canUseFullFeatures);
  console.log('Degraded Mode:', capabilities.degradedMode);
  console.groupEnd();
}
