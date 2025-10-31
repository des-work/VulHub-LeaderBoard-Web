'use client';

import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { ToastNotification, NOTIFICATION_DURATIONS } from '../../lib/notifications/types';

interface ToastProps {
  notification: ToastNotification;
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ notification, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);

  // Auto-dismiss timer
  useEffect(() => {
    const duration = NOTIFICATION_DURATIONS[notification.duration];
    if (duration === 0) return; // Don't auto-dismiss persistent

    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [notification.duration, notification.id]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(notification.id);
    }, 300); // Animation duration
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      case 'error':
        return <AlertCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      case 'info':
        return <Info className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getColors = () => {
    switch (notification.type) {
      case 'success':
        return {
          bg: 'bg-green-500/10',
          border: 'border-green-500/30',
          icon: 'text-green-400',
          text: 'text-green-300',
        };
      case 'error':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          icon: 'text-red-400',
          text: 'text-red-300',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/30',
          icon: 'text-yellow-400',
          text: 'text-yellow-300',
        };
      case 'info':
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          icon: 'text-blue-400',
          text: 'text-blue-300',
        };
      default:
        return {
          bg: 'bg-neutral-500/10',
          border: 'border-neutral-500/30',
          icon: 'text-neutral-400',
          text: 'text-neutral-300',
        };
    }
  };

  const colors = getColors();

  return (
    <div
      className={`transform transition-all duration-300 ${
        isExiting ? 'translate-x-96 opacity-0' : 'translate-x-0 opacity-100'
      }`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        className={`${colors.bg} ${colors.border} border rounded-lg p-4 flex items-start space-x-3 backdrop-blur-sm`}
      >
        {/* Icon */}
        <div className={`${colors.icon} flex-shrink-0 mt-0.5`}>{getIcon()}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`${colors.text} font-semibold text-sm`}>{notification.title}</h3>
          {notification.message && (
            <p className="text-neutral-400 text-sm mt-1">{notification.message}</p>
          )}

          {/* Action Button */}
          {notification.action && (
            <button
              onClick={() => {
                notification.action!.onClick();
                handleDismiss();
              }}
              className={`${colors.text} text-xs font-semibold mt-2 hover:opacity-80 transition-opacity`}
              aria-label={notification.action.label}
            >
              {notification.action.label}
            </button>
          )}
        </div>

        {/* Dismiss Button */}
        {notification.dismissible && (
          <button
            onClick={handleDismiss}
            className="text-neutral-500 hover:text-neutral-300 transition-colors flex-shrink-0"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};
