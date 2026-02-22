import { useCallback, useEffect, useReducer } from 'react';
import { emitPortalEvent } from '@portal/shared-ui';
import { Report, ReportsState } from './types';
import { fetchReportsPaginated, deleteReport as deleteReportApi } from './api';

type ReportsAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: { reports: Report[]; total: number; totalPages: number } }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_SORT'; payload: { sortBy: string; sortDirection: 'asc' | 'desc' } }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_STATUS_FILTER'; payload: string };

const initialState: ReportsState = {
  reports: [],
  isLoading: false,
  error: null,
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 1,
  sortBy: 'createdAt',
  sortDirection: 'desc',
  search: '',
  statusFilter: 'all',
};

function reportsReducer(state: ReportsState, action: ReportsAction): ReportsState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        reports: action.payload.reports,
        total: action.payload.total,
        totalPages: action.payload.totalPages,
      };
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'SET_SORT':
      return { ...state, sortBy: action.payload.sortBy, sortDirection: action.payload.sortDirection, page: 1 };
    case 'SET_SEARCH':
      return { ...state, search: action.payload, page: 1 };
    case 'SET_STATUS_FILTER':
      return { ...state, statusFilter: action.payload, page: 1 };
    default:
      return state;
  }
}

interface UseReportsReturn extends ReportsState {
  refetch: () => Promise<void>;
  setPage: (page: number) => void;
  toggleSort: (column: string) => void;
  setSearch: (query: string) => void;
  setStatusFilter: (status: string) => void;
  deleteReport: (id: string) => Promise<void>;
}

export function useReports(): UseReportsReturn {
  const [state, dispatch] = useReducer(reportsReducer, initialState);

  const fetchReports = useCallback(async (): Promise<void> => {
    dispatch({ type: 'FETCH_START' });
    try {
      const result = await fetchReportsPaginated({
        page: state.page,
        pageSize: state.pageSize,
        sortBy: state.sortBy,
        sortDirection: state.sortDirection,
        search: state.search,
        statusFilter: state.statusFilter,
      });
      dispatch({
        type: 'FETCH_SUCCESS',
        payload: { reports: result.data, total: result.total, totalPages: result.totalPages },
      });

      emitPortalEvent('MF_DATA_READY', {
        source: 'reports',
        summary: { total: result.total, page: result.page },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch reports';
      dispatch({ type: 'FETCH_ERROR', payload: message });
    }
  }, [state.page, state.pageSize, state.sortBy, state.sortDirection, state.search, state.statusFilter]);

  useEffect(() => {
    void fetchReports();
  }, [fetchReports]);

  const setPage = useCallback((page: number) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  }, []);

  const toggleSort = useCallback(
    (column: string) => {
      const newDirection =
        state.sortBy === column && state.sortDirection === 'asc' ? 'desc' : 'asc';
      dispatch({ type: 'SET_SORT', payload: { sortBy: column, sortDirection: newDirection } });
    },
    [state.sortBy, state.sortDirection]
  );

  const setSearch = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH', payload: query });
  }, []);

  const setStatusFilter = useCallback((status: string) => {
    dispatch({ type: 'SET_STATUS_FILTER', payload: status });
  }, []);

  const deleteReport = useCallback(async (id: string): Promise<void> => {
    await deleteReportApi(id);
    await fetchReports();
  }, [fetchReports]);

  return {
    ...state,
    refetch: fetchReports,
    setPage,
    toggleSort,
    setSearch,
    setStatusFilter,
    deleteReport,
  };
}
