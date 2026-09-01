'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { AccessTokenResponse, UserDto } from '@portfolio/shared';
import { apiFetch } from './api';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  status: AuthStatus;
  user: UserDto | null;
  accessToken: string | null;
}

interface AuthContextValue extends AuthState {
  /** Attempt to (re)establish a session from the refresh cookie. */
  refresh: () => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const UNAUTHENTICATED: AuthState = { status: 'unauthenticated', user: null, accessToken: null };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    status: 'loading',
    user: null,
    accessToken: null,
  });

  const refresh = useCallback(async (): Promise<boolean> => {
    try {
      const tokens = await apiFetch<AccessTokenResponse>('/auth/refresh', { method: 'POST' });
      const user = await apiFetch<UserDto>('/users/me', { accessToken: tokens.accessToken });
      setState({ status: 'authenticated', user, accessToken: tokens.accessToken });
      return true;
    } catch {
      setState(UNAUTHENTICATED);
      return false;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    await apiFetch('/auth/logout', { method: 'POST' }).catch(() => undefined);
    setState(UNAUTHENTICATED);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, refresh, logout }),
    [state, refresh, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within <AuthProvider>');
  }
  return ctx;
}
