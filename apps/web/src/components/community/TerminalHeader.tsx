import React from 'react';
import { ArrowLeft, Terminal, Users, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { COLORS, TERMINAL_HEADER, ANIMATIONS, SPACING } from '../../lib/community/config';
import { createGlowStyle, createAnimatedBorder } from '../../lib/community/utils';

interface TerminalHeaderProps {
  onlineUsers: number;
  showWelcome: boolean;
  showActivityIndicator?: boolean;
  className?: string;
}

export const TerminalHeader: React.FC<TerminalHeaderProps> = ({ 
  onlineUsers, 
  showWelcome,
  showActivityIndicator = true,
  className = '',
}) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className={`relative z-10 border-b backdrop-blur-sm transition-all duration-500 ${
        showWelcome ? 'opacity-0 translate-y-[-10px]' : 'opacity-100 translate-y-0'
      } ${className}`}
      style={{
        backgroundColor: TERMINAL_HEADER.colors.background,
        borderColor: TERMINAL_HEADER.colors.border,
        height: TERMINAL_HEADER.sizing.height,
        ...createGlowStyle(COLORS.matrix.dim, 'sm'),
      }}
    >
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Left side - Exit button and title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="flex items-center gap-2 px-4 py-2 rounded font-mono text-sm transition-all duration-300"
              style={{
                color: TERMINAL_HEADER.colors.text,
                ...createAnimatedBorder(
                  isHovered ? COLORS.matrix.primary : TERMINAL_HEADER.colors.border,
                  '1px'
                ),
                backgroundColor: isHovered ? `${COLORS.matrix.dim}20` : 'transparent',
              }}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Exit Terminal</span>
            </button>

            <div className="flex items-center gap-3 pl-4 border-l" style={{ borderColor: TERMINAL_HEADER.colors.border }}>
              <Terminal
                className="h-5 w-5 animate-pulse"
                style={{ 
                  color: TERMINAL_HEADER.colors.icon,
                  filter: `drop-shadow(0 0 8px ${COLORS.glow.matrix})`,
                }}
              />
              <span
                className="text-lg font-bold font-mono tracking-wide"
                style={{ 
                  color: TERMINAL_HEADER.colors.icon,
                  textShadow: `0 0 10px ${COLORS.glow.matrix}`,
                }}
              >
                VulHub Community Terminal
              </span>
            </div>
          </div>

          {/* Right side - Status indicators */}
          <div className="flex items-center gap-6">
            {/* Activity Indicator */}
            {showActivityIndicator && (
              <div 
                className="flex items-center gap-2 text-sm font-mono px-3 py-1 rounded"
                style={{
                  color: COLORS.cyan.primary,
                  backgroundColor: `${COLORS.cyan.dark}15`,
                  border: `1px solid ${COLORS.cyan.dark}`,
                }}
              >
                <Activity className="h-4 w-4 animate-pulse" />
                <span>Active</span>
              </div>
            )}

            {/* Online Users */}
            <div 
              className="flex items-center gap-2 text-sm font-mono px-3 py-1 rounded"
              style={{
                color: TERMINAL_HEADER.colors.text,
                backgroundColor: `${COLORS.matrix.dim}15`,
                border: `1px solid ${TERMINAL_HEADER.colors.border}`,
              }}
            >
              <Users className="h-4 w-4" />
              <span>
                <span style={{ color: COLORS.matrix.bright }}>{onlineUsers}</span> online
              </span>
            </div>

            {/* System Status Dot */}
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{
                  backgroundColor: COLORS.status.success,
                  boxShadow: `0 0 10px ${COLORS.status.success}`,
                }}
              />
              <span className="text-xs font-mono" style={{ color: COLORS.text.muted }}>
                ONLINE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle bottom glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(to right, transparent, ${COLORS.matrix.primary}, transparent)`,
          opacity: 0.5,
        }}
      />
    </div>
  );
};
