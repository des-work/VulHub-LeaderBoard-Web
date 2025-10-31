/**
 * React Query Provider
 * 
 * Wraps the app with React Query's QueryClientProvider
 */

'use client';

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './query-client';

// Conditionally import devtools (only in development)
let ReactQueryDevtools: React.ComponentType<any> | null = null;
if (process.env.NODE_ENV === 'development') {
  try {
    ReactQueryDevtools = require('@tanstack/react-query-devtools').ReactQueryDevtools;
  } catch {
    // Devtools not installed, that's okay
  }
}

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Show devtools in development if available */}
      {process.env.NODE_ENV === 'development' && ReactQueryDevtools && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

