/**
 * Loading Components
 * 
 * Reusable loading states and skeletons
 */

'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

// === FULL PAGE LOADER ===

export function PageLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div 
      className="min-h-screen bg-black text-neutral-100 flex items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="text-center">
        <Loader2 className="w-16 h-16 text-matrix animate-spin mx-auto mb-4" />
        <p className="text-xl text-muted">{message}</p>
      </div>
    </div>
  );
}

// === SPINNER ===

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <Loader2 
      className={`text-matrix animate-spin ${sizes[size]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

// === SKELETON ===

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({ 
  width = 'w-full', 
  height = 'h-4', 
  className = '',
  variant = 'rectangular'
}: SkeletonProps) {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  return (
    <div 
      className={`bg-matrix/10 animate-pulse ${width} ${height} ${variantClasses[variant]} ${className}`}
      role="status"
      aria-label="Loading content"
    />
  );
}

// === SKELETON CARD ===

export function SkeletonCard() {
  return (
    <div className="matrix-card p-6 space-y-4" role="status" aria-label="Loading card">
      <Skeleton height="h-6" width="w-3/4" />
      <Skeleton height="h-4" width="w-full" />
      <Skeleton height="h-4" width="w-5/6" />
      <div className="flex gap-2 mt-4">
        <Skeleton height="h-8" width="w-20" />
        <Skeleton height="h-8" width="w-20" />
      </div>
    </div>
  );
}

// === SKELETON TABLE ===

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2" role="status" aria-label="Loading table">
      {/* Header */}
      <div className="flex gap-4 p-4 border-b border-matrix/30">
        <Skeleton height="h-4" width="w-1/4" />
        <Skeleton height="h-4" width="w-1/4" />
        <Skeleton height="h-4" width="w-1/4" />
        <Skeleton height="h-4" width="w-1/4" />
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4">
          <Skeleton height="h-4" width="w-1/4" />
          <Skeleton height="h-4" width="w-1/4" />
          <Skeleton height="h-4" width="w-1/4" />
          <Skeleton height="h-4" width="w-1/4" />
        </div>
      ))}
    </div>
  );
}

// === SKELETON LIST ===

export function SkeletonList({ items = 3 }: { items?: number }) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading list">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 matrix-card">
          <Skeleton variant="circular" width="w-12" height="h-12" />
          <div className="flex-1 space-y-2">
            <Skeleton height="h-4" width="w-3/4" />
            <Skeleton height="h-3" width="w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// === INLINE LOADER ===

export function InlineLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex items-center gap-2 text-muted" role="status">
      <Spinner size="sm" />
      <span>{text}</span>
    </div>
  );
}

// === BUTTON LOADER ===

export function ButtonLoader() {
  return (
    <Spinner size="sm" className="inline-block" />
  );
}

// === OVERLAY LOADER ===

export function OverlayLoader({ message = 'Processing...' }: { message?: string }) {
  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
      role="status"
      aria-live="assertive"
      aria-label={message}
    >
      <div className="matrix-card p-8 text-center">
        <Spinner size="xl" className="mx-auto mb-4" />
        <p className="text-lg text-bright">{message}</p>
      </div>
    </div>
  );
}

// === PROGRESS BAR ===

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
}

export function ProgressBar({ 
  progress, 
  label, 
  showPercentage = true 
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div role="progressbar" aria-valuenow={clampedProgress} aria-valuemin={0} aria-valuemax={100}>
      {label && (
        <div className="flex justify-between mb-2">
          <span className="text-sm text-muted">{label}</span>
          {showPercentage && (
            <span className="text-sm text-matrix">{Math.round(clampedProgress)}%</span>
          )}
        </div>
      )}
      <div className="h-2 bg-matrix/20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-matrix transition-all duration-300 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}

// === DOTS LOADER ===

export function DotsLoader() {
  return (
    <div className="flex gap-1" role="status" aria-label="Loading">
      <div className="w-2 h-2 bg-matrix rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-matrix rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-matrix rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  );
}

// === PULSE LOADER ===

export function PulseLoader() {
  return (
    <div className="flex items-center justify-center" role="status">
      <div className="w-12 h-12 border-4 border-matrix/30 border-t-matrix rounded-full animate-spin" />
    </div>
  );
}

