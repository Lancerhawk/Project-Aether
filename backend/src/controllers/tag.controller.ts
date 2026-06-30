import { Request, Response, NextFunction } from 'express';
import { tagService } from '../services/tag.service';
import { sendSuccess } from '../utils';
import { AuthRequest } from '../types';

export async function listTags(req: Request, res: Response, next: NextFunction) {
  try {
    const { user } = req as AuthRequest;
    const query = req.query.search as string;
    const tags = query
      ? await tagService.search(user.userId, query)
      : await tagService.list(user.userId);
    sendSuccess(res, tags);
  } catch (error) {
    next(error);
  }
}

export async function createTag(req: Request, res: Response, next: NextFunction) {
  try {
    const { user } = req as AuthRequest;
    const tag = await tagService.create(user.userId, req.body);
    sendSuccess(res, tag, 201);
  } catch (error) {
    next(error);
  }
}

export async function updateTag(req: Request, res: Response, next: NextFunction) {
  try {
    const { user } = req as AuthRequest;
    const tag = await tagService.update(req.params.id, user.userId, req.body);
    sendSuccess(res, tag);
  } catch (error) {
    next(error);
  }
}

export async function removeTag(req: Request, res: Response, next: NextFunction) {
  try {
    const { user } = req as AuthRequest;
    await tagService.remove(req.params.id, user.userId);
    sendSuccess(res, { message: 'Tag deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
