import { Notification } from './types';

const ENDPOINTS = {
  notifications: '/api/v1/notifications',
  markRead: (id: string) => `/api/v1/notifications/${id}/read`,
  markAllRead: '/api/v1/notifications/read-all',
} as const;

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'Deployment Completed', message: 'Production deployment v2.4.1 finished successfully across all regions.', isRead: false, timestamp: new Date(Date.now() - 900000).toISOString(), type: 'success' },
  { id: '2', title: 'High Memory Usage', message: 'Server riga-dc-1 memory usage exceeded 85% threshold. Auto-scaling initiated.', isRead: false, timestamp: new Date(Date.now() - 1800000).toISOString(), type: 'warning' },
  { id: '3', title: 'New Team Member', message: 'Elīna Liepiņa has joined the Engineering team. Please update access permissions.', isRead: false, timestamp: new Date(Date.now() - 3600000).toISOString(), type: 'info' },
  { id: '4', title: 'Database Backup Failed', message: 'Scheduled backup for analytics-db failed. Manual intervention required.', isRead: false, timestamp: new Date(Date.now() - 7200000).toISOString(), type: 'error' },
  { id: '5', title: 'SSL Certificate Expiring', message: 'Certificate for api.portals.lv expires in 14 days. Renewal recommended.', isRead: true, timestamp: new Date(Date.now() - 14400000).toISOString(), type: 'warning' },
  { id: '6', title: 'API Rate Limit Updated', message: 'Rate limit for public API increased from 1000 to 2500 requests per minute.', isRead: true, timestamp: new Date(Date.now() - 28800000).toISOString(), type: 'info' },
  { id: '7', title: 'Security Audit Complete', message: 'Q4 security audit passed with zero critical findings. Full report available.', isRead: true, timestamp: new Date(Date.now() - 43200000).toISOString(), type: 'success' },
  { id: '8', title: 'Maintenance Window', message: 'Scheduled maintenance on Saturday 02:00-04:00 UTC for network upgrades.', isRead: false, timestamp: new Date(Date.now() - 57600000).toISOString(), type: 'info' },
  { id: '9', title: 'CI Pipeline Failure', message: 'Build #4821 failed on staging branch. Test suite timeout in integration tests.', isRead: false, timestamp: new Date(Date.now() - 72000000).toISOString(), type: 'error' },
  { id: '10', title: 'License Renewal', message: 'Enterprise monitoring license expires on March 15. Contact procurement for renewal.', isRead: true, timestamp: new Date(Date.now() - 86400000).toISOString(), type: 'warning' },
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchNotifications(): Promise<Notification[]> {
  void ENDPOINTS;
  await delay(600);
  return MOCK_NOTIFICATIONS.map((n) => ({ ...n }));
}

export async function markNotificationAsRead(id: string): Promise<void> {
  void ENDPOINTS;
  await delay(300);
  const notification = MOCK_NOTIFICATIONS.find((n) => n.id === id);
  if (!notification) throw new Error(`Notification ${id} not found`);
}
