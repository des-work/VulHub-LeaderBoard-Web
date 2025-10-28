'use client';

/**
 * Image Components and Utilities
 * Optimized image handling with Next.js Image component
 */

import React from 'react';
import { cn } from '../lib/utils';

// Optimized Image component
export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  sizes,
  fill = false,
}) => {
  // For now, return a simple img element since Next.js Image might not be available
  return React.createElement('img', {
    src,
    alt,
    width: fill ? undefined : width,
    height: fill ? undefined : height,
    className: cn('object-cover', className),
    loading: priority ? 'eager' : 'lazy',
  });
};

// Avatar component
export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  fallback,
  size = 'md',
  className,
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };

  return React.createElement('div', {
    className: cn(
      'relative flex items-center justify-center rounded-full bg-muted',
      sizeClasses[size],
      className
    )
  }, [
    src ? React.createElement(OptimizedImage, {
      key: 'image',
      src,
      alt,
      fill: true,
      className: 'rounded-full'
    }) : React.createElement('span', {
      key: 'fallback',
      className: cn(
        'font-medium text-muted-foreground',
        textSizeClasses[size]
      )
    }, fallback || alt.charAt(0).toUpperCase())
  ]);
};

// Image Gallery component
export interface ImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  className?: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  className,
}) => {
  return React.createElement('div', {
    className: cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4', className)
  }, images.map((image, index) => React.createElement('div', {
    key: index,
    className: 'space-y-2'
  }, [
    React.createElement(OptimizedImage, {
      key: 'image',
      src: image.src,
      alt: image.alt,
      width: 300,
      height: 200,
      className: 'rounded-lg'
    }),
    image.caption && React.createElement('p', {
      key: 'caption',
      className: 'text-sm text-muted-foreground text-center'
    }, image.caption)
  ])));
};

// Export all image components
export const Images = {
  OptimizedImage,
  Avatar,
  ImageGallery,
} as const;