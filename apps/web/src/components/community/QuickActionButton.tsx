import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { COLORS, QUICK_ACTION_BUTTON, SPACING } from '../../lib/community/config';
import { createGlowStyle, createAnimatedBorder } from '../../lib/community/utils';

interface QuickActionButtonProps {
  icon?: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'warning';
  disabled?: boolean;
  className?: string;
}

export const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  variant = 'default',
  disabled = false,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const getVariantColors = () => {
    switch (variant) {
      case 'primary':
        return {
          text: COLORS.matrix.bright,
          border: COLORS.matrix.primary,
          bg: COLORS.matrix.dim,
          glow: COLORS.glow.matrix,
        };
      case 'warning':
        return {
          text: COLORS.status.warning,
          border: COLORS.status.warning,
          bg: '#ffff0020',
          glow: 'rgba(255, 255, 0, 0.5)',
        };
      default:
        return {
          text: QUICK_ACTION_BUTTON.colors.text,
          border: QUICK_ACTION_BUTTON.colors.border,
          bg: QUICK_ACTION_BUTTON.colors.background,
          glow: COLORS.glow.matrix,
        };
    }
  };

  const colors = getVariantColors();

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      disabled={disabled}
      className={`flex items-center gap-2 font-mono text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{
        padding: QUICK_ACTION_BUTTON.sizing.padding,
        borderRadius: QUICK_ACTION_BUTTON.sizing.borderRadius,
        borderWidth: QUICK_ACTION_BUTTON.sizing.borderWidth,
        borderColor: isHovered && !disabled ? colors.border : QUICK_ACTION_BUTTON.colors.border,
        backgroundColor: isHovered && !disabled ? `${colors.bg}30` : colors.bg,
        color: isHovered && !disabled ? colors.text : QUICK_ACTION_BUTTON.colors.text,
        ...createGlowStyle(colors.glow, isHovered && !disabled ? 'sm' : undefined as any),
        transform: isActive && !disabled ? 'scale(0.95)' : isHovered && !disabled ? 'scale(1.02)' : 'scale(1)',
        transition: QUICK_ACTION_BUTTON.effects.transition,
      }}
    >
      {Icon && (
        <Icon
          size={Number(QUICK_ACTION_BUTTON.sizing.iconSize.replace('rem', '')) * 16}
          style={{
            color: isHovered && !disabled ? colors.text : QUICK_ACTION_BUTTON.colors.icon,
            filter: isHovered && !disabled ? `drop-shadow(0 0 6px ${colors.glow})` : 'none',
          }}
        />
      )}
      <span>{label}</span>

      {/* Active indicator pulse */}
      {isHovered && !disabled && (
        <div
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{
            backgroundColor: colors.text,
            boxShadow: `0 0 10px ${colors.glow}`,
          }}
        />
      )}
    </button>
  );
};

