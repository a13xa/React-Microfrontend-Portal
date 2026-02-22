import React from 'react';
import { tokens } from '../tokens';

export interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const variantStyles: Record<string, { bg: string; color: string }> = {
  default: { bg: tokens.colors.surfaceRaised, color: tokens.colors.textSecondary },
  success: { bg: tokens.colors.successSubtle, color: tokens.colors.success },
  warning: { bg: tokens.colors.warningSubtle, color: tokens.colors.warning },
  danger: { bg: tokens.colors.dangerSubtle, color: tokens.colors.danger },
  info: { bg: tokens.colors.accentSubtle, color: tokens.colors.accent },
};

const sizeStyles: Record<string, React.CSSProperties> = {
  sm: { padding: '2px 8px', fontSize: tokens.fontSize.xs },
  md: { padding: '3px 10px', fontSize: tokens.fontSize.sm },
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'sm',
  children,
  style,
}) => {
  const colors = variantStyles[variant] ?? variantStyles.default!;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: tokens.borderRadius.full,
        fontWeight: tokens.fontWeight.medium,
        lineHeight: '18px',
        letterSpacing: '0.01em',
        whiteSpace: 'nowrap',
        backgroundColor: colors!.bg,
        color: colors!.color,
        ...sizeStyles[size],
        ...style,
      }}
    >
      {children}
    </span>
  );
};
