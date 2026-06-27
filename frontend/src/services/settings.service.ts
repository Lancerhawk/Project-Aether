import { apiRequest } from './api';
import { UserSettings } from '@/types/user';

export const settingsService = {
  async getSettings(): Promise<UserSettings> {
    return apiRequest<UserSettings>('/v1/settings');
  },

  async updateSettings(data: Partial<UserSettings>): Promise<UserSettings> {
    return apiRequest<UserSettings>('/v1/settings', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};
