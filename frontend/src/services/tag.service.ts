import { apiRequest } from './api';
import { Tag, CreateTagInput, UpdateTagInput } from '@/types/tag';

export const tagService = {
  list(search?: string): Promise<Tag[]> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiRequest<Tag[]>(`/v1/tags${qs}`);
  },

  create(data: CreateTagInput): Promise<Tag> {
    return apiRequest<Tag>('/v1/tags', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: UpdateTagInput): Promise<Tag> {
    return apiRequest<Tag>(`/v1/tags/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  remove(id: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/v1/tags/${id}`, {
      method: 'DELETE',
    });
  },
};
