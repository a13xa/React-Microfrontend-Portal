import React from 'react';
import { tokens } from '../tokens';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const variantStyles: Record<string, React.CSSProperties> = {
  primary: {
    backgroundColor: tokens.colors.accent,
    color: tokens.colors.textInverse,
    border: `1px solid ${tokens.colors.accent}`,
  },
  secondary: {
    backgroundColor: tokens.colors.accentSubtle,
    color: tokens.colors.accent,
    border: `1px solid ${tokens.colors.border}`,
  },
  danger: {
    backgroundColor: tokens.colors.dangerSubtle,
    color: tokens.colors.danger,
    border: `1px solid transparent`,
  },
  ghost: {
    backgroundColor: 'transparent',
    color: tokens.colors.textSecondary,
    border: '1px solid transparent',
  },
};

const sizeStyles: Record<string, React.CSSProperties> = {
  sm: { padding: '5px 12px', fontSize: tokens.fontSize.sm },
  md: { padding: '8px 16px', fontSize: tokens.fontSize.sm },
  lg: { padding: '10px 20px', fontSize: tokens.fontSize.md },
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  style,
  ...props
}) => {
  const baseStyle: React.CSSProperties = {
    borderRadius: tokens.borderRadius.md,
    fontWeight: tokens.fontWeight.medium,
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled || isLoading ? 0.5 : 1,
    transition: 'background-color 0.15s ease, border-color 0.15s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    lineHeight: '20px',
    letterSpacing: '-0.01em',
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...style,
  };

  return (
    <button style={baseStyle} disabled={disabled || isLoading} {...props}>
      {isLoading && (
        <span
          aria-label="Loading"
          style={{
            width: 14,
            height: 14,
            border: '2px solid currentColor',
            borderRightColor: 'transparent',
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'portal-spin 0.6s linear infinite',
          }}
        />
      )}
      {children}
    </button>
  );
};
