import { apiRequest, storeTokens, clearTokens, getStoredAccessToken } from './api';
import { User } from '@/types/user';

interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

interface RefreshResponse {
  token: string;
  refreshToken: string;
}

export const authService = {
  async loginWithGitHub(code: string): Promise<AuthResponse> {
    const data = await apiRequest<AuthResponse>('/v1/auth/github', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });

    storeTokens(data.token, data.refreshToken);
    return data;
  },

  async refreshToken(refreshToken: string): Promise<RefreshResponse> {
    const data = await apiRequest<RefreshResponse>('/v1/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    storeTokens(data.token, data.refreshToken);
    return data;
  },

  async logout(): Promise<void> {
    try {
      if (getStoredAccessToken()) {
        await apiRequest('/v1/auth/logout', { method: 'POST' });
      }
    } finally {
      clearTokens();
    }
  },
};
