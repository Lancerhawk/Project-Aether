// @ts-nocheck
import prisma from '../config/prisma';
import { Prisma, TaskStatus } from '@prisma/client';

interface TaskQueryParams {
  userId: string;
  status?: TaskStatus;
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
  page: number;
  pageSize: number;
  includeDeleted?: boolean;
  onlyDeleted?: boolean;
}

function buildWhereClause(params: TaskQueryParams): Prisma.TaskWhereInput {
  const where: Prisma.TaskWhereInput = {
    userId: params.userId,
  };

  if (params.onlyDeleted) {
    where.deletedAt = { not: null };
  } else if (!params.includeDeleted) {
    where.deletedAt = null;
  }

  if (params.status) {
    where.status = params.status;
  }

  if (params.priority) {
    where.priority = params.priority as Prisma.EnumPriorityFilter;
  }

  if (params.energyLevel) {
    where.energyLevel = params.energyLevel as Prisma.EnumEnergyLevelNullableFilter;
  }

  if (params.projectId) {
    where.projectId = params.projectId;
  }

  if (params.goalId) {
    where.goalId = params.goalId;
  }

  if (params.dueDate) {
    const date = new Date(params.dueDate);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    where.dueDate = { gte: date, lt: nextDay };
  } else {
    if (params.dueBefore) {
      where.dueDate = { ...(where.dueDate as object), lte: new Date(params.dueBefore) };
    }
    if (params.dueAfter) {
      where.dueDate = { ...(where.dueDate as object), gte: new Date(params.dueAfter) };
    }
  }

  if (params.tagIds && params.tagIds.length > 0) {
    where.taskTags = {
      some: { tagId: { in: params.tagIds } },
    };
  }

  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: 'insensitive' } },
      { description: { contains: params.search, mode: 'insensitive' } },
      { taskTags: { some: { tag: { name: { contains: params.search, mode: 'insensitive' } } } } },
    ];
  }

  return where;
}

function buildOrderBy(sortBy?: string, sortOrder: 'asc' | 'desc' = 'asc'): Prisma.TaskOrderByWithRelationInput {
  const validSortFields: Record<string, string> = {
    sortOrder: 'sortOrder',
    priority: 'priority',
    dueDate: 'dueDate',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    title: 'title',
  };

  const field = validSortFields[sortBy || 'sortOrder'] || 'sortOrder';
  return { [field]: sortOrder };
}

const taskInclude = {
  subtasks: {
    orderBy: { sortOrder: 'asc' as const },
  },
  taskTags: {
    include: { tag: true },
  },
};

export const taskRepository = {
  findById(id: string, userId: string) {
    return prisma.task.findFirst({
      where: { id, userId, deletedAt: null },
      include: taskInclude,
    });
  },

  findDeletedById(id: string, userId: string) {
    return prisma.task.findFirst({
      where: { id, userId, deletedAt: { not: null } },
      include: taskInclude,
    });
  },

  async findByUserId(params: TaskQueryParams) {
    const where = buildWhereClause(params);
    const orderBy = buildOrderBy(params.sortBy, params.sortOrder);
    const skip = (params.page - 1) * params.pageSize;

    const [tasks, totalItems] = await Promise.all([
      prisma.task.findMany({
        where,
        include: taskInclude,
        orderBy,
        skip,
        take: params.pageSize,
      }),
      prisma.task.count({ where }),
    ]);

    return { tasks, totalItems };
  },

  create(data: Prisma.TaskCreateInput) {
    return prisma.task.create({
      data,
      include: taskInclude,
    });
  },

  update(id: string, data: Prisma.TaskUpdateInput) {
    return prisma.task.update({
      where: { id },
      data,
      include: taskInclude,
    });
  },

  softDelete(id: string) {
    return prisma.task.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  restore(id: string) {
    return prisma.task.update({
      where: { id },
      data: { deletedAt: null, status: 'TODO' },
      include: taskInclude,
    });
  },

  permanentDelete(id: string) {
    return prisma.task.delete({ where: { id } });
  },

  async reorder(items: { id: string; sortOrder: number }[]) {
    return prisma.$transaction(
      items.map((item) =>
        prisma.task.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        })
      )
    );
  },

  async bulkUpdateStatus(ids: string[], userId: string, status: TaskStatus) {
    const now = status === 'COMPLETED' ? new Date() : null;
    return prisma.task.updateMany({
      where: { id: { in: ids }, userId, deletedAt: null },
      data: { status, completedAt: now },
    });
  },

  async bulkSoftDelete(ids: string[], userId: string) {
    return prisma.task.updateMany({
      where: { id: { in: ids }, userId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  },

  async bulkArchive(ids: string[], userId: string) {
    return prisma.task.updateMany({
      where: { id: { in: ids }, userId, deletedAt: null },
      data: { status: 'CANCELLED', deletedAt: new Date() },
    });
  },

  async getNextSortOrder(userId: string): Promise<number> {
    const last = await prisma.task.findFirst({
      where: { userId, deletedAt: null },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });
    return (last?.sortOrder ?? -1) + 1;
  },
};
