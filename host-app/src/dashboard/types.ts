export interface DashboardSummary {
  notifications: {
    total: number;
    unread: number;
    byType: Record<string, number>;
  };
  reports: {
    total: number;
    byStatus: Record<string, number>;
    recentViews: number;
  };
  system: {
    activeUsers: number;
    pendingApprovals: number;
    complianceScore: number;
    uptime: number;
  };
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
}
