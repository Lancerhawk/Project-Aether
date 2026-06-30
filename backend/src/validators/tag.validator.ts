import { z } from 'zod';

export const createTagSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Tag name is required.').max(50),
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Color must be a valid hex color.'),
  }),
});

export const updateTagSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(50).optional(),
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Color must be a valid hex color.').optional(),
  }),
});
