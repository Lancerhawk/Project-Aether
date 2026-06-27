import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess } from '../utils';
import { AuthRequest } from '../types';

export async function githubAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const { code } = req.body;
    const result = await authService.authenticateWithGitHub(code);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshTokens(refreshToken);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const { user } = req as AuthRequest;
    await authService.logout(user.userId);
    sendSuccess(res, { message: 'Logged out successfully.' });
  } catch (error) {
    next(error);
  }
}
