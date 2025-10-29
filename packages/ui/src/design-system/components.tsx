import React from 'react';
import { useDesign } from '../design-system';

// Unified Icon System
interface UnifiedIconProps {
  name: 'castle' | 'shield' | 'sword' | 'trophy' | 'users' | 'target' | 'award' | 'settings';
  size?: number;
  className?: string;
}

export const UnifiedIcon: React.FC<UnifiedIconProps> = ({ 
  name, 
  size = 24, 
  className = '' 
}) => {
  const { config } = useDesign();
  
  const iconMap = {
    castle: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="2" y="12" width="20" height="8" fill="currentColor" />
        <rect x="2" y="8" width="4" height="4" fill="currentColor" />
        <rect x="6" y="6" width="4" height="6" fill="currentColor" />
        <rect x="10" y="4" width="4" height="8" fill="currentColor" />
        <rect x="14" y="6" width="4" height="6" fill="currentColor" />
        <rect x="18" y="8" width="4" height="4" fill="currentColor" />
        <path d="M4 8 L4 6 L6 6 L6 8 Z" fill="currentColor" />
        <path d="M8 6 L8 4 L10 4 L10 6 Z" fill="currentColor" />
        <path d="M12 4 L12 2 L14 2 L14 4 Z" fill="currentColor" />
        <path d="M16 6 L16 4 L18 4 L18 6 Z" fill="currentColor" />
        <path d="M20 8 L20 6 L22 6 L22 8 Z" fill="currentColor" />
        <rect x="10" y="12" width="4" height="6" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="12" cy="15" r="1" fill="currentColor" />
      </svg>
    ),
    shield: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M12 2 L20 6 L20 12 C20 16 12 22 12 22 C12 22 4 16 4 12 L4 6 Z" fill="currentColor" stroke="currentColor" strokeWidth="1" />
        <path d="M12 8 L16 12 L12 16 L8 12 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
    ),
    sword: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="11" y="2" width="2" height="16" fill="currentColor" />
        <path d="M12 2 L14 4 L12 6 Z" fill="currentColor" />
        <rect x="8" y="16" width="8" height="2" fill="currentColor" />
        <rect x="10" y="18" width="4" height="4" fill="currentColor" />
        <circle cx="12" cy="22" r="1" fill="currentColor" />
      </svg>
    ),
    trophy: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M6 9H4a2 2 0 01-2-2V5a2 2 0 012-2h2M18 9h2a2 2 0 002-2V5a2 2 0 00-2-2h-2M4 9v10a2 2 0 002 2h12a2 2 0 002-2V9M4 9h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 15l-3-3h6l-3 3z" fill="currentColor" />
      </svg>
    ),
    users: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    target: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    award: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="12" cy="8" r="6" stroke="currentColor" strokeWidth="2" />
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    settings: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };

  return iconMap[name] || null;
};

// Unified Terminology System
interface TerminologyProps {
  children: React.ReactNode;
  className?: string;
}

export const Terminology: React.FC<TerminologyProps> = ({ children, className = '' }) => {
  const { config } = useDesign();
  
  const text = typeof children === 'string' ? children : '';
  
  if (config.elements.terminology === 'standard') {
    return <span className={className}>{children}</span>;
  }
  
  // Medieval terminology
  const medievalTerms: Record<string, string> = {
    'user': 'knight',
    'player': 'knight',
    'student': 'squire',
    'challenge': 'quest',
    'achievement': 'quest',
    'badge': 'crest',
    'score': 'honor',
    'points': 'honor points',
    'leaderboard': 'hall of champions',
    'leader': 'champion',
    'winner': 'victor',
    'security': 'defense',
    'vulnerability': 'weakness',
    'platform': 'realm',
    'system': 'kingdom',
    'dashboard': 'command center',
    'profile': 'heraldry',
  };
  
  // Hacker terminology
  const hackerTerms: Record<string, string> = {
    'user': 'hacker',
    'player': 'hacker',
    'student': 'script kiddie',
    'challenge': 'ctf',
    'achievement': 'hack',
    'badge': 'flag',
    'score': 'rep',
    'points': 'credits',
    'leaderboard': 'scoreboard',
    'leader': 'top hacker',
    'winner': 'champion',
    'security': 'sec',
    'vulnerability': 'vuln',
    'platform': 'system',
    'system': 'box',
    'dashboard': 'console',
    'profile': 'profile',
  };
  
  // Cyberpunk terminology
  const cyberpunkTerms: Record<string, string> = {
    'user': 'runner',
    'player': 'runner',
    'student': 'newbie',
    'challenge': 'run',
    'achievement': 'score',
    'badge': 'chip',
    'score': 'cred',
    'points': 'credits',
    'leaderboard': 'rankings',
    'leader': 'elite',
    'winner': 'champion',
    'security': 'ICE',
    'vulnerability': 'backdoor',
    'platform': 'grid',
    'system': 'node',
    'dashboard': 'deck',
    'profile': 'avatar',
  };
  
  let processedText = text;
  const termMap = config.elements.terminology === 'medieval' ? medievalTerms :
                  config.elements.terminology === 'hacker' ? hackerTerms :
                  config.elements.terminology === 'cyberpunk' ? cyberpunkTerms : {};
  
  Object.entries(termMap).forEach(([modern, themed]) => {
    const regex = new RegExp(`\\b${modern}\\b`, 'gi');
    processedText = processedText.replace(regex, themed);
  });
  
  return <span className={className}>{processedText}</span>;
};

// Unified Visual Effects
interface VisualEffectProps {
  children: React.ReactNode;
  className?: string;
  type?: 'glow' | 'neon' | 'gradient' | 'shadow';
}

export const VisualEffect: React.FC<VisualEffectProps> = ({ 
  children, 
  className = '',
  type = 'glow'
}) => {
  const { config } = useDesign();
  
  const getEffectStyles = () => {
    const styles: React.CSSProperties = {};
    
    if (type === 'glow' && config.effects.glow) {
      styles.textShadow = `0 0 10px ${config.colors.primary}50`;
      styles.boxShadow = `0 0 20px ${config.colors.primary}30`;
    }
    
    if (type === 'neon' && config.effects.neon) {
      styles.textShadow = `0 0 5px ${config.colors.accent}, 0 0 10px ${config.colors.accent}, 0 0 15px ${config.colors.accent}`;
      styles.boxShadow = `0 0 10px ${config.colors.accent}50, 0 0 20px ${config.colors.accent}30`;
    }
    
    if (type === 'gradient' && config.effects.gradient) {
      styles.background = `linear-gradient(135deg, ${config.colors.primary}20, ${config.colors.secondary}20)`;
    }
    
    if (type === 'shadow' && config.effects.shadows) {
      styles.boxShadow = `0 4px 6px -1px ${config.colors.background}50, 0 2px 4px -1px ${config.colors.background}30`;
    }
    
    return styles;
  };
  
  return (
    <div className={className} style={getEffectStyles()}>
      {children}
    </div>
  );
};
