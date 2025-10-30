'use client';

import React from 'react';

interface Props { children: React.ReactNode; fallback?: React.ReactNode }

interface State { hasError: boolean }

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: any, info: any) { /* noop or report */ }
  render() {
    if (this.state.hasError) return this.props.fallback || <div className="p-4 text-red-400">Something went wrong.</div>;
    return this.props.children;
  }
}
