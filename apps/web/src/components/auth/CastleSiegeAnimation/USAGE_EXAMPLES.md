# Usage Examples

Comprehensive examples for using the Castle Siege Animation system.

---

## Example 1: Basic Integration

The simplest way to use the animation:

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
        />
      )}
      {showSignIn && <SignInForm />}
    </>
  );
}
```

---

## Example 2: With Error Boundary

Always wrap the animation in an error boundary:

```typescript
import {
  CastleSiegeAnimation,
  AnimationErrorBoundary
} from '@/components/auth/CastleSiegeAnimation';

function SignInPage() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [error, setError] = useState<AnimationError | null>(null);

  return (
    <AnimationErrorBoundary
      onError={(err) => {
        setError(err);
        // Fallback to sign-in form on critical errors
        if (err.severity === 'critical') {
          setShowSignIn(true);
        }
      }}
      fallback={<div>Animation unavailable. <SignInForm /></div>}
    >
      {!showSignIn && !error && (
        <CastleSiegeAnimation
          phase="intro"
          onComplete={() => setShowSignIn(true)}
        />
      )}
      {showSignIn && <SignInForm />}
    </AnimationErrorBoundary>
  );
}
```

---

## Example 3: Direct Orchestrator Usage

For more control, use the orchestrator directly:

```typescript
import { AnimationOrchestrator } from '@/components/auth/CastleSiegeAnimation/core';
import { useEffect, useRef } from 'react';

function CustomAnimationPage() {
  const orchestratorRef = useRef<AnimationOrchestrator | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const orchestrator = new AnimationOrchestrator({
      enableDebug: process.env.NODE_ENV === 'development',
      enablePerformanceMonitoring: true,
      maxFrameRate: 60
    }, {
      onReady: () => {
        console.log('Animation ready!');
      },
      onError: (error) => {
        console.error('Animation error:', error);
      },
      onComplete: () => {
        console.log('Animation complete!');
      },
      onPhaseChange: (phase) => {
        console.log('Phase changed:', phase);
      }
    });

    orchestratorRef.current = orchestrator;

    orchestrator.initialize()
      .then(() => {
        // Attach canvas
        const canvas = orchestrator.getCanvas();
        if (canvas && canvasRef.current) {
          canvasRef.current.appendChild(canvas);
        }
        
        // Start animation
        orchestrator.start();
      })
      .catch((error) => {
        console.error('Failed to initialize:', error);
      });

    return () => {
      orchestrator.destroy();
    };
  }, []);

  return (
    <div>
      <div ref={canvasRef} style={{ width: '100vw', height: '100vh' }} />
      <button onClick={() => orchestratorRef.current?.skip()}>
        Skip Animation
      </button>
    </div>
  );
}
```

---

## Example 4: Performance Monitoring

Monitor and display performance metrics:

```typescript
import { AnimationEngine } from '@/components/auth/CastleSiegeAnimation/canvas';
import { useEffect, useState } from 'react';

function PerformanceMonitorExample() {
  const [metrics, setMetrics] = useState<any>(null);
  const engineRef = useRef<AnimationEngine | null>(null);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const engine = new AnimationEngine(canvas, () => {
      console.log('Complete!');
    });

    engineRef.current = engine;
    engine.start();

    // Monitor performance every second
    const interval = setInterval(() => {
      const perf = engine.getPerformanceMetrics();
      setMetrics(perf);
      
      // Auto-reduce quality if degrading
      if (perf.isDegrading) {
        engine.reduceQuality();
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      engine.destroy();
      canvas.remove();
    };
  }, []);

  return (
    <div>
      {metrics && (
        <div style={{ position: 'absolute', top: 10, left: 10, color: '#00ff00' }}>
          <div>FPS: {metrics.fps}</div>
          <div>Quality: {metrics.quality}</div>
          <div>Memory: {metrics.currentMetrics?.memoryUsage?.toFixed(1)} MB</div>
          <div>Entities: {metrics.currentMetrics?.entityCount}</div>
          <div>Render Time: {metrics.currentMetrics?.renderTime?.toFixed(2)} ms</div>
        </div>
      )}
    </div>
  );
}
```

---

## Example 5: Accessibility Integration

Full accessibility support:

```typescript
import { animationAccessibility } from '@/components/auth/CastleSiegeAnimation/utils/accessibility';
import { useEffect } from 'react';

function AccessibleAnimation() {
  useEffect(() => {
    // Announce animation start
    animationAccessibility.announce('Castle siege animation starting');
    
    // Provide skip instructions
    animationAccessibility.announceSkipInstructions();

    // Handle keyboard navigation
    const handleKeyDown = (event: KeyboardEvent) => {
      animationAccessibility.handleKeyboardNavigation(event, () => {
        // Skip animation
        console.log('Animation skipped via keyboard');
      });
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <CastleSiegeAnimation
      phase="intro"
      onComplete={() => console.log('Complete')}
    />
  );
}
```

---

## Example 6: Custom Error Handling

Comprehensive error handling:

```typescript
import {
  AnimationOrchestrator,
  AnimationErrorType,
  createAnimationError
} from '@/components/auth/CastleSiegeAnimation';

function RobustAnimationPage() {
  const [error, setError] = useState<AnimationError | null>(null);
  const orchestratorRef = useRef<AnimationOrchestrator | null>(null);

  useEffect(() => {
    const orchestrator = new AnimationOrchestrator({
      enableDebug: true,
      enablePerformanceMonitoring: true
    });

    // Register error listener
    orchestrator.onError((error) => {
      setError(error);

      // Handle different error types
      switch (error.type) {
        case AnimationErrorType.BROWSER_SUPPORT:
          console.warn('Browser not fully supported');
          // Show fallback
          break;
        case AnimationErrorType.PERFORMANCE:
          console.warn('Performance issue:', error.message);
          // Reduce quality
          break;
        case AnimationErrorType.MEMORY:
          console.warn('Memory pressure detected');
          // Clear caches
          break;
        default:
          console.error('Unexpected error:', error);
      }

      // Report to error tracking service
      errorTrackingService.captureError({
        type: error.type,
        message: error.message,
        severity: error.severity,
        context: error.context
      });
    });

    orchestratorRef.current = orchestrator;

    orchestrator.initialize()
      .then(() => orchestrator.start())
      .catch((err) => {
        const animError = createAnimationError(
          AnimationErrorType.INITIALIZATION,
          err.message,
          false
        );
        setError(animError);
      });

    return () => {
      orchestrator.destroy();
    };
  }, []);

  if (error && error.severity === 'critical') {
    return <FallbackSignInForm />;
  }

  return <div>Animation running...</div>;
}
```

---

## Example 7: Quality Control

Manual quality adjustment:

```typescript
import { AnimationEngine } from '@/components/auth/CastleSiegeAnimation/canvas';

function QualityControlExample() {
  const engineRef = useRef<AnimationEngine | null>(null);
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('high');

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const engine = new AnimationEngine(canvas);
    engineRef.current = engine;
    engine.start();

    return () => engine.destroy();
  }, []);

  const handleQualityChange = (newQuality: 'high' | 'medium' | 'low') => {
    engineRef.current?.setQuality(newQuality);
    setQuality(newQuality);
  };

  return (
    <div>
      <div>
        <button onClick={() => handleQualityChange('high')}>
          High Quality
        </button>
        <button onClick={() => handleQualityChange('medium')}>
          Medium Quality
        </button>
        <button onClick={() => handleQualityChange('low')}>
          Low Quality
        </button>
      </div>
      <div>Current: {quality}</div>
    </div>
  );
}
```

---

## Example 8: Object Pooling

Using object pools for entities:

```typescript
import { entityPoolManager } from '@/components/auth/CastleSiegeAnimation/utils/object-pool';
import { ProjectileEntity } from '@/components/auth/CastleSiegeAnimation/canvas/Entities';

function PoolingExample() {
  useEffect(() => {
    // Register projectile pool
    entityPoolManager.registerPool(
      'projectile',
      () => new ProjectileEntity('pooled-1', { x: 0, y: 0 }, { x: 1, y: 1 }, '#ff0000'),
      (proj) => {
        // Reset projectile properties
        proj.isAlive = true;
        proj.life = 1.0;
        return proj;
      },
      20, // initial size
      50  // max size
    );

    // Use pool
    const projectile = entityPoolManager.getEntity('projectile');
    // ... use projectile ...
    
    // Return to pool when done
    entityPoolManager.releaseEntity('projectile', projectile);

    // Get pool statistics
    const stats = entityPoolManager.getStats();
    console.log('Pool reuse rate:', stats.projectile.reuseRate, '%');
  }, []);
}
```

---

## Example 9: Browser Compatibility Check

Check capabilities before showing animation:

```typescript
import {
  detectBrowserCapabilities,
  shouldShowAnimation,
  getAnimationConfig
} from '@/components/auth/CastleSiegeAnimation/utils/browser-support';

function CompatibilityCheckExample() {
  useEffect(() => {
    // Check capabilities
    const capabilities = detectBrowserCapabilities();
    
    if (!shouldShowAnimation()) {
      // Show fallback
      console.log('Animation not supported');
      return;
    }

    // Get device-specific config
    const config = getAnimationConfig();
    console.log('Max FPS:', config.maxFrameRate);
    console.log('Particles enabled:', config.enableParticles);
    console.log('Effects enabled:', config.enableEffects);

    // Log capabilities in development
    if (process.env.NODE_ENV === 'development') {
      logBrowserCapabilities();
    }
  }, []);

  return <CastleSiegeAnimation phase="intro" />;
}
```

---

## Example 10: Complete Integration

Full-featured integration with all features:

```typescript
import {
  CastleSiegeAnimation,
  AnimationErrorBoundary
} from '@/components/auth/CastleSiegeAnimation';
import { animationAccessibility } from '@/components/auth/CastleSiegeAnimation/utils/accessibility';
import { detectBrowserCapabilities } from '@/components/auth/CastleSiegeAnimation/utils/browser-support';

function CompleteAnimationIntegration() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);
  const [phase, setPhase] = useState<string>('');

  useEffect(() => {
    // Check browser compatibility
    const capabilities = detectBrowserCapabilities();
    if (!capabilities.canvasSupported) {
      setShowSignIn(true); // Skip animation
      return;
    }

    // Set up accessibility
    animationAccessibility.announce('Castle siege animation starting');
    animationAccessibility.announceSkipInstructions();

    // Handle keyboard
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        animationAccessibility.handleKeyboardNavigation(e, () => {
          setShowSignIn(true);
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <AnimationErrorBoundary
      onError={(error) => {
        console.error('Animation error:', error);
        if (error.severity === 'critical') {
          setShowSignIn(true);
        }
      }}
    >
      {!showSignIn && (
        <>
          <CastleSiegeAnimation
            phase="intro"
            onComplete={() => setShowSignIn(true)}
            onPhaseChange={(p) => {
              setPhase(p);
              animationAccessibility.announcePhaseChange(p);
            }}
            debug={process.env.NODE_ENV === 'development'}
            enablePerformanceMonitor={process.env.NODE_ENV === 'development'}
          />
          {metrics && (
            <div style={{ position: 'absolute', top: 10, right: 10, color: '#00ff00' }}>
              Phase: {phase} | FPS: {metrics.fps}
            </div>
          )}
        </>
      )}
      {showSignIn && <SignInForm />}
    </AnimationErrorBoundary>
  );
}
```

---

These examples demonstrate the full capabilities of the animation system. Choose the pattern that best fits your use case!

