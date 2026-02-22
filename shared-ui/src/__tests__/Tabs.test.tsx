import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs } from '../components/Tabs';

const tabs = [
  { id: 'activity', label: 'Activity', count: 5 },
  { id: 'reports', label: 'Reports' },
  { id: 'settings', label: 'Settings' },
];

describe('Tabs', () => {
  const onTabChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all tab labels', () => {
    render(<Tabs tabs={tabs} activeTab="activity" onTabChange={onTabChange} />);
    expect(screen.getByText('Activity')).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('marks active tab with aria-selected', () => {
    render(<Tabs tabs={tabs} activeTab="activity" onTabChange={onTabChange} />);
    const allTabs = screen.getAllByRole('tab');
    expect(allTabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(allTabs[1]).toHaveAttribute('aria-selected', 'false');
  });

  it('shows count badge when count is provided', () => {
    render(<Tabs tabs={tabs} activeTab="activity" onTabChange={onTabChange} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('calls onTabChange when a tab is clicked', () => {
    render(<Tabs tabs={tabs} activeTab="activity" onTabChange={onTabChange} />);
    fireEvent.click(screen.getByText('Reports'));
    expect(onTabChange).toHaveBeenCalledWith('reports');
  });

  it('navigates tabs with ArrowRight keyboard', () => {
    render(<Tabs tabs={tabs} activeTab="activity" onTabChange={onTabChange} />);
    const tablist = screen.getByRole('tablist');
    fireEvent.keyDown(tablist, { key: 'ArrowRight' });
    expect(onTabChange).toHaveBeenCalledWith('reports');
  });

  it('navigates tabs with ArrowLeft keyboard', () => {
    render(<Tabs tabs={tabs} activeTab="reports" onTabChange={onTabChange} />);
    const tablist = screen.getByRole('tablist');
    fireEvent.keyDown(tablist, { key: 'ArrowLeft' });
    expect(onTabChange).toHaveBeenCalledWith('activity');
  });

  it('navigates to first tab with Home key', () => {
    render(<Tabs tabs={tabs} activeTab="settings" onTabChange={onTabChange} />);
    const tablist = screen.getByRole('tablist');
    fireEvent.keyDown(tablist, { key: 'Home' });
    expect(onTabChange).toHaveBeenCalledWith('activity');
  });

  it('navigates to last tab with End key', () => {
    render(<Tabs tabs={tabs} activeTab="activity" onTabChange={onTabChange} />);
    const tablist = screen.getByRole('tablist');
    fireEvent.keyDown(tablist, { key: 'End' });
    expect(onTabChange).toHaveBeenCalledWith('settings');
  });

  it('has correct tablist role', () => {
    render(<Tabs tabs={tabs} activeTab="activity" onTabChange={onTabChange} />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });
});
