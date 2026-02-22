import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spinner } from '@portal/shared-ui';
import { useAuth } from './auth/AuthProvider';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { LoginPage } from './components/LoginPage';
import { DashboardPage } from './dashboard/DashboardPage';

const ProfileModule = lazy(() => import('profile_mf/ProfileModule'));
const NotificationsModule = lazy(() => import('notifications_mf/NotificationsModule'));
const ReportsModule = lazy(() => import('reports_mf/ReportsModule'));

const SuspenseFallback: React.FC = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
    <Spinner size={40} />
  </div>
);

export const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route
          path="/profile"
          element={
            <ErrorBoundary>
              <Suspense fallback={<SuspenseFallback />}>
                <ProfileModule />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path="/notifications"
          element={
            <ErrorBoundary>
              <Suspense fallback={<SuspenseFallback />}>
                <NotificationsModule />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute requiredRole="operator">
              <ErrorBoundary>
                <Suspense fallback={<SuspenseFallback />}>
                  <ReportsModule />
                </Suspense>
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
