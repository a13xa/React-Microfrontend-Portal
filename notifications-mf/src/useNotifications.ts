import { useCallback, useEffect, useReducer } from 'react';
import { emitPortalEvent } from '@portal/shared-ui';
import { Notification, NotificationsState } from './types';
import { fetchNotifications, markNotificationAsRead } from './api';

type NotificationsAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Notification[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'MARK_READ_OPTIMISTIC'; payload: string }
  | { type: 'MARK_READ_ROLLBACK'; payload: string }
  | { type: 'MARK_ALL_READ' };

const initialState: NotificationsState = {
  notifications: [],
  isLoading: false,
  error: null,
};

function notificationsReducer(state: NotificationsState, action: NotificationsAction): NotificationsState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, isLoading: false, notifications: action.payload };
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'MARK_READ_OPTIMISTIC':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, isRead: true } : n
        ),
      };
    case 'MARK_READ_ROLLBACK':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, isRead: false } : n
        ),
      };
    case 'MARK_ALL_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      };
    default:
      return state;
  }
}

interface UseNotificationsReturn extends NotificationsState {
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => void;
  unreadCount: number;
}

export function useNotifications(): UseNotificationsReturn {
  const [state, dispatch] = useReducer(notificationsReducer, initialState);

  useEffect(() => {
    const load = async (): Promise<void> => {
      dispatch({ type: 'FETCH_START' });
      try {
        const notifications = await fetchNotifications();
        dispatch({ type: 'FETCH_SUCCESS', payload: notifications });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch notifications';
        dispatch({ type: 'FETCH_ERROR', payload: message });
      }
    };
    void load();
  }, []);

  const markAsRead = useCallback(async (id: string): Promise<void> => {
    dispatch({ type: 'MARK_READ_OPTIMISTIC', payload: id });
    try {
      await markNotificationAsRead(id);
    } catch {
      dispatch({ type: 'MARK_READ_ROLLBACK', payload: id });
    }
  }, []);

  const markAllAsRead = useCallback((): void => {
    dispatch({ type: 'MARK_ALL_READ' });
  }, []);

  const unreadCount = state.notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    if (!state.isLoading) {
      emitPortalEvent('NOTIFICATION_COUNT_CHANGE', { unreadCount });
    }
  }, [unreadCount, state.isLoading]);

  return { ...state, markAsRead, markAllAsRead, unreadCount };
}
