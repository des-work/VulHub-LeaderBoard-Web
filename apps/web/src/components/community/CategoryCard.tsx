import React, { useState } from 'react';
import { COLORS, CATEGORY_CARD, SPACING } from '../../lib/community/config';
import { createGlowStyle, createHoverEffect } from '../../lib/community/utils';

interface CategoryCardProps {
  icon: string;
  name: string;
  description: string;
  count: number;
  onClick?: () => void;
  className?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  icon,
  name,
  description,
  count,
  onClick,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`cursor-pointer font-mono transition-all ${className}`}
      style={{
        padding: CATEGORY_CARD.sizing.padding,
        borderRadius: CATEGORY_CARD.sizing.borderRadius,
        borderWidth: CATEGORY_CARD.sizing.borderWidth,
        borderColor: isHovered ? CATEGORY_CARD.colors.borderHover : CATEGORY_CARD.colors.border,
        borderStyle: 'solid',
        backgroundColor: isHovered ? `${COLORS.matrix.dim}10` : 'transparent',
        ...(() => {
          const hoverEffect = createHoverEffect({
            translateX: isHovered ? CATEGORY_CARD.effects.hoverTranslate : '0',
            glow: isHovered ? COLORS.glow.matrix : undefined,
          });
          // Remove borderColor from hoverEffect to avoid duplication
          const { borderColor, ...rest } = hoverEffect;
          return rest;
        })(),
      }}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className="text-2xl flex-shrink-0"
          style={{
            color: isHovered ? COLORS.matrix.bright : CATEGORY_CARD.colors.icon,
            filter: isHovered ? `drop-shadow(0 0 8px ${COLORS.matrix.primary})` : 'none',
            transition: CATEGORY_CARD.effects.transition,
          }}
        >
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <h3
              className="font-bold text-lg truncate"
              style={{
                color: isHovered ? CATEGORY_CARD.colors.textHover : CATEGORY_CARD.colors.text,
                textShadow: isHovered ? `0 0 10px ${COLORS.matrix.primary}` : 'none',
                transition: CATEGORY_CARD.effects.transition,
              }}
            >
              {name}
            </h3>

            {/* Count Badge */}
            <div
              className="px-2 py-0.5 rounded text-xs font-bold flex-shrink-0"
              style={{
                backgroundColor: isHovered ? COLORS.matrix.primary : `${COLORS.matrix.dim}40`,
                color: isHovered ? COLORS.background.black : COLORS.text.secondary,
                boxShadow: isHovered ? `0 0 10px ${COLORS.matrix.primary}` : 'none',
                transition: CATEGORY_CARD.effects.transition,
              }}
            >
              {count}
            </div>
          </div>

          <p
            className="text-sm mt-1 leading-relaxed"
            style={{
              color: COLORS.text.muted,
            }}
          >
            {description}
          </p>
        </div>

        {/* Hover Arrow Indicator */}
        {isHovered && (
          <div
            className="flex-shrink-0 text-lg font-bold animate-pulse"
            style={{
              color: COLORS.matrix.bright,
              textShadow: `0 0 10px ${COLORS.matrix.primary}`,
            }}
          >
            →
          </div>
        )}
      </div>

      {/* Bottom border glow on hover */}
      {isHovered && (
        <div
          className="mt-3 h-px"
          style={{
            background: `linear-gradient(to right, ${COLORS.matrix.primary}, ${COLORS.cyan.primary}, ${COLORS.matrix.primary})`,
            boxShadow: `0 0 10px ${COLORS.matrix.primary}`,
          }}
        />
      )}
    </div>
  );
};

