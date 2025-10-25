import * as React from 'react';
import { useAriaLive } from '../../hooks/use-accessibility';

interface AriaLiveProps {
  message: string;
  priority: 'polite' | 'assertive';
}

export function AriaLive({ message, priority }: AriaLiveProps) {
  return (
    <div
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
      role="status"
    >
      {message}
    </div>
  );
}

/**
 * Hook to provide ARIA live announcements
 */
export function useAriaLiveAnnouncer() {
  const { message, priority, announce } = useAriaLive();

  return {
    announce,
    AriaLiveComponent: () => <AriaLive message={message} priority={priority} />,
  };
}
