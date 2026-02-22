export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

export interface NotificationsState {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
}
