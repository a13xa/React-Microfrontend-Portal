import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfileModule from '../ProfileModule';
import * as api from '../api';

jest.mock('../api');

const mockProfile = {
  id: '1',
  name: 'Jānis Bērziņš',
  email: 'janis.berzins@portals.lv',
  phone: '+371 29 123 456',
  company: 'SIA Tehnoloģiju Risinājumi',
  department: 'Inženierija',
};

describe('ProfileModule', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('portal_auth', JSON.stringify({ user: { id: '2', email: 'liga.ozola@portals.lv', name: 'Līga Ozola', role: 'operator' }, token: 'mock' }));
  });

  afterEach(() => {
    localStorage.removeItem('portal_auth');
  });

  it('renders loading state initially', () => {
    (api.fetchUserProfile as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<ProfileModule />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders profile data after loading', async () => {
    (api.fetchUserProfile as jest.Mock).mockResolvedValue(mockProfile);
    render(<ProfileModule />);
    await waitFor(() => {
      expect(screen.getAllByText('Jānis Bērziņš')[0]).toBeInTheDocument();
    });
    expect(screen.getAllByText('janis.berzins@portals.lv')[0]).toBeInTheDocument();
  });

  it('renders error state on fetch failure', async () => {
    (api.fetchUserProfile as jest.Mock).mockRejectedValue(new Error('Network error'));
    render(<ProfileModule />);
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Network error');
    });
  });

  it('enters edit mode when Edit button is clicked', async () => {
    const user = userEvent.setup();
    (api.fetchUserProfile as jest.Mock).mockResolvedValue(mockProfile);
    render(<ProfileModule />);
    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });
    await act(async () => {
      await user.click(screen.getByText('Edit'));
    });
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
  });
});
