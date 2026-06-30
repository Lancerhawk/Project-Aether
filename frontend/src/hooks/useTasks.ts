'use client';

import { useQuery } from '@tanstack/react-query';
import { taskService } from '@/services/task.service';
import { TaskFilters } from '@/types/task';

export function useTasks(filters: TaskFilters = {}) {
  const queryKey = ['tasks', filters];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await taskService.list(filters);
      return response;
    },
  });

  return {
    tasks: data?.data ?? [],
    pagination: data?.pagination ?? { page: 1, pageSize: 20, totalItems: 0, totalPages: 0 },
    isLoading,
    error,
    refetch,
  };
}
