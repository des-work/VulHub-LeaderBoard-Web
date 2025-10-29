import React from 'react';

interface HackerTerminologyProps {
  children: React.ReactNode;
  className?: string;
}

// Hacker/90s terminology mapping
const hackerTerms: Record<string, string> = {
  // User/Player terms
  'user': 'hacker',
  'player': 'hacker',
  'student': 'script kiddie',
  'participant': 'coder',
  'competitor': 'elite',
  
  // Achievement terms
  'achievement': 'hack',
  'badge': 'flag',
  'score': 'rep',
  'points': 'credits',
  'rank': 'level',
  'leaderboard': 'scoreboard',
  'leader': 'top hacker',
  'winner': 'champion',
  
  // Challenge terms
  'challenge': 'ctf',
  'mission': 'mission',
  'task': 'task',
  'exercise': 'drill',
  'problem': 'puzzle',
  'solution': 'exploit',
  'submit': 'upload',
  'submission': 'upload',
  
  // Security terms
  'security': 'sec',
  'vulnerability': 'vuln',
  'exploit': 'sploit',
  'attack': 'pwn',
  'defense': 'def',
  'protection': 'shield',
  'firewall': 'wall',
  'encryption': 'crypto',
  'password': 'pass',
  'authentication': 'auth',
  
  // Platform terms
  'platform': 'system',
  'system': 'box',
  'application': 'app',
  'website': 'site',
  'page': 'page',
  'dashboard': 'console',
  'profile': 'profile',
  'settings': 'config',
  'login': 'login',
  'logout': 'logout',
  'register': 'signup',
  'sign up': 'signup',
  'sign in': 'login',
  
  // Action terms
  'start': 'init',
  'begin': 'start',
  'continue': 'cont',
  'finish': 'done',
  'complete': 'comp',
  'success': 'win',
  'failure': 'fail',
  'error': 'err',
  'warning': 'warn',
  'info': 'info',
  
  // Time terms
  'time': 'time',
  'date': 'date',
  'today': 'today',
  'yesterday': 'yesterday',
  'tomorrow': 'tomorrow',
  'week': 'week',
  'month': 'month',
  'year': 'year',
  
  // Status terms
  'active': 'live',
  'inactive': 'dead',
  'pending': 'pending',
  'approved': 'ok',
  'rejected': 'denied',
  'completed': 'done',
  'in progress': 'running',
  'new': 'fresh',
  'old': 'old',
  'recent': 'recent',
};

export const HackerTerminology: React.FC<HackerTerminologyProps> = ({ 
  children, 
  className = '' 
}) => {
  const text = typeof children === 'string' ? children : '';
  
  // Replace terms with hacker equivalents
  let hackerText = text;
  Object.entries(hackerTerms).forEach(([modern, hacker]) => {
    const regex = new RegExp(`\\b${modern}\\b`, 'gi');
    hackerText = hackerText.replace(regex, hacker);
  });
  
  return <span className={className}>{hackerText}</span>;
};

// Hook for getting hacker terminology
export const useHackerTerms = () => {
  const getTerm = (modernTerm: string): string => {
    return hackerTerms[modernTerm.toLowerCase()] || modernTerm;
  };
  
  return { getTerm };
};
