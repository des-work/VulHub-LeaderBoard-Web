import React from 'react';
import { COLORS, WELCOME_SCREEN, TYPOGRAPHY } from '../../lib/community/config';
import { createGlowStyle, createTextGlow, createGradient } from '../../lib/community/utils';

interface WelcomeScreenProps {
  typedText: string;
  isTyping: boolean;
  visible: boolean;
  className?: string;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  typedText,
  isTyping,
  visible,
  className = '',
}) => {
  if (!visible) return null;

  const lines = typedText.split('\n');
  const hasQuestion = lines.some(line => line.includes(WELCOME_SCREEN.text.question));

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}
      style={{ backgroundColor: COLORS.background.black }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-pulse"
            style={{
              backgroundColor: i % 2 === 0 ? COLORS.matrix.primary : COLORS.cyan.primary,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              boxShadow: `0 0 ${10 + Math.random() * 10}px currentColor`,
            }}
          />
        ))}
      </div>

      <div className="max-w-5xl w-full px-8 relative z-10">
        <div className="text-center space-y-8">
          {/* Main content card */}
          <div className="relative">
            {/* Outer glow effect */}
            <div
              className="absolute inset-0 blur-2xl animate-pulse rounded-lg"
              style={{
                ...createGradient(COLORS.matrix.primary, COLORS.cyan.primary, 'to right'),
                opacity: 0.3,
              }}
            />

            {/* Corner accents */}
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2" style={{ borderColor: COLORS.matrix.bright }} />
            <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2" style={{ borderColor: COLORS.cyan.primary }} />
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2" style={{ borderColor: COLORS.cyan.primary }} />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2" style={{ borderColor: COLORS.matrix.bright }} />

            {/* Content box */}
            <div
              className="relative rounded-lg shadow-2xl"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                borderWidth: WELCOME_SCREEN.sizing.borderWidth,
                borderColor: WELCOME_SCREEN.colors.border,
                padding: WELCOME_SCREEN.sizing.padding,
                ...createGlowStyle(WELCOME_SCREEN.colors.glow, 'xl'),
              }}
            >
              {/* Decorative top line */}
              <div className="flex items-center justify-center mb-8">
                <div className="h-px flex-1" style={{ backgroundColor: COLORS.matrix.dim }} />
                <div 
                  className="w-3 h-3 mx-4 rotate-45"
                  style={{
                    backgroundColor: COLORS.matrix.primary,
                    boxShadow: `0 0 15px ${COLORS.matrix.primary}`,
                  }}
                />
                <div className="h-px flex-1" style={{ backgroundColor: COLORS.matrix.dim }} />
              </div>

              {/* Typing text container */}
              <pre
                className="text-left whitespace-pre-wrap font-mono"
                style={{ 
                  color: WELCOME_SCREEN.colors.text,
                  lineHeight: TYPOGRAPHY.lineHeights.relaxed,
                }}
              >
                {lines.map((line, idx) => {
                  // Dramatic question styling
                  if (line.includes(WELCOME_SCREEN.text.question)) {
                    return (
                      <div 
                        key={idx} 
                        className="mt-10 mb-10 font-black text-center animate-pulse leading-tight py-6"
                        style={{
                          fontSize: WELCOME_SCREEN.sizing.questionSize,
                          ...createGradient(COLORS.matrix.primary, COLORS.cyan.primary, 'to right'),
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          ...createTextGlow(COLORS.glow.matrix_strong, 4),
                          letterSpacing: '0.02em',
                        }}
                      >
                        {line}
                      </div>
                    );
                  }
                  
                  // System messages (lines starting with >)
                  if (line.startsWith('>')) {
                    return (
                      <div
                        key={idx}
                        className="font-bold"
                        style={{
                          color: WELCOME_SCREEN.colors.accent,
                          fontSize: WELCOME_SCREEN.sizing.textSize,
                          textShadow: `0 0 10px ${COLORS.cyan.primary}`,
                          marginBottom: '0.5rem',
                        }}
                      >
                        {line}
                      </div>
                    );
                  }
                  
                  // Regular text
                  return (
                    <div
                      key={idx}
                      style={{
                        color: WELCOME_SCREEN.colors.text,
                        fontSize: WELCOME_SCREEN.sizing.textSize,
                      }}
                    >
                      {line || '\u00A0'}
                    </div>
                  );
                })}
              </pre>

              {/* Blinking cursor */}
              {isTyping && (
                <span
                  className="inline-block animate-pulse ml-1"
                  style={{ 
                    width: '12px',
                    height: '24px',
                    backgroundColor: COLORS.matrix.primary,
                    boxShadow: `0 0 10px ${COLORS.matrix.primary}`,
                  }}
                />
              )}

              {/* Decorative bottom line */}
              <div className="flex items-center justify-center mt-8">
                <div className="h-px flex-1" style={{ backgroundColor: COLORS.matrix.dim }} />
                <div 
                  className="w-2 h-2 mx-4 rounded-full animate-pulse"
                  style={{
                    backgroundColor: COLORS.cyan.primary,
                    boxShadow: `0 0 15px ${COLORS.cyan.primary}`,
                  }}
                />
                <div className="h-px flex-1" style={{ backgroundColor: COLORS.matrix.dim }} />
              </div>
            </div>
          </div>

          {/* Hint message */}
          {!isTyping && (
            <div
              className="flex items-center justify-center gap-3 text-sm font-mono animate-pulse"
              style={{ color: `${COLORS.text.primary}80` }}
            >
              <div 
                className="w-6 h-px"
                style={{ backgroundColor: COLORS.matrix.dim }}
              />
              <span>{WELCOME_SCREEN.text.hint}</span>
              <div 
                className="w-6 h-px"
                style={{ backgroundColor: COLORS.matrix.dim }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
