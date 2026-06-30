import { Request, Response, NextFunction } from 'express';
import { subtaskService } from '../services/subtask.service';
import { sendSuccess } from '../utils';
import { AuthRequest } from '../types';

export async function createSubtask(req: Request, res: Response, next: NextFunction) {
  try {
    const { user } = req as AuthRequest;
    const subtask = await subtaskService.create(req.params.taskId, user.userId, req.body.title);
    sendSuccess(res, subtask, 201);
  } catch (error) {
    next(error);
  }
}

export async function updateSubtask(req: Request, res: Response, next: NextFunction) {
  try {
    const { user } = req as AuthRequest;
    const subtask = await subtaskService.update(req.params.taskId, req.params.id, user.userId, req.body);
    sendSuccess(res, subtask);
  } catch (error) {
    next(error);
  }
}

export async function removeSubtask(req: Request, res: Response, next: NextFunction) {
  try {
    const { user } = req as AuthRequest;
    await subtaskService.remove(req.params.taskId, req.params.id, user.userId);
    sendSuccess(res, { message: 'Subtask deleted successfully.' });
  } catch (error) {
    next(error);
  }
}

export async function reorderSubtasks(req: Request, res: Response, next: NextFunction) {
  try {
    const { user } = req as AuthRequest;
    await subtaskService.reorder(req.params.taskId, user.userId, req.body.items);
    sendSuccess(res, { message: 'Subtasks reordered successfully.' });
  } catch (error) {
    next(error);
  }
}

export async function toggleSubtaskComplete(req: Request, res: Response, next: NextFunction) {
  try {
    const { user } = req as AuthRequest;
    const subtask = await subtaskService.toggleComplete(req.params.taskId, req.params.id, user.userId);
    sendSuccess(res, subtask);
  } catch (error) {
    next(error);
  }
}
