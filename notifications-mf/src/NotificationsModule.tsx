import React from 'react';
import { Spinner, Button, Badge, tokens } from '@portal/shared-ui';
import { useNotifications } from './useNotifications';
import { formatTimestamp } from './utils/formatters';
import { Notification } from './types';

function getUserRole(): string {
  try {
    const stored = localStorage.getItem('portal_auth');
    if (!stored) return 'viewer';
    const parsed = JSON.parse(stored) as { user: { role: string } };
    return parsed.user.role;
  } catch {
    return 'viewer';
  }
}

const typeBadgeVariant: Record<Notification['type'], 'info' | 'warning' | 'danger' | 'success'> = {
  info: 'info',
  warning: 'warning',
  error: 'danger',
  success: 'success',
};

interface NotificationItemProps {
  notification: Notification;
  isLast: boolean;
  canManage: boolean;
  onMarkRead: (id: string) => void;
}

const NotificationItem = React.memo<NotificationItemProps>(
  ({ notification, isLast, canManage, onMarkRead }) => (
    <div
      data-testid={`notification-${notification.id}`}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: `14px ${tokens.spacing.lg}`,
        borderBottom: isLast ? 'none' : `1px solid ${tokens.colors.borderSubtle}`,
        borderLeft: notification.isRead ? '3px solid transparent' : `3px solid ${tokens.colors.accent}`,
        backgroundColor: notification.isRead ? tokens.colors.surface : tokens.colors.accentSubtle,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: tokens.spacing.xs }}>
          <span style={{ fontSize: tokens.fontSize.md, color: tokens.colors.text, fontWeight: notification.isRead ? tokens.fontWeight.normal : tokens.fontWeight.medium, lineHeight: 1.4 }}>
            {notification.title}
          </span>
          <Badge variant={typeBadgeVariant[notification.type]} size="sm">
            {notification.type === 'error' ? 'Error' : notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
          </Badge>
        </div>
        <p style={{ fontSize: tokens.fontSize.sm, color: tokens.colors.textSecondary, margin: 0, lineHeight: 1.6 }}>
          {notification.message}
        </p>
        <span style={{ fontSize: tokens.fontSize.xs, color: tokens.colors.textTertiary, marginTop: tokens.spacing.xs, display: 'inline-block' }}>
          {formatTimestamp(notification.timestamp)}
        </span>
      </div>
      {!notification.isRead && canManage && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => void onMarkRead(notification.id)}
          aria-label={`Mark notification ${notification.id} as read`}
          style={{ flexShrink: 0, marginLeft: tokens.spacing.md, marginTop: '2px' }}
        >
          Mark read
        </Button>
      )}
    </div>
  )
);

NotificationItem.displayName = 'NotificationItem';

const NotificationsModule: React.FC = () => {
  const { notifications, isLoading, error, markAsRead, markAllAsRead, unreadCount } = useNotifications();
  const role = getUserRole();
  const canManage = role === 'admin' || role === 'operator';
  const isAdmin = role === 'admin';

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: tokens.spacing.xxl }}>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div role="alert" style={{ color: tokens.colors.danger, fontSize: tokens.fontSize.md }}>{error}</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: tokens.spacing.xl }}>
        <h2 style={{ fontSize: tokens.fontSize.xl, fontWeight: tokens.fontWeight.semibold, color: tokens.colors.text, margin: 0, letterSpacing: '-0.02em', lineHeight: 1.3 }}>
          Notifications
          {unreadCount > 0 && (
            <span aria-live="polite" style={{ fontSize: tokens.fontSize.sm, color: tokens.colors.textTertiary, fontWeight: tokens.fontWeight.normal, marginLeft: '10px' }}>
              {unreadCount} unread
            </span>
          )}
        </h2>
        {isAdmin && unreadCount > 0 && (
          <Button variant="secondary" size="sm" onClick={markAllAsRead}>
            Mark all read
          </Button>
        )}
      </div>

      <div
        style={{
          border: `1px solid ${tokens.colors.border}`,
          borderRadius: tokens.borderRadius.lg,
          overflow: 'hidden',
          backgroundColor: tokens.colors.surface,
        }}
      >
        {notifications.map((notification, index) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            isLast={index === notifications.length - 1}
            canManage={canManage}
            onMarkRead={markAsRead}
          />
        ))}
        {notifications.length === 0 && (
          <p style={{ textAlign: 'center', color: tokens.colors.textTertiary, padding: tokens.spacing.xxl, fontSize: tokens.fontSize.md }}>
            No notifications
          </p>
        )}
      </div>
    </div>
  );
};

export default NotificationsModule;
