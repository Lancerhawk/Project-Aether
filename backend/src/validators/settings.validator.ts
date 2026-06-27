import { z } from 'zod';

export const updateSettingsSchema = z.object({
  body: z.object({
    theme: z.enum(['DARK', 'LIGHT', 'SYSTEM']).optional(),
    timezone: z.string().min(1).max(100).optional(),
    defaultPlanStartTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Invalid time format. Use HH:MM.').optional(),
    defaultPlanEndTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Invalid time format. Use HH:MM.').optional(),
    pomodoroWorkMinutes: z.number().int().min(1).max(120).optional(),
    pomodoroBreakMinutes: z.number().int().min(1).max(60).optional(),
    pomodoroLongBreakMinutes: z.number().int().min(1).max(60).optional(),
    weekStartsOn: z.enum(['SUNDAY', 'MONDAY']).optional(),
    emailNotifications: z.boolean().optional(),
    pushNotifications: z.boolean().optional(),
    dailyPlanningReminder: z.boolean().optional(),
    dailyReviewReminder: z.boolean().optional(),
  }),
});
