import React from 'react';

interface MatrixRainProps {
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export const MatrixRain: React.FC<MatrixRainProps> = ({ 
  className = '', 
  intensity = 'medium' 
}) => {
  const intensityMap = {
    low: 0.1,
    medium: 0.3,
    high: 0.5
  };
  
  const opacity = intensityMap[intensity];
  
  return (
    <div 
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: `
          linear-gradient(90deg, transparent 98%, rgba(0, 255, 0, ${opacity * 0.1}) 100%),
          linear-gradient(0deg, transparent 98%, rgba(0, 255, 0, ${opacity * 0.1}) 100%)
        `,
        backgroundSize: '50px 50px',
        animation: 'matrix-rain 20s linear infinite'
      }}
    />
  );
};

interface CyberpunkGlowProps {
  children: React.ReactNode;
  className?: string;
  color?: 'green' | 'pink' | 'blue' | 'purple';
  intensity?: 'low' | 'medium' | 'high';
}

export const CyberpunkGlow: React.FC<CyberpunkGlowProps> = ({ 
  children, 
  className = '',
  color = 'green',
  intensity = 'medium'
}) => {
  const colorMap = {
    green: 'rgba(0, 255, 0,',
    pink: 'rgba(236, 72, 153,',
    blue: 'rgba(59, 130, 246,',
    purple: 'rgba(147, 51, 234,'
  };
  
  const intensityMap = {
    low: 0.3,
    medium: 0.5,
    high: 0.8
  };
  
  const glowColor = colorMap[color];
  const glowIntensity = intensityMap[intensity];
  
  return (
    <div 
      className={className}
      style={{
        textShadow: `0 0 10px ${glowColor}${glowIntensity})`,
        boxShadow: `0 0 20px ${glowColor}${glowIntensity * 0.5})`,
        transition: 'all 0.3s ease'
      }}
    >
      {children}
    </div>
  );
};

interface NeonBorderProps {
  children: React.ReactNode;
  className?: string;
  color?: 'green' | 'pink' | 'blue' | 'purple';
  thickness?: 'thin' | 'medium' | 'thick';
}

export const NeonBorder: React.FC<NeonBorderProps> = ({ 
  children, 
  className = '',
  color = 'green',
  thickness = 'medium'
}) => {
  const colorMap = {
    green: 'rgba(0, 255, 0, 0.5)',
    pink: 'rgba(236, 72, 153, 0.5)',
    blue: 'rgba(59, 130, 246, 0.5)',
    purple: 'rgba(147, 51, 234, 0.5)'
  };
  
  const thicknessMap = {
    thin: '1px',
    medium: '2px',
    thick: '3px'
  };
  
  const borderColor = colorMap[color];
  const borderWidth = thicknessMap[thickness];
  
  return (
    <div 
      className={className}
      style={{
        border: `${borderWidth} solid ${borderColor}`,
        boxShadow: `0 0 15px ${borderColor}`,
        transition: 'all 0.3s ease'
      }}
    >
      {children}
    </div>
  );
};
