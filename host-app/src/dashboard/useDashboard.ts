import { useCallback, useEffect, useReducer } from 'react';
import { usePortalEvent } from '@portal/shared-ui';
import { DashboardSummary, ActivityItem } from './types';
import { fetchDashboardSummary, fetchRecentActivity } from './api';

interface DashboardState {
  summary: DashboardSummary | null;
  activity: ActivityItem[];
  isLoading: boolean;
  error: string | null;
  liveUnreadCount: number | null;
}

type DashboardAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: { summary: DashboardSummary; activity: ActivityItem[] } }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'UPDATE_UNREAD_COUNT'; payload: number };

const initialState: DashboardState = {
  summary: null,
  activity: [],
  isLoading: false,
  error: null,
  liveUnreadCount: null,
};

function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        summary: action.payload.summary,
        activity: action.payload.activity,
      };
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'UPDATE_UNREAD_COUNT':
      return { ...state, liveUnreadCount: action.payload };
    default:
      return state;
  }
}

interface UseDashboardReturn extends DashboardState {
  refetch: () => void;
}

export function useDashboard(): UseDashboardReturn {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  const load = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const [summary, activity] = await Promise.all([
        fetchDashboardSummary(),
        fetchRecentActivity(),
      ]);
      dispatch({ type: 'FETCH_SUCCESS', payload: { summary, activity } });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load dashboard';
      dispatch({ type: 'FETCH_ERROR', payload: message });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  usePortalEvent('NOTIFICATION_COUNT_CHANGE', (payload) => {
    dispatch({ type: 'UPDATE_UNREAD_COUNT', payload: payload.unreadCount });
  });

  return { ...state, refetch: load };
}
