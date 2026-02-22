import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { tokens, Button, Badge, usePortalEvent } from '@portal/shared-ui';
import { useAuth } from '../auth/AuthProvider';

const routeLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/profile': 'Profile',
  '/notifications': 'Notifications',
  '/reports': 'Reports',
};

const navLinkStyle = (isActive: boolean): React.CSSProperties => ({
  padding: '8px 14px',
  color: isActive ? tokens.colors.accent : tokens.colors.textSecondary,
  textDecoration: 'none',
  fontSize: tokens.fontSize.sm,
  fontWeight: isActive ? tokens.fontWeight.medium : tokens.fontWeight.normal,
  borderBottom: isActive ? `2px solid ${tokens.colors.accent}` : '2px solid transparent',
  marginBottom: '-1px',
  transition: 'color 0.15s ease',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
});

export const Layout: React.FC = () => {
  const { user, logout, hasRole } = useAuth();
  const location = useLocation();
  void routeLabels[location.pathname];
  const [unreadCount, setUnreadCount] = useState(0);

  usePortalEvent('NOTIFICATION_COUNT_CHANGE', (payload) => {
    setUnreadCount(payload.unreadCount);
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: tokens.colors.bg, display: 'flex', flexDirection: 'column' }}>
      <a
        href="#main-content"
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 'auto',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
        onFocus={(e) => {
          e.currentTarget.style.position = 'fixed';
          e.currentTarget.style.left = tokens.spacing.md;
          e.currentTarget.style.top = tokens.spacing.md;
          e.currentTarget.style.width = 'auto';
          e.currentTarget.style.height = 'auto';
          e.currentTarget.style.overflow = 'visible';
          e.currentTarget.style.zIndex = '9999';
          e.currentTarget.style.padding = `${tokens.spacing.sm} ${tokens.spacing.md}`;
          e.currentTarget.style.backgroundColor = tokens.colors.accent;
          e.currentTarget.style.color = tokens.colors.textInverse;
          e.currentTarget.style.borderRadius = tokens.borderRadius.md;
          e.currentTarget.style.fontSize = tokens.fontSize.sm;
          e.currentTarget.style.fontWeight = String(tokens.fontWeight.medium);
          e.currentTarget.style.textDecoration = 'none';
        }}
        onBlur={(e) => {
          e.currentTarget.style.position = 'absolute';
          e.currentTarget.style.left = '-9999px';
          e.currentTarget.style.width = '1px';
          e.currentTarget.style.height = '1px';
          e.currentTarget.style.overflow = 'hidden';
        }}
      >
        Skip to main content
      </a>
      <header
        style={{
          backgroundColor: tokens.colors.surface,
          borderBottom: `1px solid ${tokens.colors.border}`,
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: '1140px',
            margin: '0 auto',
            padding: `0 ${tokens.spacing.xl}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '52px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.xl }}>
            <span
              style={{
                color: tokens.colors.accent,
                fontSize: tokens.fontSize.md,
                fontWeight: tokens.fontWeight.semibold,
                letterSpacing: '-0.02em',
              }}
            >
              Portal
            </span>
            <nav style={{ display: 'flex', gap: tokens.spacing.xs, height: '52px', alignItems: 'center' }}>
              <NavLink to="/dashboard" style={({ isActive }) => navLinkStyle(isActive)}>
                Dashboard
              </NavLink>
              <NavLink to="/profile" style={({ isActive }) => navLinkStyle(isActive)}>
                Profile
              </NavLink>
              <NavLink to="/notifications" style={({ isActive }) => navLinkStyle(isActive)}>
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="danger" size="sm">
                    {unreadCount}
                  </Badge>
                )}
              </NavLink>
              {hasRole('operator') && (
                <NavLink to="/reports" style={({ isActive }) => navLinkStyle(isActive)}>
                  Reports
                </NavLink>
              )}
            </nav>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.md }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: tokens.fontSize.sm, color: tokens.colors.text, fontWeight: tokens.fontWeight.medium, lineHeight: 1.3 }}>
                {user?.name}
              </div>
              <div style={{ fontSize: tokens.fontSize.xs, color: tokens.colors.textTertiary, textTransform: 'capitalize', lineHeight: 1.3 }}>
                {user?.role}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              style={{ color: tokens.colors.textSecondary }}
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main
        id="main-content"
        style={{
          padding: `${tokens.spacing.xl} ${tokens.spacing.xl} ${tokens.spacing.xxl}`,
          maxWidth: '1140px',
          margin: '0 auto',
          width: '100%',
          flex: 1,
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};
