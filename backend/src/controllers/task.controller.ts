import { Request, Response, NextFunction } from 'express';
import { taskService } from '../services/task.service';
import { sendSuccess, sendPaginated, buildPaginationMeta } from '../utils';
import { AuthRequest } from '../types';

export async function listTasks(req: Request, res: Response, next: NextFunction) {
  try {
    const { user } = req as AuthRequest;
    const tagIds = req.query.tagIds ? String(req.query.tagIds).split(',') : undefined;
    const { tasks, totalItems } = await taskService.list({
      userId: user.userId,
      status: req.query.status as string,
      priority: req.query.priority as string,
      energyLevel: req.query.energyLevel as string,
      projectId: req.query.projectId as string,
      goalId: req.query.goalId as string,
      tagIds,
      search: req.query.search as string,
      dueDate: req.query.dueDate as string,
      dueBefore: req.query.dueBefore as string,
      dueAfter: req.query.dueAfter as string,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
      page: Number(req.query.page) || 1,
      pageSize: Number(req.query.pageSize) || 20,
    });
    const pagination = buildPaginationMeta(
      Number(req.query.page) || 1,
      Number(req.query.pageSize) || 20,
      totalItems
    );
    sendPaginated(res, tasks, pagination);
  } catch (error) {
    next(error);
  }
}

export async function getTask(req: Request, res: Response, next: NextFunction) {
  try {
    const { user } = req as AuthRequest;
    const task = await taskService.getById(req.params.id, user.userId);
    sendSuccess(res, task);
  } catch (error) {
    next(error);
  }
}

export async function createTask(req: Request, res: Response, next: NextFunction) {
  try {
    const { user } = req as AuthRequest;
    const task = await taskService.create(user.userId, req.body);
    sendSuccess(res, task, 201);
  } catch (error) {
    next(error);
  }
}

export async function updateTask(req: Request, res: Response, next: NextFunction) {
  try {
    const { user } = req as AuthRequest;
    const task = await taskService.update(req.params.id, user.userId, req.body);
    sendSuccess(res, task);
  } catch (error) {
    next(error);
  }
}

export async function removeTask(req: Request, res: Response, next: NextFunction) {
  try {
    const { user } = req as AuthRequest;
    await taskService.remove(req.params.id, user.userId);
    sendSuccess(res, { message: 'Task deleted successfully.' });
  } catch (error) {
    next(error);
  }
}

export async function updateTaskStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { user } = req as AuthRequest;
    const task = await taskService.updateStatus(req.params.id, user.userId, req.body.status);
    sendSuccess(res, task);
  } catch (error) {
    next(error);
  }
}

export async function duplicateTask(req: Request, res: Response, next: NextFunction) {
  try {
    const { user } = req as AuthRequest;
    const task = await taskService.duplicate(req.params.id, user.userId);
    sendSuccess(res, task, 201);
  } catch (error) {
    next(error);
  }
}

export async function restoreTask(req: Request, res: Response, next: NextFunction) {
  try {
    const { user } = req as AuthRequest;
    const task = await taskService.restore(req.params.id, user.userId);
    sendSuccess(res, task);
  } catch (error) {
    next(error);
  }
}

export async function reorderTasks(req: Request, res: Response, next: NextFunction) {
  try {
    const { user } = req as AuthRequest;
    await taskService.reorder(user.userId, req.body.items);
    sendSuccess(res, { message: 'Tasks reordered successfully.' });
  } catch (error) {
    next(error);
  }
}

export async function listDeletedTasks(req: Request, res: Response, next: NextFunction) {
  try {
    const { user } = req as AuthRequest;
    const { tasks, totalItems } = await taskService.listDeleted(
      user.userId,
      Number(req.query.page) || 1,
      Number(req.query.pageSize) || 20
    );
    const pagination = buildPaginationMeta(
      Number(req.query.page) || 1,
      Number(req.query.pageSize) || 20,
      totalItems
    );
    sendPaginated(res, tasks, pagination);
  } catch (error) {
    next(error);
  }
}

export async function permanentDeleteTask(req: Request, res: Response, next: NextFunction) {
  try {
    const { user } = req as AuthRequest;
    await taskService.permanentDelete(req.params.id, user.userId);
    sendSuccess(res, { message: 'Task permanently deleted.' });
  } catch (error) {
    next(error);
  }
}

export async function bulkUpdateTasks(req: Request, res: Response, next: NextFunction) {
  try {
    const { user } = req as AuthRequest;
    await taskService.bulkUpdate(user.userId, req.body.ids, req.body.data);
    sendSuccess(res, { message: 'Tasks updated successfully.' });
  } catch (error) {
    next(error);
  }
}

export async function bulkDeleteTasks(req: Request, res: Response, next: NextFunction) {
  try {
    const { user } = req as AuthRequest;
    await taskService.bulkDelete(user.userId, req.body.ids);
    sendSuccess(res, { message: 'Tasks deleted successfully.' });
  } catch (error) {
    next(error);
  }
}

export async function bulkCompleteTasks(req: Request, res: Response, next: NextFunction) {
  try {
    const { user } = req as AuthRequest;
    await taskService.bulkComplete(user.userId, req.body.ids);
    sendSuccess(res, { message: 'Tasks completed successfully.' });
  } catch (error) {
    next(error);
  }
}

export async function bulkArchiveTasks(req: Request, res: Response, next: NextFunction) {
  try {
    const { user } = req as AuthRequest;
    await taskService.bulkArchive(user.userId, req.body.ids);
    sendSuccess(res, { message: 'Tasks archived successfully.' });
  } catch (error) {
    next(error);
  }
}
