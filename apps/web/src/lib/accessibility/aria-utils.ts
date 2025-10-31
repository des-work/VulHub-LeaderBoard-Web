/**
 * ARIA Utilities
 * 
 * Helper functions for creating accessible interfaces with proper ARIA attributes
 */

export interface AriaButtonProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-pressed'?: boolean;
  'aria-expanded'?: boolean;
  'aria-haspopup'?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  'aria-controls'?: string;
  'aria-disabled'?: boolean;
  role?: 'button';
}

export interface AriaLinkProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | boolean;
  role?: 'link';
}

export interface AriaFormProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-required'?: boolean;
  'aria-invalid'?: boolean;
  'aria-errormessage'?: string;
}

export interface AriaLiveRegionProps {
  'aria-live'?: 'polite' | 'assertive' | 'off';
  'aria-atomic'?: boolean;
  'aria-relevant'?: 'additions' | 'removals' | 'text' | 'all';
  role?: 'status' | 'alert' | 'log';
}

export interface AriaNavigationProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  role: 'navigation' | 'main' | 'complementary' | 'banner' | 'contentinfo' | 'search' | 'region';
}

/**
 * Generate unique ID for ARIA relationships
 */
let idCounter = 0;
export function generateAriaId(prefix: string = 'aria'): string {
  idCounter++;
  return `${prefix}-${idCounter}-${Date.now()}`;
}

/**
 * Create ARIA props for a button
 */
export function createAriaButton(options: {
  label?: string;
  pressed?: boolean;
  expanded?: boolean;
  controls?: string;
  disabled?: boolean;
  describedBy?: string;
}): AriaButtonProps {
  return {
    role: 'button',
    'aria-label': options.label,
    'aria-pressed': options.pressed,
    'aria-expanded': options.expanded,
    'aria-controls': options.controls,
    'aria-disabled': options.disabled,
    'aria-describedby': options.describedBy,
  };
}

/**
 * Create ARIA props for a form field
 */
export function createAriaFormField(options: {
  label?: string;
  required?: boolean;
  invalid?: boolean;
  errorId?: string;
  describedBy?: string;
}): AriaFormProps {
  return {
    'aria-label': options.label,
    'aria-required': options.required,
    'aria-invalid': options.invalid,
    'aria-errormessage': options.invalid ? options.errorId : undefined,
    'aria-describedby': options.describedBy,
  };
}

/**
 * Create ARIA props for a live region (announcements)
 */
export function createAriaLiveRegion(options: {
  level?: 'polite' | 'assertive';
  atomic?: boolean;
  role?: 'status' | 'alert';
}): AriaLiveRegionProps {
  return {
    'aria-live': options.level || 'polite',
    'aria-atomic': options.atomic ?? true,
    role: options.role || 'status',
  };
}

/**
 * Create ARIA props for navigation landmarks
 */
export function createAriaLandmark(options: {
  role: 'navigation' | 'main' | 'complementary' | 'banner' | 'contentinfo' | 'search' | 'region';
  label?: string;
  labelledBy?: string;
}): AriaNavigationProps {
  return {
    role: options.role,
    'aria-label': options.label,
    'aria-labelledby': options.labelledBy,
  };
}

/**
 * Announce to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  if (typeof window === 'undefined') return;

  const announcement = document.createElement('div');
  announcement.setAttribute('role', priority === 'assertive' ? 'alert' : 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only'; // Screen reader only
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Focus trap for modals/dialogs
 */
export class FocusTrap {
  private container: HTMLElement;
  private previousFocus: HTMLElement | null = null;
  private focusableElements: HTMLElement[] = [];

  constructor(container: HTMLElement) {
    this.container = container;
  }

  /**
   * Activate focus trap
   */
  activate(): void {
    // Store current focus
    this.previousFocus = document.activeElement as HTMLElement;

    // Get all focusable elements
    this.focusableElements = this.getFocusableElements();

    // Focus first element
    if (this.focusableElements.length > 0) {
      this.focusableElements[0].focus();
    }

    // Add event listener for tab key
    this.container.addEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Deactivate focus trap
   */
  deactivate(): void {
    this.container.removeEventListener('keydown', this.handleKeyDown);

    // Restore previous focus
    if (this.previousFocus) {
      this.previousFocus.focus();
    }
  }

  /**
   * Get all focusable elements in container
   */
  private getFocusableElements(): HTMLElement[] {
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    return Array.from(this.container.querySelectorAll(selector)) as HTMLElement[];
  }

  /**
   * Handle tab key navigation
   */
  private handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key !== 'Tab') return;

    const firstElement = this.focusableElements[0];
    const lastElement = this.focusableElements[this.focusableElements.length - 1];

    if (e.shiftKey) {
      // Shift + Tab: move backward
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab: move forward
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };
}

/**
 * Skip link utilities
 */
export function createSkipLink(targetId: string, label: string = 'Skip to main content'): {
  id: string;
  href: string;
  label: string;
  onClick: (e: React.MouseEvent) => void;
} {
  return {
    id: 'skip-link',
    href: `#${targetId}`,
    label,
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      const target = document.getElementById(targetId);
      if (target) {
        target.focus();
        target.scrollIntoView();
      }
    },
  };
}

/**
 * Check if element is keyboard accessible
 */
export function isKeyboardAccessible(element: HTMLElement): boolean {
  const tagName = element.tagName.toLowerCase();
  const interactiveTags = ['a', 'button', 'input', 'select', 'textarea'];
  const hasTabIndex = element.hasAttribute('tabindex');
  const tabIndex = parseInt(element.getAttribute('tabindex') || '0', 10);

  return (
    interactiveTags.includes(tagName) ||
    (hasTabIndex && tabIndex >= 0)
  );
}

/**
 * Add keyboard support to non-interactive elements
 */
export function makeKeyboardAccessible(element: HTMLElement, onClick?: () => void): void {
  // Add tabindex if not present
  if (!element.hasAttribute('tabindex')) {
    element.setAttribute('tabindex', '0');
  }

  // Add role if not present
  if (!element.hasAttribute('role')) {
    element.setAttribute('role', 'button');
  }

  // Add keyboard event listener
  if (onClick) {
    element.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    });
  }
}

