import { apiRequest } from './api';
import { Task, CreateTaskInput, UpdateTaskInput, TaskFilters, PaginatedResponse } from '@/types/task';
import { TaskStatus } from '@/types/enums';

function buildQueryString(filters: TaskFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const taskService = {
  list(filters: TaskFilters = {}): Promise<PaginatedResponse<Task>> {
    return apiRequest<PaginatedResponse<Task>>(`/v1/tasks${buildQueryString(filters)}`);
  },

  listDeleted(page: number = 1, pageSize: number = 20): Promise<PaginatedResponse<Task>> {
    return apiRequest<PaginatedResponse<Task>>(`/v1/tasks/deleted?page=${page}&pageSize=${pageSize}`);
  },

  getById(id: string): Promise<Task> {
    return apiRequest<Task>(`/v1/tasks/${id}`);
  },

  create(data: CreateTaskInput): Promise<Task> {
    return apiRequest<Task>('/v1/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: UpdateTaskInput): Promise<Task> {
    return apiRequest<Task>(`/v1/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  remove(id: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/v1/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  permanentDelete(id: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/v1/tasks/${id}/permanent`, {
      method: 'DELETE',
    });
  },

  updateStatus(id: string, status: TaskStatus): Promise<Task> {
    return apiRequest<Task>(`/v1/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  duplicate(id: string): Promise<Task> {
    return apiRequest<Task>(`/v1/tasks/${id}/duplicate`, {
      method: 'POST',
    });
  },

  restore(id: string): Promise<Task> {
    return apiRequest<Task>(`/v1/tasks/${id}/restore`, {
      method: 'POST',
    });
  },

  reorder(items: { id: string; sortOrder: number }[]): Promise<{ message: string }> {
    return apiRequest<{ message: string }>('/v1/tasks/reorder', {
      method: 'PATCH',
      body: JSON.stringify({ items }),
    });
  },

  bulkUpdate(ids: string[], data: { status?: TaskStatus; priority?: string }, options?: RequestInit): Promise<{ message: string }> {
    return apiRequest<{ message: string }>('/v1/tasks/bulk/update', {
      method: 'PATCH',
      body: JSON.stringify({ ids, data }),
      ...options,
    });
  },

  bulkDelete(ids: string[]): Promise<{ message: string }> {
    return apiRequest<{ message: string }>('/v1/tasks/bulk/delete', {
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
  },

  bulkComplete(ids: string[], options?: RequestInit): Promise<{ message: string }> {
    return apiRequest<{ message: string }>('/v1/tasks/bulk/complete', {
      method: 'PATCH',
      body: JSON.stringify({ ids }),
      ...options,
    });
  },

  bulkArchive(ids: string[]): Promise<{ message: string }> {
    return apiRequest<{ message: string }>('/v1/tasks/bulk/archive', {
      method: 'PATCH',
      body: JSON.stringify({ ids }),
    });
  },
};
