import { userRepository } from '../repositories/user.repository';
import { AppError } from '../utils';

export const userService = {
  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found.', 404, 'NOT_FOUND');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    };
  },

  async updateProfile(userId: string, data: { name?: string; avatarUrl?: string }) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found.', 404, 'NOT_FOUND');
    }

    const updated = await userRepository.update(userId, data);

    return {
      id: updated.id,
      email: updated.email,
      name: updated.name,
      avatarUrl: updated.avatarUrl,
      lastLoginAt: updated.lastLoginAt,
      createdAt: updated.createdAt,
    };
  },

  async deleteAccount(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found.', 404, 'NOT_FOUND');
    }

    await userRepository.delete(userId);
  },
};
