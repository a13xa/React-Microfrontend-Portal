import React, { forwardRef } from 'react';
import { tokens } from '../tokens';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = false, style, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    const containerStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      width: fullWidth ? '100%' : 'auto',
    };

    const inputStyle: React.CSSProperties = {
      padding: '8px 12px',
      fontSize: tokens.fontSize.md,
      borderRadius: tokens.borderRadius.md,
      border: `1px solid ${error ? tokens.colors.danger : tokens.colors.border}`,
      outline: 'none',
      transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
      width: '100%',
      boxSizing: 'border-box',
      lineHeight: '22px',
      backgroundColor: tokens.colors.surfaceRaised,
      color: tokens.colors.text,
      ...style,
    };

    const labelStyle: React.CSSProperties = {
      fontSize: tokens.fontSize.sm,
      fontWeight: tokens.fontWeight.medium,
      color: tokens.colors.textSecondary,
    };

    const errorStyle: React.CSSProperties = {
      fontSize: tokens.fontSize.xs,
      color: tokens.colors.danger,
    };

    return (
      <div style={containerStyle}>
        {label && <label htmlFor={inputId} style={labelStyle}>{label}</label>}
        <input ref={ref} id={inputId} style={inputStyle} {...props} />
        {error && <span role="alert" style={errorStyle}>{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
