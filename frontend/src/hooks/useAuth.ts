import { useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api';
import { User } from '../types';

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authApi.getProfile()
        .then((res) => setUser(res.data.data.user))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    localStorage.setItem('token', res.data.data.token);
    setUser(res.data.data.user);
  }, []);

  const register = useCallback(async (email: string, password: string, phone?: string) => {
    await authApi.register({ email, password, phone });
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  return { user, isLoading, login, register, logout };
}
