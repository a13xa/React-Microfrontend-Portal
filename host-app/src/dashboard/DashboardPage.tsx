import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokens, Tabs, Badge, Button, Skeleton } from '@portal/shared-ui';
import { useAuth } from '../auth/AuthProvider';
import { useDashboard } from './useDashboard';

function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const typeBadgeVariant: Record<string, 'info' | 'success' | 'warning' | 'danger'> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'danger',
};

export const DashboardPage: React.FC = () => {
  const { summary, activity, isLoading, liveUnreadCount } = useDashboard();
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('activity');

  const unread = useMemo(() => {
    if (!summary) return 0;
    return liveUnreadCount ?? summary.notifications.unread;
  }, [summary, liveUnreadCount]);

  const tabs = [
    { id: 'activity', label: 'Recent Activity', count: activity.length },
    { id: 'reports', label: 'Report Status' },
  ];

  if (isLoading) {
    return (
      <div>
        <Skeleton width="200px" height={26} style={{ marginBottom: '6px' }} />
        <Skeleton width="280px" height={14} style={{ marginBottom: tokens.spacing.xxl }} />
        <Skeleton width="100%" height={1} style={{ marginBottom: tokens.spacing.xl }} />
        <Skeleton width="80px" height={14} style={{ marginBottom: tokens.spacing.lg }} />
        <div style={{ display: 'flex', gap: '56px' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <Skeleton width="48px" height={28} style={{ marginBottom: '4px' }} />
              <Skeleton width="80px" height={12} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: tokens.spacing.lg }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{
              fontSize: tokens.fontSize.xl,
              fontWeight: tokens.fontWeight.semibold,
              color: tokens.colors.text,
              margin: 0,
              letterSpacing: '-0.02em',
              lineHeight: 1.3,
            }}>
              Welcome back, {user?.name?.split(' ')[0]}
            </h2>
            <p style={{
              margin: 0,
              marginTop: '2px',
              fontSize: tokens.fontSize.sm,
              color: tokens.colors.textTertiary,
            }}>
              Here&apos;s what&apos;s happening today.
            </p>
          </div>
          <div style={{ display: 'flex', gap: tokens.spacing.sm, marginTop: '4px' }}>
            {hasRole('operator') && (
              <Button variant="secondary" size="sm" onClick={() => navigate('/reports')}>
                Reports
              </Button>
            )}
            <Button variant="secondary" size="sm" onClick={() => navigate('/notifications')}>
              Notifications
            </Button>
          </div>
        </div>
      </div>

      <div style={{ height: '1px', backgroundColor: tokens.colors.borderSubtle, marginBottom: tokens.spacing.xl }} />

      <section style={{ marginBottom: tokens.spacing.xl }}>
        <div style={{
          fontSize: tokens.fontSize.xs,
          color: tokens.colors.textTertiary,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.06em',
          fontWeight: tokens.fontWeight.medium,
          marginBottom: tokens.spacing.md,
        }}>
          Overview
        </div>
        <div style={{ display: 'flex', gap: '48px' }}>
          <div>
            <div style={{
              fontSize: '28px',
              fontWeight: tokens.fontWeight.semibold,
              color: unread > 5 ? tokens.colors.warning : tokens.colors.text,
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}>
              {unread}
            </div>
            <div style={{ fontSize: tokens.fontSize.sm, color: tokens.colors.textSecondary, marginTop: '6px' }}>
              Unread notifications
            </div>
          </div>
          <div>
            <div style={{
              fontSize: '28px',
              fontWeight: tokens.fontWeight.semibold,
              color: tokens.colors.text,
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}>
              {summary?.system.activeUsers.toLocaleString()}
            </div>
            <div style={{ fontSize: tokens.fontSize.sm, color: tokens.colors.textSecondary, marginTop: '6px' }}>
              Active users
            </div>
          </div>
          <div>
            <div style={{
              fontSize: '28px',
              fontWeight: tokens.fontWeight.semibold,
              color: summary && summary.system.pendingApprovals > 20 ? tokens.colors.warning : tokens.colors.text,
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}>
              {summary?.system.pendingApprovals}
            </div>
            <div style={{ fontSize: tokens.fontSize.sm, color: tokens.colors.textSecondary, marginTop: '6px' }}>
              Pending approvals
            </div>
          </div>
          <div>
            <div style={{
              fontSize: '28px',
              fontWeight: tokens.fontWeight.semibold,
              color: tokens.colors.success,
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}>
              {summary?.system.complianceScore}%
            </div>
            <div style={{ fontSize: tokens.fontSize.sm, color: tokens.colors.textSecondary, marginTop: '6px' }}>
              Compliance score
            </div>
          </div>
        </div>
      </section>

      <div style={{ height: '1px', backgroundColor: tokens.colors.borderSubtle, marginBottom: tokens.spacing.xl }} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: tokens.spacing.xxl }}>

        <section>
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

          <div style={{ marginTop: tokens.spacing.lg }}>
            {activeTab === 'activity' && (
              <div role="tabpanel">
                {activity.map((item, index) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      padding: '12px 0',
                      borderBottom: index < activity.length - 1 ? `1px solid ${tokens.colors.borderSubtle}` : 'none',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm, marginBottom: '2px' }}>
                        <span style={{ fontSize: tokens.fontSize.sm, color: tokens.colors.text, fontWeight: tokens.fontWeight.medium }}>
                          {item.title}
                        </span>
                        <Badge variant={typeBadgeVariant[item.type]} size="sm">
                          {item.type}
                        </Badge>
                      </div>
                      <span style={{ fontSize: tokens.fontSize.sm, color: tokens.colors.textSecondary }}>
                        {item.description}
                      </span>
                    </div>
                    <span style={{ fontSize: tokens.fontSize.xs, color: tokens.colors.textTertiary, flexShrink: 0, marginLeft: tokens.spacing.md }}>
                      {formatRelativeTime(item.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reports' && summary && (
              <div role="tabpanel">
                <div style={{ display: 'flex', gap: '48px' }}>
                  {Object.entries(summary.reports.byStatus).map(([status, count]) => {
                    const statusLabels: Record<string, string> = { completed: 'Completed', in_progress: 'In Progress', failed: 'Failed' };
                    const statusColors: Record<string, string> = { completed: tokens.colors.success, in_progress: tokens.colors.warning, failed: tokens.colors.danger };
                    return (
                      <div key={status}>
                        <div style={{
                          fontSize: '28px',
                          fontWeight: tokens.fontWeight.semibold,
                          color: tokens.colors.text,
                          letterSpacing: '-0.02em',
                          lineHeight: 1,
                        }}>
                          {count}
                        </div>
                        <div style={{
                          fontSize: tokens.fontSize.sm,
                          color: statusColors[status] || tokens.colors.textSecondary,
                          marginTop: '6px',
                          fontWeight: tokens.fontWeight.medium,
                        }}>
                          {statusLabels[status] || status}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{
                  marginTop: tokens.spacing.lg,
                  paddingTop: tokens.spacing.md,
                  borderTop: `1px solid ${tokens.colors.borderSubtle}`,
                  fontSize: tokens.fontSize.sm,
                  color: tokens.colors.textSecondary,
                }}>
                  {summary.reports.recentViews.toLocaleString()} total report views
                </div>
              </div>
            )}
          </div>
        </section>

        <aside>
          <section>
            <div style={{
              fontSize: tokens.fontSize.xs,
              color: tokens.colors.textTertiary,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.06em',
              fontWeight: tokens.fontWeight.medium,
              marginBottom: tokens.spacing.md,
            }}>
              Notifications
            </div>
            {summary && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.entries(summary.notifications.byType).map(([type, count]) => (
                  <div key={type} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm }}>
                      <div
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: '50%',
                          backgroundColor:
                            type === 'error' ? tokens.colors.danger :
                            type === 'warning' ? tokens.colors.warning :
                            type === 'success' ? tokens.colors.success :
                            tokens.colors.accent,
                        }}
                      />
                      <span style={{ fontSize: tokens.fontSize.sm, color: tokens.colors.textSecondary, textTransform: 'capitalize' as const }}>
                        {type}
                      </span>
                    </div>
                    <span style={{ fontSize: tokens.fontSize.sm, fontWeight: tokens.fontWeight.medium, color: tokens.colors.text, fontVariantNumeric: 'tabular-nums' }}>
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div style={{ height: '1px', backgroundColor: tokens.colors.borderSubtle, margin: `${tokens.spacing.lg} 0` }} />

          <section>
            <div style={{
              fontSize: tokens.fontSize.xs,
              color: tokens.colors.textTertiary,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.06em',
              fontWeight: tokens.fontWeight.medium,
              marginBottom: tokens.spacing.md,
            }}>
              System
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: tokens.fontSize.sm, color: tokens.colors.textSecondary }}>Uptime</span>
                <span style={{ fontSize: tokens.fontSize.sm, color: tokens.colors.text, fontWeight: tokens.fontWeight.medium }}>{summary?.system.uptime}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: tokens.fontSize.sm, color: tokens.colors.textSecondary }}>Total reports</span>
                <span style={{ fontSize: tokens.fontSize.sm, color: tokens.colors.text, fontWeight: tokens.fontWeight.medium }}>{summary?.reports.total}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: tokens.fontSize.sm, color: tokens.colors.textSecondary }}>Total notifications</span>
                <span style={{ fontSize: tokens.fontSize.sm, color: tokens.colors.text, fontWeight: tokens.fontWeight.medium }}>{summary?.notifications.total}</span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};
