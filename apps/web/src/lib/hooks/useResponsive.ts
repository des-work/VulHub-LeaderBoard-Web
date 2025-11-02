/**
 * Responsive Hooks
 * 
 * React hooks for detecting screen sizes and responsive breakpoints
 */

import { useState, useEffect } from 'react';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

interface BreakpointValues {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

const breakpoints: BreakpointValues = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

/**
 * Hook to detect current breakpoint
 * 
 * @returns Current breakpoint ('mobile', 'tablet', or 'desktop')
 * 
 * @example
 * ```tsx
 * function Component() {
 *   const breakpoint = useBreakpoint();
 *   
 *   return (
 *     <div>
 *       Current device: {breakpoint}
 *     </div>
 *   );
 * }
 * ```
 */
export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('desktop');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width < breakpoints.sm) {
        setBreakpoint('mobile');
      } else if (width < breakpoints.lg) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };

    // Set initial value
    updateBreakpoint();

    // Listen for resize events
    window.addEventListener('resize', updateBreakpoint);

    return () => {
      window.removeEventListener('resize', updateBreakpoint);
    };
  }, []);

  return breakpoint;
}

/**
 * Hook to check if screen is mobile
 * 
 * @returns true if mobile, false otherwise
 * 
 * @example
 * ```tsx
 * function Component() {
 *   const isMobile = useIsMobile();
 *   
 *   return isMobile ? <MobileView /> : <DesktopView />;
 * }
 * ```
 */
export function useIsMobile(): boolean {
  const breakpoint = useBreakpoint();
  return breakpoint === 'mobile';
}

/**
 * Hook to check if screen is tablet
 * 
 * @returns true if tablet, false otherwise
 */
export function useIsTablet(): boolean {
  const breakpoint = useBreakpoint();
  return breakpoint === 'tablet';
}

/**
 * Hook to check if screen is desktop
 * 
 * @returns true if desktop, false otherwise
 */
export function useIsDesktop(): boolean {
  const breakpoint = useBreakpoint();
  return breakpoint === 'desktop';
}

/**
 * Hook to get current window dimensions
 * 
 * @returns Object with width and height
 * 
 * @example
 * ```tsx
 * function Component() {
 *   const { width, height } = useWindowSize();
 *   
 *   return (
 *     <div>
 *       Window: {width}x{height}
 *     </div>
 *   );
 * }
 * ```
 */
export function useWindowSize() {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return size;
}

/**
 * Hook to check if specific breakpoint is active
 * 
 * @param breakpoint - Breakpoint to check ('sm', 'md', 'lg', 'xl', '2xl')
 * @returns true if breakpoint is active or larger
 * 
 * @example
 * ```tsx
 * function Component() {
 *   const isLargeScreen = useMediaQuery('lg');
 *   
 *   return (
 *     <div>
 *       {isLargeScreen ? 'Large screen' : 'Small screen'}
 *     </div>
 *   );
 * }
 * ```
 */
export function useMediaQuery(breakpoint: keyof BreakpointValues): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const query = `(min-width: ${breakpoints[breakpoint]}px)`;
    const media = window.matchMedia(query);

    // Set initial value
    setMatches(media.matches);

    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    media.addEventListener('change', handleChange);

    return () => {
      media.removeEventListener('change', handleChange);
    };
  }, [breakpoint]);

  return matches;
}

/**
 * Hook to detect if device is touch-enabled
 * 
 * @returns true if touch device, false otherwise
 * 
 * @example
 * ```tsx
 * function Component() {
 *   const isTouchDevice = useIsTouchDevice();
 *   
 *   return (
 *     <div>
 *       {isTouchDevice ? 'Touch' : 'Mouse'} interaction
 *     </div>
 *   );
 * }
 * ```
 */
export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-expect-error - msMaxTouchPoints is IE specific
        navigator.msMaxTouchPoints > 0
      );
    };

    setIsTouch(checkTouch());
  }, []);

  return isTouch;
}

/**
 * Hook to detect device orientation
 * 
 * @returns 'portrait' or 'landscape'
 * 
 * @example
 * ```tsx
 * function Component() {
 *   const orientation = useOrientation();
 *   
 *   return (
 *     <div>
 *       Device is in {orientation} mode
 *     </div>
 *   );
 * }
 * ```
 */
export function useOrientation(): 'portrait' | 'landscape' {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const updateOrientation = () => {
      if (window.innerWidth > window.innerHeight) {
        setOrientation('landscape');
      } else {
        setOrientation('portrait');
      }
    };

    updateOrientation();

    window.addEventListener('resize', updateOrientation);

    return () => {
      window.removeEventListener('resize', updateOrientation);
    };
  }, []);

  return orientation;
}

/**
 * Hook to check if device is in standalone mode (PWA)
 * 
 * @returns true if running as PWA, false otherwise
 */
export function useIsStandalone(): boolean {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const checkStandalone = () => {
      return (
        window.matchMedia('(display-mode: standalone)').matches ||
        'standalone' in navigator ||
        // @ts-expect-error - standalone is iOS specific
        navigator.standalone === true
      );
    };

    setIsStandalone(checkStandalone());
  }, []);

  return isStandalone;
}

