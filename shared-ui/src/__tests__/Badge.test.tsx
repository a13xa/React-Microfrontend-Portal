import { render, screen } from '@testing-library/react';
import { Badge } from '../components/Badge';

describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('applies default variant styling', () => {
    render(<Badge>Default</Badge>);
    const el = screen.getByText('Default');
    expect(el.tagName).toBe('SPAN');
  });

  it('renders with success variant', () => {
    render(<Badge variant="success">Completed</Badge>);
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('renders with danger variant', () => {
    render(<Badge variant="danger">Failed</Badge>);
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });

  it('renders with warning variant', () => {
    render(<Badge variant="warning">Pending</Badge>);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('renders with info variant', () => {
    render(<Badge variant="info">Info</Badge>);
    expect(screen.getByText('Info')).toBeInTheDocument();
  });

  it('accepts custom style prop', () => {
    render(<Badge style={{ marginLeft: '8px' }}>Styled</Badge>);
    const el = screen.getByText('Styled');
    expect(el.style.marginLeft).toBe('8px');
  });
});
