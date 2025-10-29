'use client';

import React from 'react';
import { DesignProvider, DesignApplication } from '@vulhub/ui';

export function ClientDesignProvider({ children }: { children: React.ReactNode }) {
  return (
    <DesignProvider>
      <DesignApplication>
        {children}
      </DesignApplication>
    </DesignProvider>
  );
}

