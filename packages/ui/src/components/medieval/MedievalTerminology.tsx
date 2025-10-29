import React from 'react';
import { useTheme } from '../../themes';

interface MedievalTerminologyProps {
  children: React.ReactNode;
  className?: string;
}

// Medieval terminology mapping
const medievalTerms: Record<string, string> = {
  // User/Player terms
  'user': 'knight',
  'player': 'knight',
  'student': 'squire',
  'participant': 'warrior',
  'competitor': 'champion',
  
  // Achievement terms
  'achievement': 'quest',
  'badge': 'crest',
  'score': 'honor',
  'points': 'honor points',
  'rank': 'standing',
  'leaderboard': 'hall of champions',
  'leader': 'champion',
  'winner': 'victor',
  
  // Challenge terms
  'challenge': 'quest',
  'mission': 'quest',
  'task': 'quest',
  'exercise': 'training',
  'problem': 'riddle',
  'solution': 'answer',
  'submit': 'present',
  'submission': 'presentation',
  
  // Security terms
  'security': 'defense',
  'vulnerability': 'weakness',
  'exploit': 'strategy',
  'attack': 'assault',
  'defense': 'fortification',
  'protection': 'ward',
  'firewall': 'barrier',
  'encryption': 'code',
  'password': 'secret',
  'authentication': 'verification',
  
  // Platform terms
  'platform': 'realm',
  'system': 'kingdom',
  'application': 'artifact',
  'website': 'scroll',
  'page': 'parchment',
  'dashboard': 'command center',
  'profile': 'heraldry',
  'settings': 'configuration',
  'login': 'enter',
  'logout': 'depart',
  'register': 'enlist',
  'sign up': 'enlist',
  'sign in': 'enter',
  
  // Action terms
  'start': 'begin',
  'begin': 'commence',
  'continue': 'proceed',
  'finish': 'complete',
  'complete': 'accomplish',
  'success': 'victory',
  'failure': 'defeat',
  'error': 'mishap',
  'warning': 'caution',
  'info': 'tidings',
  
  // Time terms
  'time': 'hour',
  'date': 'day',
  'today': 'this day',
  'yesterday': 'yesterday',
  'tomorrow': 'morrow',
  'week': 'seven days',
  'month': 'moon',
  'year': 'season',
  
  // Status terms
  'active': 'vigilant',
  'inactive': 'dormant',
  'pending': 'awaiting',
  'approved': 'sanctioned',
  'rejected': 'denied',
  'completed': 'accomplished',
  'in progress': 'in progress',
  'new': 'fresh',
  'old': 'ancient',
  'recent': 'recent',
};

export const MedievalTerminology: React.FC<MedievalTerminologyProps> = ({ 
  children, 
  className = '' 
}) => {
  const { theme } = useTheme();
  
  // Only apply medieval terminology when medieval theme is active
  if (theme !== 'medieval') {
    return <span className={className}>{children}</span>;
  }
  
  const text = typeof children === 'string' ? children : '';
  
  // Replace terms with medieval equivalents
  let medievalText = text;
  Object.entries(medievalTerms).forEach(([modern, medieval]) => {
    const regex = new RegExp(`\\b${modern}\\b`, 'gi');
    medievalText = medievalText.replace(regex, medieval);
  });
  
  return <span className={className}>{medievalText}</span>;
};

// Hook for getting medieval terminology
export const useMedievalTerms = () => {
  const { theme } = useTheme();
  
  const getTerm = (modernTerm: string): string => {
    if (theme !== 'medieval') {
      return modernTerm;
    }
    return medievalTerms[modernTerm.toLowerCase()] || modernTerm;
  };
  
  return { getTerm, isMedieval: theme === 'medieval' };
};
