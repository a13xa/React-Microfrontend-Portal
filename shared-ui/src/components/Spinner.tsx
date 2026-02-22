import React from 'react';
import { tokens } from '../tokens';

interface SpinnerProps {
  size?: number;
  color?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 22,
  color = tokens.colors.accent,
}) => {
  const spinnerStyle: React.CSSProperties = {
    width: size,
    height: size,
    border: `2px solid ${tokens.colors.borderSubtle}`,
    borderTopColor: color,
    borderRadius: '50%',
    animation: 'portal-spin 0.7s linear infinite',
    display: 'inline-block',
  };

  return (
    <>
      <style>{`@keyframes portal-spin { to { transform: rotate(360deg); } }`}</style>
      <div style={spinnerStyle} role="status" aria-label="Loading" />
    </>
  );
};
