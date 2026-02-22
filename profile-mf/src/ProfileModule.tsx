import React, { useState } from 'react';
import { Button, Input, Spinner, tokens } from '@portal/shared-ui';
import { useProfile } from './useProfile';
import { ProfileFormData } from './types';

function getUserRole(): string {
  try {
    const stored = localStorage.getItem('portal_auth');
    if (!stored) return 'viewer';
    const parsed = JSON.parse(stored) as { user: { role: string } };
    return parsed.user.role;
  } catch {
    return 'viewer';
  }
}

const ProfileModule: React.FC = () => {
  const { profile, isLoading, error, isSaving, saveProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const role = getUserRole();
  const canEdit = role === 'admin' || role === 'operator';
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    phone: '',
    department: '',
  });

  const handleEdit = (): void => {
    if (profile) {
      setFormData({
        name: profile.name,
        phone: profile.phone,
        department: profile.department,
      });
      setIsEditing(true);
    }
  };

  const handleCancel = (): void => {
    setIsEditing(false);
  };

  const handleSave = async (): Promise<void> => {
    await saveProfile(formData);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: tokens.spacing.xxl }}>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div role="alert" style={{ color: tokens.colors.danger, fontSize: tokens.fontSize.md }}>{error}</div>;
  }

  if (!profile) return null;

  const initials = profile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: tokens.spacing.lg,
          marginBottom: tokens.spacing.xl,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: tokens.borderRadius.full,
            backgroundColor: tokens.colors.accentSubtle,
            color: tokens.colors.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: tokens.fontSize.lg,
            fontWeight: tokens.fontWeight.semibold,
            flexShrink: 0,
            border: `1px solid ${tokens.colors.border}`,
          }}
        >
          {initials}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: tokens.fontSize.xl, fontWeight: tokens.fontWeight.semibold, color: tokens.colors.text, margin: 0, letterSpacing: '-0.02em', lineHeight: 1.3 }}>
            {profile.name}
          </h2>
          <div style={{ fontSize: tokens.fontSize.sm, color: tokens.colors.textTertiary, marginTop: '2px' }}>
            {profile.email}
          </div>
        </div>
        {!isEditing && canEdit && (
          <Button variant="secondary" size="sm" onClick={handleEdit}>Edit</Button>
        )}
      </div>

      {isEditing ? (
        <div
          style={{
            border: `1px solid ${tokens.colors.border}`,
            borderRadius: tokens.borderRadius.lg,
            backgroundColor: tokens.colors.surface,
            padding: tokens.spacing.lg,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              fullWidth
            />
            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              fullWidth
            />
            <Input
              label="Department"
              value={formData.department}
              onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
              fullWidth
            />
            <div style={{ display: 'flex', gap: tokens.spacing.sm, marginTop: tokens.spacing.sm }}>
              <Button onClick={handleSave} isLoading={isSaving}>Save changes</Button>
              <Button variant="ghost" onClick={handleCancel} disabled={isSaving}>Cancel</Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div
            style={{
              border: `1px solid ${tokens.colors.border}`,
              borderRadius: tokens.borderRadius.lg,
              overflow: 'hidden',
              backgroundColor: tokens.colors.surface,
            }}
          >
            <ProfileRow label="Full name" value={profile.name} />
            <ProfileRow label="Email" value={profile.email} />
            <ProfileRow label="Phone" value={profile.phone} />
            <ProfileRow label="Company" value={profile.company} />
            <ProfileRow label="Department" value={profile.department} isLast />
          </div>

          <div style={{ marginTop: tokens.spacing.lg }}>
            <div style={{ fontSize: tokens.fontSize.xs, color: tokens.colors.textTertiary, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: tokens.fontWeight.medium, marginBottom: tokens.spacing.sm }}>
              Access level
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: tokens.spacing.sm,
                padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
                backgroundColor: tokens.colors.accentSubtle,
                borderRadius: tokens.borderRadius.md,
                border: `1px solid ${tokens.colors.border}`,
              }}
            >
              <span style={{ fontSize: tokens.fontSize.sm, color: tokens.colors.accent, fontWeight: tokens.fontWeight.medium, textTransform: 'capitalize' }}>
                {role}
              </span>
              {!canEdit && (
                <span style={{ fontSize: tokens.fontSize.xs, color: tokens.colors.textTertiary }}>
                  &middot; View only
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

interface ProfileRowProps {
  label: string;
  value: string;
  isLast?: boolean;
}

const ProfileRow: React.FC<ProfileRowProps> = ({ label, value, isLast = false }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'baseline',
      padding: `14px ${tokens.spacing.lg}`,
      borderBottom: isLast ? 'none' : `1px solid ${tokens.colors.borderSubtle}`,
    }}
  >
    <div
      style={{
        width: '140px',
        flexShrink: 0,
        fontSize: tokens.fontSize.sm,
        color: tokens.colors.textSecondary,
      }}
    >
      {label}
    </div>
    <div style={{ fontSize: tokens.fontSize.md, color: tokens.colors.text }}>
      {value}
    </div>
  </div>
);

export default ProfileModule;
