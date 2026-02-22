import { useCallback, useEffect, useReducer } from 'react';
import { ProfileState, ProfileFormData } from './types';
import { fetchUserProfile, updateUserProfile } from './api';

type ProfileAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: ProfileState['profile'] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SAVE_START' }
  | { type: 'SAVE_SUCCESS'; payload: ProfileState['profile'] }
  | { type: 'SAVE_ERROR'; payload: string };

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  error: null,
  isSaving: false,
};

function profileReducer(state: ProfileState, action: ProfileAction): ProfileState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, isLoading: false, profile: action.payload };
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'SAVE_START':
      return { ...state, isSaving: true, error: null };
    case 'SAVE_SUCCESS':
      return { ...state, isSaving: false, profile: action.payload };
    case 'SAVE_ERROR':
      return { ...state, isSaving: false, error: action.payload };
    default:
      return state;
  }
}

interface UseProfileReturn extends ProfileState {
  saveProfile: (data: ProfileFormData) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const [state, dispatch] = useReducer(profileReducer, initialState);

  const fetchProfile = useCallback(async (): Promise<void> => {
    dispatch({ type: 'FETCH_START' });
    try {
      const profile = await fetchUserProfile();
      dispatch({ type: 'FETCH_SUCCESS', payload: profile });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch profile';
      dispatch({ type: 'FETCH_ERROR', payload: message });
    }
  }, []);

  const saveProfile = useCallback(async (data: ProfileFormData): Promise<void> => {
    dispatch({ type: 'SAVE_START' });
    try {
      const updated = await updateUserProfile(data);
      dispatch({ type: 'SAVE_SUCCESS', payload: updated });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save profile';
      dispatch({ type: 'SAVE_ERROR', payload: message });
    }
  }, []);

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  return { ...state, saveProfile, refetch: fetchProfile };
}
