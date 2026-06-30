// @ts-nocheck
import { taskRepository } from '../repositories/task.repository';
import { tagRepository } from '../repositories/tag.repository';
import { AppError } from '../utils';
type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
type EnergyLevel = 'LOW' | 'MEDIUM' | 'HIGH';
import prisma from '../config/prisma';

interface CreateTaskData {
  title: string;
  description?: string;
  projectId?: string;
  goalId?: string;
  priority?: string;
  energyLevel?: string;
  estimatedMinutes?: number;
  dueDate?: string;
  tagIds?: string[];
  subtasks?: { title: string }[];
}

interface UpdateTaskData {
  title?: string;
  description?: string;
  projectId?: string | null;
  goalId?: string | null;
  priority?: string;
  energyLevel?: string | null;
  estimatedMinutes?: number | null;
  dueDate?: string | null;
  tagIds?: string[];
}

interface TaskQueryParams {
  userId: string;
  status?: string;
  priority?: string;
  energyLevel?: string;
  projectId?: string;
  goalId?: string;
  tagIds?: string[];
  search?: string;
  dueDate?: string;
  dueBefore?: string;
  dueAfter?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export const taskService = {
  async list(params: TaskQueryParams) {
    const page = Math.max(1, params.page || 1);
    const pageSize = Math.min(100, Math.max(1, params.pageSize || 20));

    return taskRepository.findByUserId({
      ...params,
      status: params.status as TaskStatus | undefined,
      page,
      pageSize,
    });
  },

  async listDeleted(userId: string, page: number = 1, pageSize: number = 20) {
    return taskRepository.findByUserId({
      userId,
      page: Math.max(1, page),
      pageSize: Math.min(100, Math.max(1, pageSize)),
      onlyDeleted: true,
    });
  },

  async getById(id: string, userId: string) {
    const task = await taskRepository.findById(id, userId);
    if (!task) {
      throw new AppError('Task not found.', 404, 'NOT_FOUND');
    }
    return task;
  },

  async create(userId: string, data: CreateTaskData) {
    const sortOrder = await taskRepository.getNextSortOrder(userId);

    const task = await prisma.$transaction(async (tx) => {
      const created = await tx.task.create({
        data: {
          userId,
          title: data.title,
          description: data.description,
          projectId: data.projectId,
          goalId: data.goalId,
          priority: (data.priority as Priority) || 'MEDIUM',
          energyLevel: (data.energyLevel as EnergyLevel) || undefined,
          estimatedMinutes: data.estimatedMinutes,
          dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
          sortOrder,
        },
        include: {
          subtasks: { orderBy: { sortOrder: 'asc' } },
          taskTags: { include: { tag: true } },
        },
      });

      if (data.subtasks && data.subtasks.length > 0) {
        await tx.subTask.createMany({
          data: data.subtasks.map((st, idx) => ({
            taskId: created.id,
            title: st.title,
            sortOrder: idx,
          })),
        });
      }

      if (data.tagIds && data.tagIds.length > 0) {
        await tx.taskTag.createMany({
          data: data.tagIds.map((tagId) => ({
            taskId: created.id,
            tagId,
          })),
        });
      }

      return tx.task.findUnique({
        where: { id: created.id },
        include: {
          subtasks: { orderBy: { sortOrder: 'asc' } },
          taskTags: { include: { tag: true } },
        },
      });
    });

    return task;
  },

  async update(id: string, userId: string, data: UpdateTaskData) {
    const existing = await taskRepository.findById(id, userId);
    if (!existing) {
      throw new AppError('Task not found.', 404, 'NOT_FOUND');
    }

    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.projectId !== undefined) updateData.projectId = data.projectId;
    if (data.goalId !== undefined) updateData.goalId = data.goalId;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.energyLevel !== undefined) updateData.energyLevel = data.energyLevel;
    if (data.estimatedMinutes !== undefined) updateData.estimatedMinutes = data.estimatedMinutes;
    if (data.dueDate !== undefined) {
      updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    }

    const task = await taskRepository.update(id, updateData);

    if (data.tagIds !== undefined) {
      await tagRepository.syncTaskTags(id, data.tagIds);
      return taskRepository.findById(id, userId);
    }

    return task;
  },

  async updateStatus(id: string, userId: string, status: TaskStatus) {
    const existing = await taskRepository.findById(id, userId);
    if (!existing) {
      throw new AppError('Task not found.', 404, 'NOT_FOUND');
    }

    const completedAt = status === 'COMPLETED' ? new Date() : null;
    return taskRepository.update(id, { status, completedAt });
  },

  async remove(id: string, userId: string) {
    const existing = await taskRepository.findById(id, userId);
    if (!existing) {
      throw new AppError('Task not found.', 404, 'NOT_FOUND');
    }
    await taskRepository.softDelete(id);
  },

  async restore(id: string, userId: string) {
    const existing = await taskRepository.findDeletedById(id, userId);
    if (!existing) {
      throw new AppError('Task not found in trash.', 404, 'NOT_FOUND');
    }
    return taskRepository.restore(id);
  },

  async permanentDelete(id: string, userId: string) {
    const existing = await taskRepository.findDeletedById(id, userId);
    if (!existing) {
      throw new AppError('Task not found in trash.', 404, 'NOT_FOUND');
    }
    await taskRepository.permanentDelete(id);
  },

  async duplicate(id: string, userId: string) {
    const existing = await taskRepository.findById(id, userId);
    if (!existing) {
      throw new AppError('Task not found.', 404, 'NOT_FOUND');
    }

    const sortOrder = await taskRepository.getNextSortOrder(userId);

    return prisma.$transaction(async (tx) => {
      const created = await tx.task.create({
        data: {
          userId,
          title: `${existing.title} (copy)`,
          description: existing.description,
          projectId: existing.projectId,
          goalId: existing.goalId,
          priority: existing.priority,
          energyLevel: existing.energyLevel,
          estimatedMinutes: existing.estimatedMinutes,
          dueDate: existing.dueDate,
          sortOrder,
          status: 'TODO',
        },
      });

      if (existing.subtasks.length > 0) {
        await tx.subTask.createMany({
          data: existing.subtasks.map((st) => ({
            taskId: created.id,
            title: st.title,
            sortOrder: st.sortOrder,
          })),
        });
      }

      if (existing.taskTags.length > 0) {
        await tx.taskTag.createMany({
          data: existing.taskTags.map((tt) => ({
            taskId: created.id,
            tagId: tt.tagId,
          })),
        });
      }

      return tx.task.findUnique({
        where: { id: created.id },
        include: {
          subtasks: { orderBy: { sortOrder: 'asc' } },
          taskTags: { include: { tag: true } },
        },
      });
    });
  },

  async reorder(userId: string, items: { id: string; sortOrder: number }[]) {
    return taskRepository.reorder(items);
  },

  async bulkUpdate(userId: string, ids: string[], data: { status?: string; priority?: string }) {
    if (data.status) {
      return taskRepository.bulkUpdateStatus(ids, userId, data.status as TaskStatus);
    }
    return (prisma as any).task.updateMany({
      where: { id: { in: ids }, userId, deletedAt: null },
      data: data as any,
    });
  },

  async bulkDelete(userId: string, ids: string[]) {
    return taskRepository.bulkSoftDelete(ids, userId);
  },

  async bulkComplete(userId: string, ids: string[]) {
    return taskRepository.bulkUpdateStatus(ids, userId, 'COMPLETED');
  },

  async bulkArchive(userId: string, ids: string[]) {
    return taskRepository.bulkArchive(ids, userId);
  },
};
