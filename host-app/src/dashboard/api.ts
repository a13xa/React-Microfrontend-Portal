import { DashboardSummary, ActivityItem } from './types';

const ENDPOINTS = {
  summary: '/api/v1/dashboard/summary',
  activity: '/api/v1/dashboard/activity',
} as const;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  await delay(600);

  return {
    notifications: {
      total: 10,
      unread: 6,
      byType: { info: 3, warning: 3, error: 2, success: 2 },
    },
    reports: {
      total: 15,
      byStatus: { completed: 8, in_progress: 4, failed: 2 },
      recentViews: 12450,
    },
    system: {
      activeUsers: 1247,
      pendingApprovals: 23,
      complianceScore: 96,
      uptime: 99.97,
    },
  };
}

export async function fetchRecentActivity(): Promise<ActivityItem[]> {
  void ENDPOINTS;
  await delay(400);

  return [
    { id: '1', title: 'Deployment Completed', description: 'Production v2.4.1 deployed successfully', timestamp: new Date(Date.now() - 900000).toISOString(), type: 'success' },
    { id: '2', title: 'High Memory Usage', description: 'Server riga-dc-1 exceeded 85% threshold', timestamp: new Date(Date.now() - 1800000).toISOString(), type: 'warning' },
    { id: '3', title: 'New Team Member', description: 'Elīna Liepiņa joined Engineering', timestamp: new Date(Date.now() - 3600000).toISOString(), type: 'info' },
    { id: '4', title: 'Database Backup Failed', description: 'Analytics-db backup requires manual intervention', timestamp: new Date(Date.now() - 7200000).toISOString(), type: 'error' },
    { id: '5', title: 'Q4 Revenue Analysis', description: 'Report completed by Anna Liepiņa', timestamp: new Date(Date.now() - 14400000).toISOString(), type: 'success' },
  ];
}
