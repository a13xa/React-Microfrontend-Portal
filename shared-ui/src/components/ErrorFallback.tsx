import React from 'react';
import { tokens } from '../tokens';
import { Button } from './Button';

export interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary?: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacing.xxl,
    textAlign: 'center',
    gap: tokens.spacing.md,
  };

  return (
    <div role="alert" style={containerStyle}>
      <h2 style={{ color: tokens.colors.text, margin: 0, fontSize: tokens.fontSize.xl, fontWeight: tokens.fontWeight.semibold }}>Something went wrong</h2>
      <p style={{ color: tokens.colors.textSecondary, margin: 0, fontSize: tokens.fontSize.md, lineHeight: 1.6 }}>{error.message}</p>
      {resetErrorBoundary && (
        <Button variant="secondary" onClick={resetErrorBoundary}>
          Try Again
        </Button>
      )}
    </div>
  );
};
