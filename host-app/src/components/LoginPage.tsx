import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, tokens } from '@portal/shared-ui';
import { useAuth } from '../auth/AuthProvider';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: tokens.colors.bg,
        padding: tokens.spacing.xl,
      }}
    >
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <div style={{ marginBottom: tokens.spacing.xxl }}>
          <h1
            style={{
              fontSize: tokens.fontSize.xxl,
              fontWeight: tokens.fontWeight.semibold,
              color: tokens.colors.text,
              margin: 0,
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
            }}
          >
            Enterprise Portal
          </h1>
          <p style={{ color: tokens.colors.textSecondary, fontSize: tokens.fontSize.md, marginTop: tokens.spacing.sm, lineHeight: 1.5 }}>
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            fullWidth
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            fullWidth
            required
          />
          {error && (
            <div
              role="alert"
              style={{
                color: tokens.colors.danger,
                fontSize: tokens.fontSize.sm,
                padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
                backgroundColor: tokens.colors.dangerSubtle,
                borderRadius: tokens.borderRadius.md,
              }}
            >
              {error}
            </div>
          )}
          <Button
            type="submit"
            isLoading={isSubmitting}
            style={{ width: '100%', padding: '10px 20px', marginTop: tokens.spacing.xs }}
          >
            Sign in
          </Button>
        </form>

        <div
          style={{
            marginTop: tokens.spacing.xxl,
            paddingTop: tokens.spacing.lg,
            borderTop: `1px solid ${tokens.colors.border}`,
          }}
        >
          <p
            style={{
              fontSize: tokens.fontSize.xs,
              color: tokens.colors.textTertiary,
              marginBottom: tokens.spacing.md,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              fontWeight: tokens.fontWeight.medium,
            }}
          >
            Demo accounts
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              { email: 'janis.berzins@portals.lv', pass: 'admin123', role: 'Admin' },
              { email: 'liga.ozola@portals.lv', pass: 'operator123', role: 'Operator' },
              { email: 'maris.kalns@portals.lv', pass: 'viewer123', role: 'Viewer' },
            ].map((cred) => (
              <button
                key={cred.email}
                type="button"
                onClick={() => {
                  setEmail(cred.email);
                  setPassword(cred.pass);
                }}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 10px',
                  backgroundColor: tokens.colors.surfaceRaised,
                  border: 'none',
                  borderRadius: tokens.borderRadius.md,
                  fontSize: tokens.fontSize.sm,
                  color: tokens.colors.textSecondary,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: tokens.fontSize.xs }}>
                  {cred.email}
                </span>
                <span
                  style={{
                    color: tokens.colors.accent,
                    fontSize: tokens.fontSize.xs,
                    fontWeight: tokens.fontWeight.medium,
                  }}
                >
                  {cred.role}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
