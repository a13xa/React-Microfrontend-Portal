export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  department: string;
}

export interface ProfileFormData {
  name: string;
  phone: string;
  department: string;
}

export interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
}
