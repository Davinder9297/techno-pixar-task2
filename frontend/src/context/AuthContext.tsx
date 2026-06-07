import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { User, AuthResponse } from '../types';
import api from '../services/api.service';
import { useMe } from '../hooks/useUserQueries';
import { queryClient } from '../config/queryClient';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Use TanStack Query to fetch user profile
  const { data: meData, isLoading: isMeLoading, refetch: refetchMe } = useMe();

  useEffect(() => {
    if (meData) {
      setUser(meData);
    } else {
      setUser(null);
    }
  }, [meData]);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const response = await api.post<AuthResponse>('/auth/login', { email, password });
      const { user, token } = response.data.data;
      localStorage.setItem('token', token);
      setUser(user);
      // After login, invalidate 'me' query and refetch
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
      refetchMe();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      throw err;
    }
  }, [refetchMe]);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 403 && error.response?.data?.message?.includes('deactivated')) {
          localStorage.removeItem('token');
          setUser(null);
          queryClient.clear(); // Clear all queries on deactivation
          window.location.href = '/login?message=' + encodeURIComponent(error.response.data.message);
        }
        return Promise.reject(error);
      }
    );
    return () => api.interceptors.response.eject(interceptor);
  }, []);

  const register = useCallback(async (userData: any) => {
    setError(null);
    try {
      const response = await api.post<AuthResponse>('/auth/register', userData);
      const { user, token } = response.data.data;
      localStorage.setItem('token', token);
      setUser(user);
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
      refetchMe();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  }, [refetchMe]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    queryClient.clear(); // Clear all queries on logout
  }, []);

  const contextValue = useMemo(() => ({
    user,
    loading: isMeLoading,
    login,
    register,
    logout,
    error
  }), [user, isMeLoading, login, register, logout, error]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
