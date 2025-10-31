/**
 * Skip Link Component
 * 
 * Allows keyboard users to skip directly to main content
 */

'use client';

import React from 'react';

interface SkipLinkProps {
  targetId?: string;
  label?: string;
}

export function SkipLink({ 
  targetId = 'main-content', 
  label = 'Skip to main content' 
}: SkipLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href={`#${targetId}`}
      className="skip-link sr-only sr-only-focusable"
      onClick={handleClick}
    >
      {label}
    </a>
  );
}

