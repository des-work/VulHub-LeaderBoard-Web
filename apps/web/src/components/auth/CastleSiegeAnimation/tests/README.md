# Animation System Testing Guide

Comprehensive testing infrastructure for the Castle Siege Animation system.

---

## 📚 Test Structure

```
tests/
├── utils/
│   └── test-helpers.ts        # Test utilities and mocks
├── unit/
│   ├── error-handling.test.ts  # Error handling tests
│   ├── browser-support.test.ts # Browser support tests
│   └── performance.test.ts     # Performance utility tests
├── integration/
│   └── animation-flow.test.ts  # Full animation flow tests
├── performance/
│   └── benchmarks.test.ts      # Performance benchmarks
└── README.md                    # This file
```

---

## 🧪 Running Tests

### Run All Tests

```bash
npm test
```

### Run Specific Test Suite

```bash
# Unit tests
npm test -- error-handling.test.ts

# Integration tests
npm test -- animation-flow.test.ts

# Performance tests
npm test -- benchmarks.test.ts
```

### Run with Coverage

```bash
npm test -- --coverage
```

---

## 📋 Test Categories

### Unit Tests

Test individual components in isolation:

- **Error Handling**: Error creation, handling, recovery
- **Browser Support**: Capability detection, polyfills
- **Performance**: Frame rate, monitoring, memory

### Integration Tests

Test complete workflows:

- **Animation Flow**: Initialization → Start → Complete
- **State Management**: State synchronization
- **Error Recovery**: Error handling in real scenarios

### Performance Tests

Test performance characteristics:

- **Frame Rate**: Consistency, quality adjustment
- **Memory**: Leak detection, usage tracking
- **Rendering**: Frame times, efficiency

---

## 🛠️ Test Utilities

### createMockCanvas()

Creates a mock canvas element for testing:

```typescript
const canvas = createMockCanvas(800, 600);
```

### mockRequestAnimationFrame()

Mocks requestAnimationFrame for controlled testing:

```typescript
const raf = mockRequestAnimationFrame();
window.requestAnimationFrame = raf.requestAnimationFrame;

// Step through frames
raf.step(16.67); // One frame at 60 FPS
```

### setupTestEnvironment()

Sets up test environment with mocks:

```typescript
beforeEach(() => {
  setupTestEnvironment();
});
```

---

## 📖 Writing Tests

### Basic Test Structure

```typescript
import { AnimationOrchestrator } from '../../core/AnimationOrchestrator';
import { setupTestEnvironment, createMockCanvas } from '../utils/test-helpers';

describe('Feature Name', () => {
  beforeEach(() => {
    setupTestEnvironment();
  });

  it('should do something', async () => {
    const orchestrator = new AnimationOrchestrator();
    await orchestrator.initialize();
    
    // Test code
  });
});
```

### Testing Error Scenarios

```typescript
it('should handle errors gracefully', async () => {
  const orchestrator = new AnimationOrchestrator();
  
  // Mock error condition
  jest.spyOn(...).mockImplementation(() => {
    throw new Error('Test error');
  });
  
  await expect(orchestrator.initialize()).rejects.toThrow();
});
```

### Testing Performance

```typescript
it('should maintain frame rate', () => {
  const manager = new FrameRateManager();
  let frameCount = 0;
  
  // Simulate frames
  for (let i = 0; i < 1000; i++) {
    if (manager.shouldRender(i * 16.67)) {
      frameCount++;
    }
  }
  
  expect(frameCount).toBeCloseTo(60, 0);
});
```

---

## 🎯 Test Coverage Goals

- **Unit Tests**: >80% coverage
- **Integration Tests**: All major workflows
- **Performance Tests**: Critical paths
- **Accessibility Tests**: All a11y features

---

## 🔍 Debugging Tests

### Enable Debug Logging

```typescript
const orchestrator = new AnimationOrchestrator({
  enableDebug: true
});
```

### View Test Output

```bash
npm test -- --verbose
```

### Debug Specific Test

```bash
npm test -- --testNamePattern="should initialize"
```

---

## 📝 Best Practices

1. **Isolate Tests**: Each test should be independent
2. **Clean Up**: Always clean up resources in `afterEach`
3. **Mock External APIs**: Don't rely on actual browser APIs
4. **Test Edge Cases**: Include error scenarios
5. **Performance Aware**: Keep tests fast (< 1s each)
6. **Clear Assertions**: Use descriptive expect statements

---

## 🚨 Common Issues

### Issue: Tests Fail in CI

**Solution**: Ensure all mocks are properly set up, check async/await usage

### Issue: Canvas Not Available

**Solution**: Use `createMockCanvas()` utility

### Issue: requestAnimationFrame Issues

**Solution**: Use `mockRequestAnimationFrame()` utility

---

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [Accessibility Testing Guide](./ACCESSIBILITY_GUIDE.md)

