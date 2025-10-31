/**
 * Live Region Component
 * 
 * Announces updates to screen readers
 */

'use client';

import React from 'react';

interface LiveRegionProps {
  message: string;
  priority?: 'polite' | 'assertive';
  role?: 'status' | 'alert';
}

export function LiveRegion({ 
  message, 
  priority = 'polite',
  role = 'status'
}: LiveRegionProps) {
  return (
    <div
      role={role}
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}

