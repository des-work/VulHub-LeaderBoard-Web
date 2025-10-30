export function escapeHTML(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function stripTags(input: string): string {
  return input.replace(/<[^>]*>/g, '');
}

export function sanitizeText(input: string): string {
  return escapeHTML(stripTags(input));
}

// Optional: wrapper for external links
import React from 'react';
export const SafeExternalLink: React.FC<React.ComponentProps<'a'>> = ({ children, ...props }) => (
  <a {...props} rel="noopener noreferrer" target={props.target || '_blank'}>{children}</a>
);
