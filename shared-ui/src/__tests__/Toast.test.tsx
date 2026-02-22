import { render, screen, act } from '@testing-library/react';
import { ToastProvider, useToast } from '../components/Toast';

function TestComponent() {
  const { addToast } = useToast();
  return (
    <button onClick={() => addToast('Operation successful', 'success', 1000)}>
      Show Toast
    </button>
  );
}

describe('Toast', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders toast when addToast is called', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    act(() => {
      screen.getByText('Show Toast').click();
    });
    expect(screen.getByText('Operation successful')).toBeInTheDocument();
  });

  it('auto-dismisses toast after duration', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    act(() => {
      screen.getByText('Show Toast').click();
    });
    expect(screen.getByText('Operation successful')).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(1500);
    });
    expect(screen.queryByText('Operation successful')).not.toBeInTheDocument();
  });

  it('throws error when useToast is used outside ToastProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestComponent />)).toThrow(
      'useToast must be used within ToastProvider'
    );
    consoleError.mockRestore();
  });
});
