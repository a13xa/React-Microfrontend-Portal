import React, { useCallback, useRef } from 'react';
import { tokens } from '../tokens';

export interface Tab {
  id: string;
  label: string;
  count?: number;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  style?: React.CSSProperties;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange, style }) => {
  const tabListRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const currentIndex = tabs.findIndex((t) => t.id === activeTab);
      let nextIndex = -1;

      if (e.key === 'ArrowRight') {
        nextIndex = (currentIndex + 1) % tabs.length;
      } else if (e.key === 'ArrowLeft') {
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      } else if (e.key === 'Home') {
        nextIndex = 0;
      } else if (e.key === 'End') {
        nextIndex = tabs.length - 1;
      }

      if (nextIndex >= 0) {
        e.preventDefault();
        onTabChange(tabs[nextIndex]!.id);
        const buttons = tabListRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
        buttons?.[nextIndex]?.focus();  // eslint-disable-line @typescript-eslint/no-unnecessary-condition
      }
    },
    [tabs, activeTab, onTabChange]
  );

  return (
    <div
      ref={tabListRef}
      role="tablist"
      onKeyDown={handleKeyDown}
      style={{
        display: 'flex',
        gap: tokens.spacing.xs,
        borderBottom: `1px solid ${tokens.colors.border}`,
        ...style,
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onTabChange(tab.id)}
            style={{
              padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
              fontSize: tokens.fontSize.sm,
              fontWeight: isActive ? tokens.fontWeight.medium : tokens.fontWeight.normal,
              color: isActive ? tokens.colors.accent : tokens.colors.textSecondary,
              background: 'none',
              border: 'none',
              borderBottom: isActive
                ? `2px solid ${tokens.colors.accent}`
                : '2px solid transparent',
              marginBottom: '-1px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color 0.15s ease',
              lineHeight: '20px',
            }}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span
                style={{
                  fontSize: tokens.fontSize.xs,
                  backgroundColor: isActive ? tokens.colors.accentSubtle : tokens.colors.surfaceRaised,
                  color: isActive ? tokens.colors.accent : tokens.colors.textTertiary,
                  padding: '1px 7px',
                  borderRadius: tokens.borderRadius.full,
                  fontWeight: tokens.fontWeight.medium,
                  lineHeight: '16px',
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
