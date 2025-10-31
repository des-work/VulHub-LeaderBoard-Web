import React, { useRef, useEffect } from 'react';
import { Terminal } from 'lucide-react';
import { COLORS, TERMINAL_WINDOW, SEARCH_INPUT, SPACING } from '../../lib/community/config';
import { createGlowStyle } from '../../lib/community/utils';

interface TerminalWindowProps {
  children: React.ReactNode;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isDisabled?: boolean;
  placeholder?: string;
  showPrompt?: boolean;
  autoScroll?: boolean;
  className?: string;
}

export const TerminalWindow: React.FC<TerminalWindowProps> = ({
  children,
  inputValue,
  onInputChange,
  onSubmit,
  isDisabled = false,
  placeholder = 'Enter command or search query...',
  showPrompt = true,
  autoScroll = true,
  className = '',
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (autoScroll && contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [children, autoScroll]);

  // Focus input on click anywhere in window
  const handleWindowClick = () => {
    if (!isDisabled) {
      inputRef.current?.focus();
    }
  };

  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{
        borderRadius: TERMINAL_WINDOW.sizing.borderRadius,
        borderWidth: TERMINAL_WINDOW.sizing.borderWidth,
        borderColor: TERMINAL_WINDOW.colors.border,
        backgroundColor: TERMINAL_WINDOW.colors.background,
        ...createGlowStyle(COLORS.glow.matrix, 'lg'),
      }}
    >
      {/* Terminal Header */}
      <div
        className="px-4 py-3 flex items-center justify-between border-b"
        style={{
          backgroundColor: TERMINAL_WINDOW.colors.headerBg,
          borderColor: COLORS.matrix.dim,
        }}
      >
        {/* Mac-style buttons */}
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: '#ff5f56' }}
          />
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: '#ffbd2e' }}
          />
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: '#27c93f' }}
          />
        </div>

        {/* Terminal Title */}
        <div className="flex items-center gap-2 text-sm font-mono" style={{ color: TERMINAL_WINDOW.colors.headerText }}>
          <Terminal size={14} />
          <span>user@vulhub:~$</span>
        </div>

        {/* Help Hint */}
        <div className="text-xs font-mono" style={{ color: COLORS.text.dim }}>
          Press 'help' for commands
        </div>
      </div>

      {/* Terminal Content */}
      <div
        ref={contentRef}
        onClick={handleWindowClick}
        className="p-6 overflow-y-auto scroll-smooth cursor-text"
        style={{
          minHeight: TERMINAL_WINDOW.sizing.minHeight,
          maxHeight: 'calc(100vh - 300px)',
          scrollbarWidth: 'thin',
          scrollbarColor: `${COLORS.matrix.dim} ${COLORS.background.black}`,
        }}
      >
        {children}
        
        {/* Blinking cursor when disabled */}
        {isDisabled && (
          <span
            className="inline-block animate-pulse ml-1"
            style={{
              width: SEARCH_INPUT.effects.cursorWidth,
              height: SEARCH_INPUT.effects.cursorHeight,
              backgroundColor: SEARCH_INPUT.colors.cursor,
              boxShadow: `0 0 10px ${SEARCH_INPUT.colors.cursor}`,
            }}
          />
        )}
      </div>

      {/* Input Area */}
      <div
        className="px-4 py-3 border-t"
        style={{
          backgroundColor: TERMINAL_WINDOW.colors.headerBg,
          borderColor: COLORS.matrix.dim,
        }}
      >
        <form onSubmit={onSubmit} className="flex items-center gap-2">
          {showPrompt && (
            <span
              className="font-mono font-bold flex-shrink-0"
              style={{ color: COLORS.matrix.primary }}
            >
              $
            </span>
          )}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            disabled={isDisabled}
            className="flex-1 bg-transparent outline-none font-mono disabled:opacity-50"
            style={{
              color: SEARCH_INPUT.colors.text,
              padding: SEARCH_INPUT.sizing.padding,
              fontSize: SEARCH_INPUT.sizing.fontSize,
            }}
            placeholder={placeholder}
            autoComplete="off"
            spellCheck="false"
          />
          {!isDisabled && (
            <span
              className="animate-pulse flex-shrink-0"
              style={{
                width: SEARCH_INPUT.effects.cursorWidth,
                height: SEARCH_INPUT.effects.cursorHeight,
                backgroundColor: SEARCH_INPUT.colors.cursor,
                boxShadow: `0 0 8px ${SEARCH_INPUT.colors.cursor}`,
                display: 'inline-block',
              }}
            />
          )}
        </form>
      </div>
    </div>
  );
};

