import { render, screen, waitFor } from '@testing-library/react';
import ReportsModule from '../ReportsModule';
import * as api from '../api';

jest.mock('../api');

const mockPaginatedResponse = {
  data: [
    {
      id: '1',
      title: 'Q4 Revenue Analysis',
      status: 'completed' as const,
      author: 'Anna Liepiņa',
      createdAt: '2024-01-15T10:30:00.000Z',
      metrics: { views: 5200, downloads: 340 },
    },
    {
      id: '2',
      title: 'User Growth Report',
      status: 'in_progress' as const,
      author: 'Kārlis Vanags',
      createdAt: '2024-01-14T10:30:00.000Z',
      metrics: { views: 1200, downloads: 89 },
    },
  ],
  total: 2,
  page: 1,
  pageSize: 10,
  totalPages: 1,
};

describe('ReportsModule', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (api.fetchReportsPaginated as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<ReportsModule />);
    expect(screen.getByLabelText('Data table')).toBeInTheDocument();
  });

  it('renders reports table after loading', async () => {
    (api.fetchReportsPaginated as jest.Mock).mockResolvedValue(mockPaginatedResponse);
    render(<ReportsModule />);
    await waitFor(() => {
      expect(screen.getByText('Q4 Revenue Analysis')).toBeInTheDocument();
    });
    expect(screen.getByText('User Growth Report')).toBeInTheDocument();
    expect(screen.getByText('Anna Liepiņa')).toBeInTheDocument();
    expect(screen.getAllByText('Completed').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('In Progress').length).toBeGreaterThanOrEqual(1);
  });

  it('renders error state on fetch failure', async () => {
    (api.fetchReportsPaginated as jest.Mock).mockRejectedValue(new Error('Network error'));
    render(<ReportsModule />);
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Network error');
    });
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('renders formatted metrics', async () => {
    (api.fetchReportsPaginated as jest.Mock).mockResolvedValue(mockPaginatedResponse);
    render(<ReportsModule />);
    await waitFor(() => {
      expect(screen.getByText('5.2k')).toBeInTheDocument();
    });
    expect(screen.getByText('340')).toBeInTheDocument();
  });

  it('renders search input', async () => {
    (api.fetchReportsPaginated as jest.Mock).mockResolvedValue(mockPaginatedResponse);
    render(<ReportsModule />);
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search reports...')).toBeInTheDocument();
    });
  });

  it('renders status filter buttons', async () => {
    (api.fetchReportsPaginated as jest.Mock).mockResolvedValue(mockPaginatedResponse);
    render(<ReportsModule />);
    await waitFor(() => {
      expect(screen.getByText('All')).toBeInTheDocument();
    });
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });

  it('displays total count', async () => {
    (api.fetchReportsPaginated as jest.Mock).mockResolvedValue(mockPaginatedResponse);
    render(<ReportsModule />);
    await waitFor(() => {
      expect(screen.getByText('2 total')).toBeInTheDocument();
    });
  });
});
