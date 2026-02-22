export interface Report {
  id: string;
  title: string;
  status: 'completed' | 'in_progress' | 'failed';
  author: string;
  createdAt: string;
  metrics: {
    views: number;
    downloads: number;
  };
}

export interface ReportsQueryParams {
  page: number;
  pageSize: number;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  search: string;
  statusFilter: string;
}

export interface PaginatedReportsResponse {
  data: Report[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ReportsState {
  reports: Report[];
  isLoading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  search: string;
  statusFilter: string;
}

export interface ReportsQueryResponse {
  reports: Report[];
}
