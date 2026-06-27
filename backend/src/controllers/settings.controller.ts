import { Request, Response, NextFunction } from 'express';
import { settingsService } from '../services/settings.service';
import { sendSuccess } from '../utils';
import { AuthRequest } from '../types';

export async function getSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const { user } = req as AuthRequest;
    const settings = await settingsService.getSettings(user.userId);
    sendSuccess(res, settings);
  } catch (error) {
    next(error);
  }
}

export async function updateSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const { user } = req as AuthRequest;
    const settings = await settingsService.updateSettings(user.userId, req.body);
    sendSuccess(res, settings);
  } catch (error) {
    next(error);
  }
}
