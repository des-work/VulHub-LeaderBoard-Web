import React from 'react';

interface CastleIconProps {
  className?: string;
  size?: number;
}

export const CastleIcon: React.FC<CastleIconProps> = ({ 
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
      {/* Castle base */}
      <rect x="2" y="12" width="20" height="8" fill="currentColor" />
      
      {/* Castle towers */}
      <rect x="2" y="8" width="4" height="4" fill="currentColor" />
      <rect x="6" y="6" width="4" height="6" fill="currentColor" />
      <rect x="10" y="4" width="4" height="8" fill="currentColor" />
      <rect x="14" y="6" width="4" height="6" fill="currentColor" />
      <rect x="18" y="8" width="4" height="4" fill="currentColor" />
      
      {/* Castle flags */}
      <path d="M4 8 L4 6 L6 6 L6 8 Z" fill="currentColor" />
      <path d="M8 6 L8 4 L10 4 L10 6 Z" fill="currentColor" />
      <path d="M12 4 L12 2 L14 2 L14 4 Z" fill="currentColor" />
      <path d="M16 6 L16 4 L18 4 L18 6 Z" fill="currentColor" />
      <path d="M20 8 L20 6 L22 6 L22 8 Z" fill="currentColor" />
      
      {/* Castle gate */}
      <rect x="10" y="12" width="4" height="6" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="12" cy="15" r="1" fill="currentColor" />
    </svg>
  );
};
