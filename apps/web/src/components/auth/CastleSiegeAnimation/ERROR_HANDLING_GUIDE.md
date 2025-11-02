# Animation Error Handling Guide

## Overview

The Castle Siege Animation system now includes comprehensive error handling, recovery mechanisms, and graceful degradation strategies. This ensures the animation remains robust even in adverse conditions.

---

## Architecture

### Error Handling Components

#### 1. **AnimationErrorHandler** (`utils/error-handling.ts`)
Core error handling system with recovery strategies.

**Features**:
- Centralized error tracking
- Error classification by type
- Recovery strategy execution
- Error history logging
- Degradation detection

**Usage**:
```typescript
import { animationErrorHandler, createAnimationError, AnimationErrorType } from './utils/error-handling';

// Handle an error
const error = createAnimationError(
  AnimationErrorType.RENDERING,
  'Canvas context lost',
  true, // recoverable
  { context: 'additional info' },
  originalError,
  'high' // severity
);

animationErrorHandler.handle(error);

// Register error listener
const unsubscribe = animationErrorHandler.onError((error) => {
  console.log('Animation error:', error);
});

// Get error history
const errors = animationErrorHandler.getErrorHistory();
```

#### 2. **Browser Support Detection** (`utils/browser-support.ts`)
Detects browser capabilities and provides polyfills.

**Features**:
- Canvas API detection
- WebGL support checking
- requestAnimationFrame polyfill
- Performance API detection
- Reduced motion preference detection
- Capability-based configuration

**Usage**:
```typescript
import {
  detectBrowserCapabilities,
  shouldShowAnimation,
  getAnimationConfig
} from './utils/browser-support';

// Get full capabilities
const capabilities = detectBrowserCapabilities();

// Check if animation should run
if (shouldShowAnimation()) {
  // Get configuration based on device
  const config = getAnimationConfig();
  // {
  //   maxFrameRate: 60 (or 30 if degraded),
  //   enableParticles: true,
  //   enableEffects: true,
  //   ...
  // }
}

// Log capabilities in development
logBrowserCapabilities();
```

#### 3. **AnimationErrorBoundary** (`components/AnimationErrorBoundary.tsx`)
React error boundary for catching unhandled animation errors.

**Features**:
- Catches React errors
- Provides fallback UI
- Integrates with error handler
- Shows error details in development

**Usage**:
```typescript
<AnimationErrorBoundary
  onError={(error) => console.log('Animation failed:', error)}
  fallback={<div>Animation unavailable</div>}
>
  <CastleSiegeAnimation />
</AnimationErrorBoundary>
```

---

## Error Types

### AnimationErrorType Enum

```typescript
enum AnimationErrorType {
  INITIALIZATION = 'initialization',      // Initialization failures
  RENDERING = 'rendering',                // Canvas rendering errors
  PERFORMANCE = 'performance',            // Performance degradation
  BROWSER_SUPPORT = 'browser_support',    // Unsupported features
  MEMORY = 'memory',                      // Memory pressure
  ASSET_LOAD = 'asset_load',              // Asset loading failures
  STATE_SYNC = 'state_sync',              // State synchronization issues
  UNKNOWN = 'unknown'                     // Unknown errors
}
```

### Error Severity Levels

- **Low**: Minor issues, animation continues
- **Medium**: Notable issues, may affect quality
- **High**: Significant issues, features may degrade
- **Critical**: System failure, fallback required

---

## Recovery Strategies

### Browser Support Issues
When Canvas API is not supported:
- Fallback to CSS animations
- Display error message
- Show sign-in form directly

### Performance Issues
When animation is running slow:
- Reduce frame rate (60fps → 30fps)
- Disable particles and effects
- Simplify rendering

### Memory Issues
When memory usage is high:
- Clear entity pools
- Reduce object count
- Trigger garbage collection

### Rendering Errors
When rendering fails:
- Restart rendering pipeline
- Clear canvas context
- Retry rendering

### Unknown Errors
For unexpected errors:
- Attempt graceful degradation
- Reduce animation quality
- Log detailed error information

---

## Integration with AnimationOrchestrator

The orchestrator now includes automatic error handling:

```typescript
const orchestrator = new AnimationOrchestrator({
  enableDebug: true,
  enablePerformanceMonitoring: true
}, {
  onReady: () => console.log('Ready'),
  onError: (error) => {
    console.error('Animation error:', error);
    // Handle error in UI
  },
  onComplete: () => console.log('Complete'),
  onPhaseChange: (phase) => console.log('Phase:', phase)
});

// Initialize with error handling
try {
  await orchestrator.initialize();
  orchestrator.start();
} catch (error) {
  console.error('Failed to start animation:', error);
  // Show fallback UI
}

// Monitor errors
orchestrator.onError((error) => {
  if (error.severity === 'critical') {
    // Replace with sign-in form
  }
});

// Get error history
const errors = orchestrator.getErrorHistory();
```

---

## Error Handling Flow

```
Animation Operation
       ↓
  Try-Catch Block
       ↓
   Error Occurs
       ↓
Create AnimationError
       ↓
animationErrorHandler.handle(error)
       ↓
     ├─ Log error
     ├─ Trigger callbacks
     └─ Execute recovery
           ↓
         ├─ Success: Animation continues
         └─ Failed: Enter degraded mode
                ↓
         Attempt graceful degradation
```

---

## Development Debugging

### Enable Debug Mode
```typescript
const orchestrator = new AnimationOrchestrator({
  enableDebug: true,
  enablePerformanceMonitoring: true
});
```

### Check Browser Capabilities
```typescript
import { logBrowserCapabilities } from './utils/browser-support';

logBrowserCapabilities();
// Output:
// 🖥️ Browser Capabilities
// Canvas Support: true
// WebGL Support: true
// requestAnimationFrame: true
// Performance API: true
// Reduce Motion: false
// LocalStorage: true
// Full Features: true
// Degraded Mode: false
```

### Monitor Error History
```typescript
// Get recent errors
const errors = orchestrator.getErrorHistory();
console.table(errors.map(e => ({
  type: e.type,
  message: e.message,
  severity: e.severity,
  recoverable: e.recoverable,
  timestamp: new Date(e.timestamp).toLocaleTimeString()
})));

// Clear history
orchestrator.clearErrorHistory();
```

### Check Degradation Status
```typescript
if (animationErrorHandler.shouldDegrade()) {
  console.warn('System is degraded - consider showing fallback');
}
```

---

## Best Practices

### 1. **Always Use Error Boundaries**
Wrap animation components with `AnimationErrorBoundary`:

```typescript
<AnimationErrorBoundary>
  <CastleSiegeAnimation />
</AnimationErrorBoundary>
```

### 2. **Handle Initialization Errors**
```typescript
try {
  await orchestrator.initialize();
} catch (error) {
  // Show fallback UI
  renderSignInForm();
}
```

### 3. **Monitor for Degradation**
```typescript
orchestrator.onError((error) => {
  if (error.severity === 'critical') {
    // Replace animation with fallback
    showFallback();
  }
});
```

### 4. **Respect User Preferences**
```typescript
import { shouldShowAnimation } from './utils/browser-support';

if (!shouldShowAnimation()) {
  // User prefers reduced motion or browser doesn't support
  renderDirectSignIn();
}
```

### 5. **Log Errors for Analysis**
```typescript
orchestrator.onError((error) => {
  // Send to error tracking service
  errorTrackingService.captureError({
    type: error.type,
    message: error.message,
    severity: error.severity,
    context: error.context
  });
});
```

---

## Testing Error Scenarios

### Test Browser Incompatibility
```typescript
// Mock missing Canvas support
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: null
});

// Animation should fallback gracefully
```

### Test Memory Pressure
```typescript
// Monitor memory usage during animation
setInterval(() => {
  if (performance.memory) {
    console.log(`Memory: ${Math.round(performance.memory.usedJSHeapSize / 1048576)}MB`);
  }
}, 1000);
```

### Test Reduced Motion
```typescript
// Simulate reduced motion preference
window.matchMedia = () => ({
  matches: true,
  media: '(prefers-reduced-motion: reduce)',
  onchange: null,
  addEventListener: () => {},
  removeEventListener: () => {},
  addListener: () => {},
  removeListener: () => {}
});

// Animation should respect preference
```

---

## Troubleshooting

### "Animation not showing"
1. Check browser capabilities: `logBrowserCapabilities()`
2. Check for errors: `orchestrator.getErrorHistory()`
3. Verify Canvas support: `detectBrowserCapabilities().canvasSupported`
4. Check network: Ensure no blocked resources

### "Animation is stuttering"
1. Check frame rate: Monitor FPS in DevTools
2. Check memory: `performance.memory.usedJSHeapSize`
3. Reduce quality: Enable `degradedMode` configuration
4. Check CPU: Monitor performance in DevTools

### "Animation crashes browser"
1. Enable error monitoring: Set `enableDebug: true`
2. Check error history: `orchestrator.getErrorHistory()`
3. Reduce animation quality
4. Check for memory leaks
5. Test on different browsers

### "Error Boundary fallback showing"
1. Check console for actual error
2. Check `getErrorHistory()` for recorded errors
3. Look for component stack in error details
4. Verify ErrorBoundary is properly wrapping component

---

## Performance Monitoring

### Key Metrics
- **Frame Rate**: Should maintain 60 FPS (30 FPS in degraded mode)
- **Memory Usage**: Should stay < 100MB
- **Error Rate**: Should be < 1% of animation runs
- **Recovery Time**: Should recover within 1 second

### Enable Performance Monitoring
```typescript
const orchestrator = new AnimationOrchestrator({
  enablePerformanceMonitoring: true
});

// Monitor will automatically check:
// - Memory usage every second
// - Performance metrics
// - System degradation
```

---

## Future Enhancements

- [ ] Network error retry logic
- [ ] Automatic performance tuning
- [ ] Error analytics and reporting
- [ ] A/B testing degradation strategies
- [ ] WebWorker support for rendering
- [ ] IndexedDB caching for assets
