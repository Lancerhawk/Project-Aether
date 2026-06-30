import { z } from 'zod';

export const createSubtaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required.').max(500),
  }),
});

export const updateSubtaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(500).optional(),
    isCompleted: z.boolean().optional(),
  }),
});

export const reorderSubtasksSchema = z.object({
  body: z.object({
    items: z.array(z.object({
      id: z.string().uuid(),
      sortOrder: z.number().int().min(0),
    })).min(1),
  }),
});
