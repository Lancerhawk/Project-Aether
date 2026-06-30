import { z } from 'zod';

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required.').max(500),
    description: z.string().max(5000).optional(),
    projectId: z.string().uuid().optional().nullable(),
    goalId: z.string().uuid().optional().nullable(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    energyLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional().nullable(),
    estimatedMinutes: z.number().int().min(1).max(1440).optional().nullable(),
    dueDate: z.string().datetime().optional().nullable(),
    tagIds: z.array(z.string().uuid()).optional(),
    subtasks: z.array(z.object({ title: z.string().min(1).max(500) })).optional(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(500).optional(),
    description: z.string().max(5000).optional().nullable(),
    projectId: z.string().uuid().optional().nullable(),
    goalId: z.string().uuid().optional().nullable(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    energyLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional().nullable(),
    estimatedMinutes: z.number().int().min(1).max(1440).optional().nullable(),
    dueDate: z.string().datetime().optional().nullable(),
    tagIds: z.array(z.string().uuid()).optional(),
  }),
});

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  }),
});

export const reorderSchema = z.object({
  body: z.object({
    items: z.array(z.object({
      id: z.string().uuid(),
      sortOrder: z.number().int().min(0),
    })).min(1),
  }),
});

export const bulkIdsSchema = z.object({
  body: z.object({
    ids: z.array(z.string().uuid()).min(1).max(100),
  }),
});

export const bulkUpdateSchema = z.object({
  body: z.object({
    ids: z.array(z.string().uuid()).min(1).max(100),
    data: z.object({
      status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
      priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    }),
  }),
});

export const taskQuerySchema = z.object({
  query: z.object({
    status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    energyLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    projectId: z.string().uuid().optional(),
    goalId: z.string().uuid().optional(),
    tagIds: z.string().optional(),
    search: z.string().optional(),
    dueDate: z.string().optional(),
    dueBefore: z.string().optional(),
    dueAfter: z.string().optional(),
    sortBy: z.enum(['sortOrder', 'priority', 'dueDate', 'createdAt', 'updatedAt', 'title']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    page: z.coerce.number().int().min(1).optional(),
    pageSize: z.coerce.number().int().min(1).max(100).optional(),
  }).passthrough(),
});
