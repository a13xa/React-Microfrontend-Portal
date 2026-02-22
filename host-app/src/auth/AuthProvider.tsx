import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { AuthContextValue, AuthState, User, UserRole } from './types';

const MOCK_USERS: Record<string, User & { password: string }> = {
  'janis.berzins@portals.lv': { id: '1', email: 'janis.berzins@portals.lv', name: 'Jānis Bērziņš', role: 'admin', password: 'admin123' },
  'liga.ozola@portals.lv': { id: '2', email: 'liga.ozola@portals.lv', name: 'Līga Ozola', role: 'operator', password: 'operator123' },
  'maris.kalns@portals.lv': { id: '3', email: 'maris.kalns@portals.lv', name: 'Māris Kalniņš', role: 'viewer', password: 'viewer123' },
};

const ROLE_HIERARCHY: Record<UserRole, number> = {
  viewer: 1,
  operator: 2,
  admin: 3,
};

function generateMockJwt(user: User): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ sub: user.id, email: user.email, role: user.role, exp: Date.now() + 3600000 }));
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'TOKEN_REFRESH'; payload: { token: string } };

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      return { user: action.payload.user, token: action.payload.token, isAuthenticated: true, isLoading: false };
    case 'LOGIN_FAILURE':
      return { ...initialState };
    case 'LOGOUT':
      return { ...initialState };
    case 'TOKEN_REFRESH':
      return { ...state, token: action.payload.token };
    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const stored = localStorage.getItem('portal_auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { user: User; token: string };
        dispatch({ type: 'LOGIN_SUCCESS', payload: parsed });
      } catch {
        localStorage.removeItem('portal_auth');
      }
    }
  }, []);

  useEffect(() => {
    if (!state.isAuthenticated || !state.user) return;
    const interval = setInterval(() => {
      const newToken = generateMockJwt(state.user as User);
      dispatch({ type: 'TOKEN_REFRESH', payload: { token: newToken } });
      localStorage.setItem('portal_auth', JSON.stringify({ user: state.user, token: newToken }));
    }, 300000);
    return () => clearInterval(interval);
  }, [state.isAuthenticated, state.user]);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockUser = MOCK_USERS[email];
    if (!mockUser || mockUser.password !== password) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw new Error('Invalid email or password');
    }

    const { password: _, ...user } = mockUser;
    const token = generateMockJwt(user);
    dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
    localStorage.setItem('portal_auth', JSON.stringify({ user, token }));
  }, []);

  const logout = useCallback((): void => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('portal_auth');
  }, []);

  const hasRole = useCallback((requiredRole: UserRole): boolean => {
    if (!state.user) return false;
    return ROLE_HIERARCHY[state.user.role] >= ROLE_HIERARCHY[requiredRole];
  }, [state.user]);

  const value = useMemo<AuthContextValue>(() => ({
    ...state,
    login,
    logout,
    hasRole,
  }), [state, login, logout, hasRole]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
