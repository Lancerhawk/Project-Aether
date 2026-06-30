// @ts-nocheck
import prisma from '../config/prisma';

export const tagRepository = {
  findById(id: string) {
    return prisma.tag.findUnique({ where: { id } });
  },

  findByUserId(userId: string) {
    return prisma.tag.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
  },

  search(userId: string, query: string) {
    return prisma.tag.findMany({
      where: {
        userId,
        name: { contains: query, mode: 'insensitive' },
      },
      orderBy: { name: 'asc' },
    });
  },

  create(data: { userId: string; name: string; color: string }) {
    return prisma.tag.create({ data });
  },

  update(id: string, data: { name?: string; color?: string }) {
    return prisma.tag.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.tag.delete({ where: { id } });
  },

  assignToTask(taskId: string, tagId: string) {
    return prisma.taskTag.create({
      data: { taskId, tagId },
      include: { tag: true },
    });
  },

  removeFromTask(taskId: string, tagId: string) {
    return prisma.taskTag.deleteMany({
      where: { taskId, tagId },
    });
  },

  async syncTaskTags(taskId: string, tagIds: string[]) {
    return prisma.$transaction(async (tx) => {
      await tx.taskTag.deleteMany({ where: { taskId } });
      if (tagIds.length > 0) {
        await tx.taskTag.createMany({
          data: tagIds.map((tagId) => ({ taskId, tagId })),
        });
      }
    });
  },
};
