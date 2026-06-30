// @ts-nocheck
import prisma from '../config/prisma';
import { Prisma } from '@prisma/client';

export const subtaskRepository = {
  findById(id: string) {
    return prisma.subTask.findUnique({ where: { id } });
  },

  findByTaskId(taskId: string) {
    return prisma.subTask.findMany({
      where: { taskId },
      orderBy: { sortOrder: 'asc' },
    });
  },

  create(data: Prisma.SubTaskCreateInput) {
    return prisma.subTask.create({ data });
  },

  update(id: string, data: Prisma.SubTaskUpdateInput) {
    return prisma.subTask.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.subTask.delete({ where: { id } });
  },

  async reorder(items: { id: string; sortOrder: number }[]) {
    return prisma.$transaction(
      items.map((item) =>
        prisma.subTask.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        })
      )
    );
  },

  async getNextSortOrder(taskId: string): Promise<number> {
    const last = await prisma.subTask.findFirst({
      where: { taskId },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });
    return (last?.sortOrder ?? -1) + 1;
  },
};
