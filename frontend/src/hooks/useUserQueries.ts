import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api.service';
import type { User, ApiResponse } from '../types';

// Query Keys
export const userKeys = {
  all: ['users'] as const,
  me: ['users', 'me'] as const,
  list: (params: any) => [...userKeys.all, 'list', params] as const,
};

// Hooks
export const useMe = () => {
  return useQuery({
    queryKey: userKeys.me,
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
      return response.data.data.user;
    },
    retry: false,
  });
};

export const useUsers = (params: any) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ users: User[]; total: number }>>('/auth/users', {
        params,
      });
      return response.data.data;
    },
    enabled: !!params, // Only fetch if params are provided (e.g., for Admin)
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await api.patch(`/auth/users/${userId}/toggle-status`);
      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate all user lists to trigger refetch
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};
