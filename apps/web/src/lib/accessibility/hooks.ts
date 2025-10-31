/**
 * Accessibility Hooks
 * 
 * React hooks for managing accessibility features
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { FocusTrap, announceToScreenReader } from './aria-utils';

/**
 * Hook for managing focus trap in modals/dialogs
 * 
 * @example
 * ```tsx
 * function Modal({ isOpen, onClose }) {
 *   const modalRef = useFocusTrap(isOpen);
 *   
 *   return (
 *     <div ref={modalRef} role="dialog">
 *       <button onClick={onClose}>Close</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useFocusTrap(isActive: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const trapRef = useRef<FocusTrap | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    if (isActive) {
      trapRef.current = new FocusTrap(ref.current);
      trapRef.current.activate();
    } else {
      trapRef.current?.deactivate();
      trapRef.current = null;
    }

    return () => {
      trapRef.current?.deactivate();
    };
  }, [isActive]);

  return ref;
}

/**
 * Hook for announcing messages to screen readers
 * 
 * @example
 * ```tsx
 * function SearchResults() {
 *   const announce = useScreenReaderAnnouncement();
 *   
 *   useEffect(() => {
 *     announce(`Found ${results.length} results`, 'polite');
 *   }, [results]);
 * }
 * ```
 */
export function useScreenReaderAnnouncement() {
  return useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    announceToScreenReader(message, priority);
  }, []);
}

/**
 * Hook for managing keyboard navigation
 * 
 * @example
 * ```tsx
 * function List({ items }) {
 *   const { activeIndex, setActiveIndex } = useKeyboardNavigation(items.length);
 *   
 *   return (
 *     <ul onKeyDown={handleKeyDown}>
 *       {items.map((item, i) => (
 *         <li key={i} aria-selected={i === activeIndex}>
 *           {item}
 *         </li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export function useKeyboardNavigation(itemCount: number, options?: {
  loop?: boolean;
  orientation?: 'vertical' | 'horizontal';
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { loop = true, orientation = 'vertical' } = options || {};

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const isVertical = orientation === 'vertical';
    const upKey = isVertical ? 'ArrowUp' : 'ArrowLeft';
    const downKey = isVertical ? 'ArrowDown' : 'ArrowRight';

    if (e.key === upKey) {
      e.preventDefault();
      setActiveIndex((prev) => {
        if (prev === 0) {
          return loop ? itemCount - 1 : 0;
        }
        return prev - 1;
      });
    } else if (e.key === downKey) {
      e.preventDefault();
      setActiveIndex((prev) => {
        if (prev === itemCount - 1) {
          return loop ? 0 : itemCount - 1;
        }
        return prev + 1;
      });
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(itemCount - 1);
    }
  }, [itemCount, loop, orientation]);

  return {
    activeIndex,
    setActiveIndex,
    handleKeyDown,
  };
}

/**
 * Hook for managing focus visibility
 * Shows focus indicators only when keyboard is used
 * 
 * @example
 * ```tsx
 * function App() {
 *   const isFocusVisible = useFocusVisible();
 *   
 *   return (
 *     <div className={isFocusVisible ? 'focus-visible' : ''}>
 *       App content
 *     </div>
 *   );
 * }
 * ```
 */
export function useFocusVisible() {
  const [isFocusVisible, setIsFocusVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsFocusVisible(true);
      }
    };

    const handleMouseDown = () => {
      setIsFocusVisible(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return isFocusVisible;
}

/**
 * Hook for managing reduced motion preference
 * 
 * @example
 * ```tsx
 * function AnimatedComponent() {
 *   const prefersReducedMotion = usePrefersReducedMotion();
 *   
 *   return (
 *     <div className={prefersReducedMotion ? 'no-animation' : 'with-animation'}>
 *       Content
 *     </div>
 *   );
 * }
 * ```
 */
export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook for managing live region announcements
 * 
 * @example
 * ```tsx
 * function SearchResults({ results }) {
 *   useLiveRegion(`Found ${results.length} results`);
 *   
 *   return <ResultsList results={results} />;
 * }
 * ```
 */
export function useLiveRegion(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announce = useScreenReaderAnnouncement();

  useEffect(() => {
    if (message) {
      announce(message, priority);
    }
  }, [message, priority, announce]);
}

/**
 * Hook for managing roving tabindex (for keyboard navigation in lists)
 * 
 * @example
 * ```tsx
 * function MenuList({ items }) {
 *   const { activeIndex, refs, handleKeyDown } = useRovingTabIndex(items.length);
 *   
 *   return (
 *     <ul role="menu" onKeyDown={handleKeyDown}>
 *       {items.map((item, i) => (
 *         <li
 *           key={i}
 *           ref={refs[i]}
 *           role="menuitem"
 *           tabIndex={i === activeIndex ? 0 : -1}
 *         >
 *           {item}
 *         </li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export function useRovingTabIndex(itemCount: number) {
  const [activeIndex, setActiveIndex] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  // Initialize refs array
  if (refs.current.length !== itemCount) {
    refs.current = Array(itemCount).fill(null);
  }

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    let newIndex = activeIndex;

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        newIndex = (activeIndex + 1) % itemCount;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = (activeIndex - 1 + itemCount) % itemCount;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = itemCount - 1;
        break;
      default:
        return;
    }

    setActiveIndex(newIndex);
    refs.current[newIndex]?.focus();
  }, [activeIndex, itemCount]);

  return {
    activeIndex,
    setActiveIndex,
    refs,
    handleKeyDown,
  };
}

/**
 * Hook for detecting if user prefers high contrast
 * 
 * @example
 * ```tsx
 * function ThemedComponent() {
 *   const prefersHighContrast = usePrefersHighContrast();
 *   
 *   return (
 *     <div className={prefersHighContrast ? 'high-contrast' : 'normal'}>
 *       Content
 *     </div>
 *   );
 * }
 * ```
 */
export function usePrefersHighContrast() {
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);

  useEffect(() => {
    // Check for high contrast media query
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setPrefersHighContrast(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersHighContrast(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersHighContrast;
}

