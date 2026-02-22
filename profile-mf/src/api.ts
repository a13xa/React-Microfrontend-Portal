import { UserProfile, ProfileFormData } from './types';

const ENDPOINTS = {
  profile: '/api/v1/profile',
} as const;

interface StoredAuth {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

const PROFILES: Record<string, UserProfile> = {
  '1': { id: '1', name: 'Jānis Bērziņš', email: 'janis.berzins@portals.lv', phone: '+371 29 123 456', company: 'SIA Tehnoloģiju Risinājumi', department: 'Inženierija' },
  '2': { id: '2', name: 'Līga Ozola', email: 'liga.ozola@portals.lv', phone: '+371 26 234 567', company: 'SIA Tehnoloģiju Risinājumi', department: 'Operācijas' },
  '3': { id: '3', name: 'Māris Kalniņš', email: 'maris.kalns@portals.lv', phone: '+371 22 345 678', company: 'SIA Tehnoloģiju Risinājumi', department: 'Analītika' },
};

const overrides: Map<string, Partial<UserProfile>> = new Map();

function getAuthUser(): StoredAuth['user'] | null {
  const stored = localStorage.getItem('portal_auth');
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored) as StoredAuth;
    return parsed.user;
  } catch {
    return null;
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchUserProfile(): Promise<UserProfile> {
  void ENDPOINTS;
  await delay(500);
  const authUser = getAuthUser();
  const userId = authUser?.id || '1';
  const base = PROFILES[userId] || PROFILES['1'];
  const edits = overrides.get(userId);
  if (!base) throw new Error('Profile not found');
  return { ...base, ...edits };
}

export async function updateUserProfile(profileData: ProfileFormData): Promise<UserProfile> {
  void ENDPOINTS;
  await delay(700);
  const authUser = getAuthUser();
  const userId = authUser?.id || '1';
  const base = PROFILES[userId] || PROFILES['1'];
  if (!base) throw new Error('Profile not found');
  overrides.set(userId, {
    name: profileData.name,
    phone: profileData.phone,
    department: profileData.department,
  });
  return { ...base, ...overrides.get(userId) };
}
