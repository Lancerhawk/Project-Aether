import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { sendSuccess } from '../utils';
import { AuthRequest } from '../types';

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const { user } = req as AuthRequest;
    const profile = await userService.getProfile(user.userId);
    sendSuccess(res, profile);
  } catch (error) {
    next(error);
  }
}

export async function updateMe(req: Request, res: Response, next: NextFunction) {
  try {
    const { user } = req as AuthRequest;
    const profile = await userService.updateProfile(user.userId, req.body);
    sendSuccess(res, profile);
  } catch (error) {
    next(error);
  }
}

export async function deleteMe(req: Request, res: Response, next: NextFunction) {
  try {
    const { user } = req as AuthRequest;
    await userService.deleteAccount(user.userId);
    sendSuccess(res, { message: 'Account deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
