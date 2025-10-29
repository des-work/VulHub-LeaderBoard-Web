import React from 'react';

interface SwordIconProps {
  className?: string;
  size?: number;
}

export const SwordIcon: React.FC<SwordIconProps> = ({ 
  className = '', 
  size = 24 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sword blade */}
      <rect x="11" y="2" width="2" height="16" fill="currentColor" />
      
      {/* Sword tip */}
      <path d="M12 2 L14 4 L12 6 Z" fill="currentColor" />
      
      {/* Sword guard */}
      <rect x="8" y="16" width="8" height="2" fill="currentColor" />
      
      {/* Sword handle */}
      <rect x="10" y="18" width="4" height="4" fill="currentColor" />
      
      {/* Sword pommel */}
      <circle cx="12" cy="22" r="1" fill="currentColor" />
    </svg>
  );
};
