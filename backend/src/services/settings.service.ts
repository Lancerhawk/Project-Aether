import { settingsRepository } from '../repositories/settings.repository';
import { AppError } from '../utils';
import { Prisma } from '@prisma/client';

export const settingsService = {
  async getSettings(userId: string) {
    let settings = await settingsRepository.findByUserId(userId);

    if (!settings) {
      settings = await settingsRepository.create({
        user: { connect: { id: userId } },
      });
    }

    const { id: _id, userId: _userId, ...rest } = settings;
    return rest;
  },

  async updateSettings(userId: string, data: Prisma.UserSettingsUpdateInput) {
    let settings = await settingsRepository.findByUserId(userId);

    if (!settings) {
      settings = await settingsRepository.create({
        user: { connect: { id: userId } },
      });
    }

    const updated = await settingsRepository.update(userId, data);

    const { id: _id, userId: _userId, ...rest } = updated;
    return rest;
  },
};
