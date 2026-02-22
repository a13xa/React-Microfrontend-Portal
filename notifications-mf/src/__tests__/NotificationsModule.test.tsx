import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import NotificationsModule from '../NotificationsModule';
import * as api from '../api';

jest.mock('../api');

const mockNotifications = [
  {
    id: '1',
    title: 'System Update',
    message: 'A new system update is available',
    isRead: false,
    timestamp: new Date().toISOString(),
    type: 'info' as const,
  },
  {
    id: '2',
    title: 'Warning Alert',
    message: 'High memory usage detected',
    isRead: true,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    type: 'warning' as const,
  },
];

describe('NotificationsModule', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('portal_auth', JSON.stringify({ user: { id: '2', email: 'liga.ozola@portals.lv', name: 'Līga Ozola', role: 'operator' }, token: 'mock' }));
  });

  afterEach(() => {
    localStorage.removeItem('portal_auth');
  });

  it('renders loading state initially', () => {
    (api.fetchNotifications as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<NotificationsModule />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders notifications after loading', async () => {
    (api.fetchNotifications as jest.Mock).mockResolvedValue(mockNotifications);
    render(<NotificationsModule />);
    await waitFor(() => {
      expect(screen.getByText('System Update')).toBeInTheDocument();
    });
    expect(screen.getByText('Warning Alert')).toBeInTheDocument();
  });

  it('renders error state on fetch failure', async () => {
    (api.fetchNotifications as jest.Mock).mockRejectedValue(new Error('Network error'));
    render(<NotificationsModule />);
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Network error');
    });
  });

  it('marks notification as read with optimistic update', async () => {
    (api.fetchNotifications as jest.Mock).mockResolvedValue(mockNotifications);
    (api.markNotificationAsRead as jest.Mock).mockResolvedValue(undefined);
    render(<NotificationsModule />);
    await waitFor(() => {
      expect(screen.getByText('System Update')).toBeInTheDocument();
    });
    const markReadButton = screen.getByLabelText('Mark notification 1 as read');
    fireEvent.click(markReadButton);
    await waitFor(() => {
      expect(api.markNotificationAsRead).toHaveBeenCalledWith('1');
    });
  });

  it('shows unread count', async () => {
    (api.fetchNotifications as jest.Mock).mockResolvedValue(mockNotifications);
    render(<NotificationsModule />);
    await waitFor(() => {
      expect(screen.getByText('1 unread')).toBeInTheDocument();
    });
  });
});
