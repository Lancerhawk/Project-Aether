import { apiRequest } from './api';
import { User } from '@/types/user';

interface UpdateProfileData {
  name?: string;
  avatarUrl?: string;
}

export const userService = {
  async getMe(): Promise<User> {
    return apiRequest<User>('/v1/users/me');
  },

  async updateProfile(data: UpdateProfileData): Promise<User> {
    return apiRequest<User>('/v1/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteAccount(): Promise<void> {
    await apiRequest('/v1/users/me', { method: 'DELETE' });
  },
};
