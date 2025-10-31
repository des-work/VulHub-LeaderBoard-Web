'use client';

import React from 'react';
import { useNotification } from '../../lib/notifications/context';
import { Toast } from './Toast';

/**
 * ToastContainer
 * 
 * Displays all active toast notifications in a stack at the bottom-right
 * Should be placed near the root of the app layout
 */
export const ToastContainer: React.FC = () => {
  const { state, dismiss } = useNotification();

  if (state.toasts.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-sm"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      aria-atomic="false"
    >
      {state.toasts.map(toast => (
        <Toast
          key={toast.id}
          notification={toast}
          onDismiss={dismiss}
        />
      ))}
    </div>
  );
};
