/**
 * Error Handling Tests
 */

import {
  AnimationErrorHandler,
  createAnimationError,
  AnimationErrorType,
  animationErrorHandler,
} from '../../utils/error-handling';

describe('AnimationErrorHandler', () => {
  let handler: AnimationErrorHandler;

  beforeEach(() => {
    handler = new AnimationErrorHandler();
    jest.clearAllMocks();
  });

  describe('Error Creation', () => {
    it('should create error with all properties', () => {
      const error = createAnimationError(
        AnimationErrorType.RENDERING,
        'Test error',
        true,
        { test: 'data' },
        new Error('Original'),
        'high'
      );

      expect(error.type).toBe(AnimationErrorType.RENDERING);
      expect(error.message).toBe('Test error');
      expect(error.recoverable).toBe(true);
      expect(error.context).toEqual({ test: 'data' });
      expect(error.originalError).toBeInstanceOf(Error);
      expect(error.severity).toBe('high');
      expect(error.timestamp).toBeGreaterThan(0);
    });

    it('should create error with defaults', () => {
      const error = createAnimationError(
        AnimationErrorType.UNKNOWN,
        'Default error'
      );

      expect(error.recoverable).toBe(true);
      expect(error.severity).toBe('medium');
      expect(error.context).toBeUndefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle recoverable errors', () => {
      const error = createAnimationError(
        AnimationErrorType.PERFORMANCE,
        'Performance issue',
        true
      );

      const result = handler.handle(error);
      expect(result).toBe(true);
    });

    it('should handle non-recoverable errors', () => {
      const error = createAnimationError(
        AnimationErrorType.BROWSER_SUPPORT,
        'Browser not supported',
        false
      );

      const result = handler.handle(error);
      expect(result).toBe(false);
    });

    it('should store errors in history', () => {
      const error = createAnimationError(
        AnimationErrorType.RENDERING,
        'Rendering error'
      );

      handler.handle(error);
      const history = handler.getErrorHistory();

      expect(history).toHaveLength(1);
      expect(history[0].type).toBe(AnimationErrorType.RENDERING);
    });

    it('should trigger error callbacks', () => {
      const callback = jest.fn();
      handler.onError(callback);

      const error = createAnimationError(
        AnimationErrorType.PERFORMANCE,
        'Test error'
      );

      handler.handle(error);
      expect(callback).toHaveBeenCalledWith(error);
    });

    it('should allow unsubscribing from error callbacks', () => {
      const callback = jest.fn();
      const unsubscribe = handler.onError(callback);

      unsubscribe();

      const error = createAnimationError(
        AnimationErrorType.PERFORMANCE,
        'Test error'
      );

      handler.handle(error);
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('Error Recovery', () => {
    it('should detect degradation threshold', () => {
      // Add multiple errors
      for (let i = 0; i < 3; i++) {
        handler.handle(createAnimationError(
          AnimationErrorType.PERFORMANCE,
          `Error ${i}`,
          true,
          undefined,
          undefined,
          'critical'
        ));
      }

      expect(handler.shouldDegrade()).toBe(true);
    });

    it('should clear error history', () => {
      handler.handle(createAnimationError(
        AnimationErrorType.PERFORMANCE,
        'Test error'
      ));

      expect(handler.getErrorHistory()).toHaveLength(1);

      handler.clearErrorHistory();
      expect(handler.getErrorHistory()).toHaveLength(0);
    });
  });

  describe('Recovery Strategies', () => {
    it('should execute fallback for browser support errors', () => {
      const error = createAnimationError(
        AnimationErrorType.BROWSER_SUPPORT,
        'Browser not supported',
        true
      );

      const fallbackSpy = jest.spyOn(window, 'dispatchEvent');
      handler.handle(error);

      // Should attempt fallback (may not execute if not recoverable)
      expect(fallbackSpy).toHaveBeenCalled();
    });

    it('should reduce quality for performance errors', () => {
      const error = createAnimationError(
        AnimationErrorType.PERFORMANCE,
        'Performance issue',
        true
      );

      const qualitySpy = jest.spyOn(window, 'dispatchEvent');
      handler.handle(error);

      expect(qualitySpy).toHaveBeenCalled();
    });
  });
});

describe('AnimationErrorHandler Singleton', () => {
  it('should provide singleton instance', () => {
    expect(animationErrorHandler).toBeInstanceOf(AnimationErrorHandler);
  });
});

