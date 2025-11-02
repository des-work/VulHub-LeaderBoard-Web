/**
 * Test Utilities and Helpers
 * 
 * Reusable utilities for testing the animation system
 */

/**
 * Create a mock canvas element for testing
 */
export function createMockCanvas(width: number = 800, height: number = 600): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  // Mock getContext
  const mockContext = {
    clearRect: jest.fn(),
    fillRect: jest.fn(),
    beginPath: jest.fn(),
    arc: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    fill: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    translate: jest.fn(),
    rotate: jest.fn(),
    scale: jest.fn(),
    setTransform: jest.fn(),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    globalAlpha: 1,
  };

  canvas.getContext = jest.fn().mockReturnValue(mockContext);
  
  return canvas;
}

/**
 * Create a mock animation frame for testing
 */
export function mockRequestAnimationFrame() {
  const callbacks: Array<(time: number) => void> = [];
  let frameId = 0;
  let currentTime = 0;

  const raf = jest.fn((callback: (time: number) => void) => {
    callbacks.push(callback);
    return frameId++ as any;
  });

  const cancel = jest.fn((id: any) => {
    // Mock cancel behavior
  });

  // Simulate frame progression
  const step = (ms: number = 16) => {
    currentTime += ms;
    const cbs = [...callbacks];
    callbacks.length = 0;
    cbs.forEach(cb => cb(currentTime));
  };

  const reset = () => {
    callbacks.length = 0;
    frameId = 0;
    currentTime = 0;
  };

  return {
    requestAnimationFrame: raf,
    cancelAnimationFrame: cancel,
    step,
    reset,
  };
}

/**
 * Wait for animation frame
 */
export function waitForFrame(): Promise<number> {
  return new Promise(resolve => {
    requestAnimationFrame(resolve);
  });
}

/**
 * Wait for multiple frames
 */
export function waitForFrames(count: number): Promise<void> {
  return new Promise(async resolve => {
    for (let i = 0; i < count; i++) {
      await waitForFrame();
    }
    resolve();
  });
}

/**
 * Mock performance.now()
 */
export function mockPerformanceNow(initialTime: number = 0) {
  let currentTime = initialTime;
  
  const originalNow = performance.now;
  performance.now = jest.fn(() => currentTime);
  
  const advance = (ms: number) => {
    currentTime += ms;
  };
  
  const reset = () => {
    currentTime = initialTime;
  };
  
  const restore = () => {
    performance.now = originalNow;
  };
  
  return { advance, reset, restore };
}

/**
 * Create mock browser capabilities
 */
export function createMockCapabilities(overrides: Partial<any> = {}) {
  return {
    canvasSupported: true,
    webGLSupported: true,
    requestAnimationFrameSupported: true,
    performanceAPISupported: true,
    reduceMotionSupported: false,
    localStorageSupported: true,
    canUseFullFeatures: true,
    degradedMode: false,
    ...overrides,
  };
}

/**
 * Wait for condition with timeout
 */
export function waitFor(
  condition: () => boolean,
  timeout: number = 5000,
  interval: number = 50
): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const check = () => {
      if (condition()) {
        resolve();
      } else if (Date.now() - startTime > timeout) {
        reject(new Error('Wait condition timeout'));
      } else {
        setTimeout(check, interval);
      }
    };
    
    check();
  });
}

/**
 * Create mock animation error
 */
export function createMockError(
  type: string = 'unknown',
  message: string = 'Test error',
  recoverable: boolean = true
) {
  return {
    type,
    message,
    recoverable,
    context: {},
    timestamp: Date.now(),
    severity: 'medium' as const,
  };
}

/**
 * Mock window.matchMedia
 */
export function mockMatchMedia(matches: boolean = false) {
  const mockMediaQueryList = {
    matches,
    media: '',
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };

  window.matchMedia = jest.fn(() => mockMediaQueryList as any);
  
  return {
    setMatches: (newMatches: boolean) => {
      mockMediaQueryList.matches = newMatches;
    },
    restore: () => {
      // Restore original if needed
    },
  };
}

/**
 * Setup test environment
 */
export function setupTestEnvironment() {
  // Mock DOM
  if (typeof document === 'undefined') {
    global.document = {
      createElement: jest.fn(),
      getElementById: jest.fn(),
      body: {
        appendChild: jest.fn(),
        removeChild: jest.fn(),
      },
    } as any;
  }

  // Mock window
  if (typeof window === 'undefined') {
    global.window = {
      innerWidth: 1920,
      innerHeight: 1080,
      requestAnimationFrame: jest.fn(),
      cancelAnimationFrame: jest.fn(),
      matchMedia: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    } as any;
  }

  // Mock performance
  if (!performance.now) {
    (performance as any).now = jest.fn(() => Date.now());
  }
}

/**
 * Cleanup test environment
 */
export function cleanupTestEnvironment() {
  jest.clearAllMocks();
}

