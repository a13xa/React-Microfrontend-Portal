import React from 'react';
import { tokens } from '../tokens';

export interface CardProps {
  title?: string;
  children: React.ReactNode;
  padding?: keyof typeof tokens.spacing;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  title,
  children,
  padding = 'lg',
  style,
}) => {
  const cardStyle: React.CSSProperties = {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.borderRadius.lg,
    border: `1px solid ${tokens.colors.border}`,
    padding: tokens.spacing[padding],
    ...style,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: tokens.fontSize.lg,
    fontWeight: tokens.fontWeight.semibold,
    color: tokens.colors.text,
    margin: 0,
    paddingBottom: tokens.spacing.md,
    borderBottom: `1px solid ${tokens.colors.borderSubtle}`,
  };

  return (
    <div style={cardStyle}>
      {title && <h3 style={titleStyle}>{title}</h3>}
      <div style={{ marginTop: title ? tokens.spacing.md : 0 }}>{children}</div>
    </div>
  );
};
