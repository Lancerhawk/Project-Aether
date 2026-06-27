import prisma from '../config/prisma';
import { Prisma } from '@prisma/client';

export const settingsRepository = {
  findByUserId(userId: string) {
    return prisma.userSettings.findUnique({ where: { userId } });
  },

  create(data: Prisma.UserSettingsCreateInput) {
    return prisma.userSettings.create({ data });
  },

  update(userId: string, data: Prisma.UserSettingsUpdateInput) {
    return prisma.userSettings.update({
      where: { userId },
      data,
    });
  },
};
