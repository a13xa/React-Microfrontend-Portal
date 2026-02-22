import React, { createContext, useCallback, useContext, useReducer } from 'react';
import { tokens } from '../tokens';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextValue {
  addToast: (message: string, type?: ToastItem['type'], duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

type ToastAction =
  | { type: 'ADD'; payload: ToastItem }
  | { type: 'REMOVE'; payload: string };

function toastReducer(state: ToastItem[], action: ToastAction): ToastItem[] {
  switch (action.type) {
    case 'ADD':
      return [...state, action.payload];
    case 'REMOVE':
      return state.filter((t) => t.id !== action.payload);
    default:
      return state;
  }
}

const typeStyles: Record<ToastItem['type'], { bg: string; color: string; border: string }> = {
  success: { bg: tokens.colors.successSubtle, color: tokens.colors.success, border: tokens.colors.success },
  error: { bg: tokens.colors.dangerSubtle, color: tokens.colors.danger, border: tokens.colors.danger },
  info: { bg: tokens.colors.accentSubtle, color: tokens.colors.accent, border: tokens.colors.accent },
};

let toastCounter = 0;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, dispatch] = useReducer(toastReducer, []);

  const addToast = useCallback((message: string, type: ToastItem['type'] = 'info', duration = 4000) => {
    const id = `toast-${++toastCounter}`;
    dispatch({ type: 'ADD', payload: { id, message, type } });
    setTimeout(() => {
      dispatch({ type: 'REMOVE', payload: id });
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {toasts.length > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: tokens.spacing.lg,
            right: tokens.spacing.lg,
            zIndex: 1100,
            display: 'flex',
            flexDirection: 'column',
            gap: tokens.spacing.sm,
            maxWidth: '380px',
          }}
        >
          {toasts.map((toast) => {
            const styles = typeStyles[toast.type];
            return (
              <div
                key={toast.id}
                role="status"
                aria-live="polite"
                style={{
                  padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
                  backgroundColor: styles.bg,
                  color: styles.color,
                  borderLeft: `3px solid ${styles.border}`,
                  borderRadius: tokens.borderRadius.md,
                  fontSize: tokens.fontSize.sm,
                  fontWeight: tokens.fontWeight.medium,
                  lineHeight: 1.5,
                  border: `1px solid ${tokens.colors.border}`,
                  borderLeftWidth: '3px',
                  borderLeftColor: styles.border,
                }}
              >
                {toast.message}
              </div>
            );
          })}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
