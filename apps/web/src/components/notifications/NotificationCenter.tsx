'use client';

import React, { useState } from 'react';
import { Bell, X, Trash2, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useNotification } from '../../lib/notifications/context';
import { NotificationType } from '../../lib/notifications/types';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const { state, markAsRead, markAllAsRead, dismiss, clear } = useNotification();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = filter === 'unread'
    ? state.notifications.filter(n => !n.read)
    : state.notifications;

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
    }
  };

  const getColors = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-300', icon: 'text-green-400' };
      case 'error':
        return { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-300', icon: 'text-red-400' };
      case 'warning':
        return { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-300', icon: 'text-yellow-400' };
      case 'info':
        return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-300', icon: 'text-blue-400' };
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed top-16 right-4 z-50 w-96 max-h-96 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-700">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-matrix" />
            <h2 className="font-semibold text-bright">Notifications</h2>
            {state.unreadCount > 0 && (
              <span className="text-xs bg-matrix text-black px-2 py-0.5 rounded-full font-bold">
                {state.unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-dim hover:text-bright transition-colors"
            aria-label="Close notification center"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filters & Actions */}
        <div className="flex items-center justify-between px-4 py-2 bg-neutral-800/50 border-b border-neutral-700">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                filter === 'all'
                  ? 'bg-matrix text-black font-semibold'
                  : 'text-dim hover:text-bright'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                filter === 'unread'
                  ? 'bg-matrix text-black font-semibold'
                  : 'text-dim hover:text-bright'
              }`}
            >
              Unread
            </button>
          </div>

          {state.notifications.length > 0 && (
            <div className="flex space-x-1">
              {state.unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-dim hover:text-bright transition-colors"
                  title="Mark all as read"
                >
                  Read All
                </button>
              )}
              <button
                onClick={clear}
                className="text-xs text-dim hover:text-bright transition-colors"
                title="Clear all notifications"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="flex items-center justify-center h-full py-8 text-center">
              <p className="text-dim text-sm">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {filteredNotifications.map(notification => {
                const colors = getColors(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={`${colors.bg} ${colors.border} border rounded p-3 group hover:bg-opacity-20 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-opacity-30' : 'bg-opacity-10'
                    }`}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Icon */}
                      <div className={`${colors.icon} flex-shrink-0 mt-0.5`}>
                        {getIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`${colors.text} text-sm font-semibold ${!notification.read ? 'font-bold' : ''}`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-matrix rounded-full flex-shrink-0" />
                          )}
                        </div>
                        {notification.message && (
                          <p className="text-neutral-400 text-xs mt-1 line-clamp-2">{notification.message}</p>
                        )}
                        <p className="text-xs text-dim mt-1">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>

                      {/* Dismiss Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dismiss(notification.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-dim hover:text-bright transition-all flex-shrink-0"
                        aria-label="Dismiss notification"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
