'use client';

import React, { createContext, useReducer, useCallback, useEffect, ReactNode } from 'react';
import {
  Notification,
  ToastNotification,
  NotificationState,
  NotificationContextType,
  NOTIFICATION_DURATIONS,
  NOTIFICATION_STORE_CONFIG,
} from './types';

// ============================================================================
// CONTEXT CREATION
// ============================================================================

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// ============================================================================
// REDUCER
// ============================================================================

type NotificationAction =
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'ADD_TOAST'; payload: ToastNotification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'CLEAR_ALL' }
  | { type: 'CLEANUP' };

const initialState: NotificationState = {
  notifications: [],
  toasts: [],
  unreadCount: 0,
};

function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case 'ADD_NOTIFICATION': {
      const newNotifications = [action.payload, ...state.notifications].slice(0, NOTIFICATION_STORE_CONFIG.MAX_NOTIFICATIONS);
      return {
        ...state,
        notifications: newNotifications,
        unreadCount: state.unreadCount + 1,
      };
    }

    case 'ADD_TOAST': {
      const newToasts = [...state.toasts, action.payload].slice(-NOTIFICATION_STORE_CONFIG.MAX_TOAST_AT_ONCE);
      return {
        ...state,
        toasts: newToasts,
        notifications: [action.payload, ...state.notifications].slice(0, NOTIFICATION_STORE_CONFIG.MAX_NOTIFICATIONS),
        unreadCount: state.unreadCount + 1,
      };
    }

    case 'REMOVE_NOTIFICATION': {
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
    }

    case 'REMOVE_TOAST': {
      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== action.payload),
      };
    }

    case 'MARK_AS_READ': {
      const updated = state.notifications.map(n =>
        n.id === action.payload ? { ...n, read: true } : n
      );
      const unreadCount = updated.filter(n => !n.read).length;
      return {
        ...state,
        notifications: updated,
        unreadCount,
      };
    }

    case 'MARK_ALL_AS_READ': {
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0,
      };
    }

    case 'CLEAR_ALL': {
      return initialState;
    }

    case 'CLEANUP': {
      const now = new Date();
      const cutoffTime = new Date(now.getTime() - NOTIFICATION_STORE_CONFIG.RETENTION_HOURS * 60 * 60 * 1000);
      const filtered = state.notifications.filter(n => new Date(n.timestamp) > cutoffTime);
      const newUnreadCount = filtered.filter(n => !n.read).length;
      return {
        ...state,
        notifications: filtered,
        unreadCount: newUnreadCount,
      };
    }

    default:
      return state;
  }
}

// ============================================================================
// PROVIDER
// ============================================================================

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Auto-dismiss toasts
  useEffect(() => {
    const timers = state.toasts.map(toast => {
      const duration = NOTIFICATION_DURATIONS[toast.duration];
      if (duration === 0) return null; // Don't auto-dismiss persistent

      return setTimeout(() => {
        dispatch({ type: 'REMOVE_TOAST', payload: toast.id });
      }, duration);
    });

    return () => {
      timers.forEach(timer => {
        if (timer) clearTimeout(timer);
      });
    };
  }, [state.toasts]);

  // Cleanup old notifications periodically
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'CLEANUP' });
    }, NOTIFICATION_STORE_CONFIG.CLEANUP_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  const notify = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>): string => {
    const id = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date(),
    };

    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  }, []);

  const markAsRead = useCallback((id: string) => {
    dispatch({ type: 'MARK_AS_READ', payload: id });
  }, []);

  const markAllAsRead = useCallback(() => {
    dispatch({ type: 'MARK_ALL_AS_READ' });
  }, []);

  const clear = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  const getUnreadCount = useCallback(() => {
    return state.unreadCount;
  }, [state.unreadCount]);

  const value: NotificationContextType = {
    state,
    notify,
    dismiss,
    markAsRead,
    markAllAsRead,
    clear,
    getUnreadCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// ============================================================================
// HOOK
// ============================================================================

export const useNotification = (): NotificationContextType => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};
