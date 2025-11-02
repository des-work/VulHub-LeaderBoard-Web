# Castle Siege Animation System

**VulHub Leaderboard** - Sophisticated Canvas-based animation system with enterprise-grade features.

---

## 🎯 Overview

The Castle Siege Animation is a production-ready, highly optimized animation system that renders a beautiful castle siege battle scene before the sign-in form. Built with Canvas API, it features:

- **Robust Error Handling**: Comprehensive error recovery and graceful degradation
- **Performance Optimization**: Adaptive frame rate, object pooling, memory management
- **Accessibility**: Screen reader support, reduced motion, keyboard navigation
- **Quality Control**: Automatic quality adjustment based on device capabilities

---

## 🚀 Quick Start

### Basic Usage

```typescript
import { CastleSiegeAnimation } from '@/components/auth/CastleSiegeAnimation';

function SignInPage() {
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <>
      {!showSignIn && (
        <CastleSiegeAnimation
          phase="intro"
          onComplete={() => setShowSignIn(true)}
          debug={process.env.NODE_ENV === 'development'}
        />
      )}
      {showSignIn && <SignInForm />}
    </>
  );
}
```

### Advanced Usage with Orchestrator

```typescript
import { AnimationOrchestrator } from '@/components/auth/CastleSiegeAnimation/core';

const orchestrator = new AnimationOrchestrator({
  enableDebug: true,
  enablePerformanceMonitoring: true,
  maxFrameRate: 60
}, {
  onReady: () => console.log('Animation ready'),
  onError: (error) => console.error('Animation error:', error),
  onComplete: () => console.log('Animation complete'),
  onPhaseChange: (phase) => console.log('Phase:', phase)
});

await orchestrator.initialize();
orchestrator.start();
```

---

## 📚 Architecture

### Core Components

```
CastleSiegeAnimation/
├── core/
│   ├── AnimationOrchestrator.ts    # Main orchestrator
│   └── types/                       # Type definitions
├── canvas/
│   ├── AnimationEngine.ts          # Animation engine
│   ├── CanvasRenderer.ts           # Rendering system
│   ├── Entities.ts                 # Entity classes
│   └── Effects.ts                  # Visual effects
├── utils/
│   ├── error-handling.ts           # Error handling system
│   ├── browser-support.ts         # Browser detection
│   ├── performance.ts             # Performance optimization
│   ├── object-pool.ts              # Object pooling
│   └── accessibility.ts           # Accessibility features
├── hooks/
│   └── useAnimationOrchestrator.ts # React hook
├── components/
│   └── AnimationErrorBoundary.tsx # Error boundary
├── config.ts                       # Configuration constants
└── index.tsx                       # Main component
```

### Data Flow

```
User Interaction
    ↓
CastleSiegeAnimation Component
    ↓
useAnimationOrchestrator Hook
    ↓
AnimationOrchestrator
    ↓
AnimationEngine → CanvasRenderer
    ↓
Canvas Output
```

---

## 🎛️ Configuration

### Animation Timings

```typescript
ANIMATION_TIMINGS = {
  castle: 0-800ms      // Castle appears
  armies: 800-2000ms   // Armies arrive
  battle: 2000-5000ms  // Battle phase
  intense: 5000-7000ms // Intense battle
  victory: 7000-8200ms // Victory celebration
  flag: 8200-9400ms    // Flag raising
  title: 9400-10000ms  // Title appears
}
```

### Performance Configuration

```typescript
PERFORMANCE_CONFIG = {
  maxProjectiles: 50,   // Maximum projectiles
  maxExplosions: 20,    // Maximum explosions
  maxDebris: 100,       // Maximum debris particles
  maxStars: 150         // Maximum stars
}
```

### Quality Levels

- **High** (60 FPS): Full effects, maximum detail
- **Medium** (45 FPS): Reduced particles, balanced
- **Low** (30 FPS): Minimal effects, essential only

---

## 🔧 API Reference

### AnimationOrchestrator

```typescript
class AnimationOrchestrator {
  // Initialize
  async initialize(): Promise<void>
  
  // Control
  start(): void
  pause(): void
  skip(): void
  
  // State
  getState(): OrchestratorState
  getCanvas(): HTMLCanvasElement | null
  
  // Error handling
  onError(callback: (error: AnimationError) => void): () => void
  getErrorHistory(): AnimationError[]
  
  // Performance
  getPerformanceMetrics(): PerformanceMetrics
  
  // Cleanup
  destroy(): void
}
```

### AnimationEngine

```typescript
class AnimationEngine {
  // Control
  start(): void
  stop(): void
  skip(): void
  
  // State
  getState(): AnimationState
  isComplete(): boolean
  
  // Performance
  getPerformanceMetrics(): PerformanceMetrics
  setQuality(level: 'high' | 'medium' | 'low'): void
  getQuality(): 'high' | 'medium' | 'low'
  reduceQuality(): void
  
  // Cleanup
  destroy(): void
}
```

---

## 🎨 Customization

### Custom Colors

```typescript
// Modify config.ts
export const COLORS = {
  bgBlack: '#000000',
  matrix: '#00ff00',      // Change to your color
  starWhite: '#ffffff',
  flagGreen: '#00ff00',
  titleWhite: '#ffffff',
};
```

### Adjust Timing

```typescript
// Modify ANIMATION_TIMINGS in config.ts
export const ANIMATION_TIMINGS = {
  castle: {
    start: 0,
    end: 800,      // Adjust duration
    duration: 800,
  },
  // ... other phases
};
```

### Change Entity Counts

```typescript
// Modify PERFORMANCE_CONFIG
export const PERFORMANCE_CONFIG = {
  maxProjectiles: 50,   // Increase/decrease
  maxExplosions: 20,
  maxDebris: 100,
  maxStars: 150,
};
```

---

## ♿ Accessibility

### Features

- ✅ **Screen Reader Support**: Phase announcements
- ✅ **Reduced Motion**: Respects `prefers-reduced-motion`
- ✅ **Keyboard Navigation**: Escape to skip
- ✅ **High Contrast**: Detects and supports high contrast mode
- ✅ **Skip Button**: Always accessible

### Usage

```typescript
import { animationAccessibility } from './utils/accessibility';

// Announce phase change
animationAccessibility.announcePhaseChange('battle', 'Battle phase beginning');

// Handle keyboard
animationAccessibility.handleKeyboardNavigation(event, () => {
  // Skip animation
});

// Get accessibility attributes
const attrs = animationAccessibility.getAccessibilityAttributes();
```

---

## 🐛 Error Handling

### Error Types

```typescript
enum AnimationErrorType {
  INITIALIZATION = 'initialization',
  RENDERING = 'rendering',
  PERFORMANCE = 'performance',
  BROWSER_SUPPORT = 'browser_support',
  MEMORY = 'memory',
  ASSET_LOAD = 'asset_load',
  STATE_SYNC = 'state_sync',
  UNKNOWN = 'unknown'
}
```

### Error Recovery

- **Browser Support**: Falls back to CSS animations
- **Performance**: Reduces quality automatically
- **Memory**: Clears object pools
- **Rendering**: Restarts pipeline

### Usage

```typescript
import { animationErrorHandler } from './utils/error-handling';

// Handle errors
orchestrator.onError((error) => {
  console.error('Animation error:', error.type, error.message);
  
  if (error.severity === 'critical') {
    // Show fallback UI
  }
});

// Get error history
const errors = orchestrator.getErrorHistory();
```

---

## ⚡ Performance

### Monitoring

```typescript
// Get performance metrics
const metrics = engine.getPerformanceMetrics();

console.log('FPS:', metrics.fps);
console.log('Quality:', metrics.quality);
console.log('Memory:', metrics.currentMetrics?.memoryUsage);
console.log('Is Degrading:', metrics.isDegrading);
```

### Optimization

```typescript
// Manual quality control
engine.setQuality('medium');

// Automatic adjustment (enabled by default)
// System automatically reduces quality if FPS drops

// Check degradation
if (performanceMonitor.isDegrading()) {
  // Performance is poor
}
```

### Object Pooling

```typescript
import { entityPoolManager } from './utils/object-pool';

// Register entity pool
entityPoolManager.registerPool(
  'projectile',
  () => new ProjectileEntity(...),
  (proj) => { proj.reset(); return proj; },
  20, // initial size
  50  // max size
);

// Use pool
const proj = entityPoolManager.getEntity('projectile');
// ... use entity ...
entityPoolManager.releaseEntity('projectile', proj);
```

---

## 🧪 Testing

### Unit Tests

```typescript
import { AnimationEngine } from './canvas/AnimationEngine';

describe('AnimationEngine', () => {
  it('should initialize', async () => {
    const canvas = document.createElement('canvas');
    const engine = new AnimationEngine(canvas);
    expect(engine).toBeDefined();
  });
  
  it('should handle errors gracefully', () => {
    // Test error handling
  });
});
```

### Integration Tests

```typescript
describe('Animation Orchestration', () => {
  it('should complete full animation', async () => {
    const orchestrator = new AnimationOrchestrator();
    await orchestrator.initialize();
    
    const promise = new Promise(resolve => {
      orchestrator.callbacks.onComplete = resolve;
    });
    
    orchestrator.start();
    await promise;
    
    expect(orchestrator.getState().animation.isComplete).toBe(true);
  });
});
```

---

## 📖 Examples

### Example 1: Basic Animation

```typescript
function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <AnimationErrorBoundary>
      <CastleSiegeAnimation
        phase="intro"
        onComplete={() => setShowLogin(true)}
      />
      {showLogin && <LoginForm />}
    </AnimationErrorBoundary>
  );
}
```

### Example 2: With Performance Monitoring

```typescript
function App() {
  const [metrics, setMetrics] = useState(null);
  const orchestratorRef = useRef<AnimationOrchestrator>();

  useEffect(() => {
    const orchestrator = new AnimationOrchestrator({
      enablePerformanceMonitoring: true
    });
    
    orchestratorRef.current = orchestrator;
    
    orchestrator.initialize().then(() => {
      orchestrator.start();
      
      // Monitor performance
      const interval = setInterval(() => {
        const perf = orchestrator.getPerformanceMetrics();
        setMetrics(perf);
      }, 1000);
      
      return () => clearInterval(interval);
    });
  }, []);

  return (
    <>
      <CastleSiegeAnimation phase="intro" />
      {metrics && (
        <div>
          FPS: {metrics.fps} | Quality: {metrics.quality}
        </div>
      )}
    </>
  );
}
```

### Example 3: Custom Error Handling

```typescript
function App() {
  const handleError = useCallback((error: AnimationError) => {
    // Log to error service
    errorTrackingService.captureError({
      type: error.type,
      message: error.message,
      severity: error.severity,
      context: error.context
    });
    
    // Show fallback
    if (error.severity === 'critical') {
      showFallbackUI();
    }
  }, []);

  return (
    <AnimationErrorBoundary onError={handleError}>
      <CastleSiegeAnimation phase="intro" />
    </AnimationErrorBoundary>
  );
}
```

---

## 🔍 Troubleshooting

### Animation Not Showing

1. Check browser capabilities:
   ```typescript
   import { detectBrowserCapabilities } from './utils/browser-support';
   const caps = detectBrowserCapabilities();
   console.log('Canvas:', caps.canvasSupported);
   ```

2. Check for errors:
   ```typescript
   const errors = orchestrator.getErrorHistory();
   console.table(errors);
   ```

3. Verify reduced motion preference:
   ```typescript
   const caps = detectBrowserCapabilities();
   if (caps.reduceMotionSupported) {
     // Animation will be disabled
   }
   ```

### Performance Issues

1. Check metrics:
   ```typescript
   const metrics = engine.getPerformanceMetrics();
   console.log('FPS:', metrics.fps);
   console.log('Quality:', metrics.quality);
   ```

2. Reduce quality manually:
   ```typescript
   engine.setQuality('low');
   ```

3. Check memory:
   ```typescript
   import { getMemoryUsage } from './utils/performance';
   console.log('Memory:', getMemoryUsage(), 'MB');
   ```

### Errors

1. Check error history:
   ```typescript
   const errors = orchestrator.getErrorHistory();
   errors.forEach(e => {
     console.error(e.type, e.message, e.context);
   });
   ```

2. Enable debug mode:
   ```typescript
   const orchestrator = new AnimationOrchestrator({
     enableDebug: true
   });
   ```

---

## 📚 Additional Documentation

- [Error Handling Guide](./ERROR_HANDLING_GUIDE.md) - Comprehensive error handling documentation
- [Performance Guide](./PERFORMANCE_GUIDE.md) - Performance optimization details (if exists)
- [Accessibility Guide](./ACCESSIBILITY_GUIDE.md) - Accessibility features (if exists)

---

## 🎯 Best Practices

1. **Always Use Error Boundaries**: Wrap animation in `AnimationErrorBoundary`
2. **Monitor Performance**: Enable performance monitoring in development
3. **Respect User Preferences**: System automatically respects reduced motion
4. **Handle Errors Gracefully**: Always provide fallback UI
5. **Clean Up Resources**: Call `destroy()` when component unmounts

---

## 🚀 Future Enhancements

- [ ] WebWorker support for rendering
- [ ] IndexedDB caching for assets
- [ ] Advanced particle effects
- [ ] Custom shader support
- [ ] Multi-layer rendering

---

**Version**: 1.0.0  
**Last Updated**: November 2025  
**Maintainer**: VulHub Development Team

