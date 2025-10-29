import React from 'react';

interface ShieldIconProps {
  className?: string;
  size?: number;
}

export const ShieldIcon: React.FC<ShieldIconProps> = ({ 
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
      {/* Shield shape */}
      <path 
        d="M12 2 L20 6 L20 12 C20 16 12 22 12 22 C12 22 4 16 4 12 L4 6 Z" 
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
      />
      
      {/* Shield emblem */}
      <path 
        d="M12 8 L16 12 L12 16 L8 12 Z" 
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
};
