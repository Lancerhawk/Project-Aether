'use client';

import { useQuery } from '@tanstack/react-query';
import { taskService } from '@/services/task.service';

export function useTask(id: string | null) {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => taskService.getById(id!),
    enabled: !!id,
  });
}
