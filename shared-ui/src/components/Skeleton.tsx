import React from 'react';
import { tokens } from '../tokens';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rect' | 'circle';
  count?: number;
  style?: React.CSSProperties;
}

const shimmerKeyframes = `
@keyframes portal-shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}
`;

let styleInjected = false;

function injectShimmerStyle(): void {
  if (styleInjected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.textContent = shimmerKeyframes;
  document.head.appendChild(style);
  styleInjected = true;
}

const variantDefaults: Record<string, { height: string | number; borderRadius: string }> = {
  text: { height: 14, borderRadius: tokens.borderRadius.sm },
  rect: { height: 40, borderRadius: tokens.borderRadius.md },
  circle: { height: 40, borderRadius: tokens.borderRadius.full },
};

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height,
  variant = 'text',
  count = 1,
  style,
}) => {
  injectShimmerStyle();

  const defaults = variantDefaults[variant] ?? variantDefaults.text!;
  const resolvedHeight = height || defaults!.height;
  const resolvedWidth = variant === 'circle' ? resolvedHeight : width;

  const baseStyle: React.CSSProperties = {
    display: 'block',
    width: resolvedWidth,
    height: resolvedHeight,
    borderRadius: defaults!.borderRadius,
    backgroundColor: tokens.colors.surfaceRaised,
    backgroundImage: `linear-gradient(90deg, ${tokens.colors.surfaceRaised} 0px, ${tokens.colors.borderSubtle} 40px, ${tokens.colors.surfaceRaised} 80px)`,
    backgroundSize: '200px 100%',
    backgroundRepeat: 'no-repeat',
    animation: 'portal-shimmer 1.5s ease-in-out infinite',
    ...style,
  };

  if (count <= 1) {
    return <div style={baseStyle} aria-hidden="true" />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={baseStyle} aria-hidden="true" />
      ))}
    </div>
  );
};
