import { z } from 'zod';

export const githubAuthSchema = z.object({
  body: z.object({
    code: z.string().min(1, 'Authorization code is required.'),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required.'),
  }),
});
