import { Router } from 'express';
import {
  listTasks, getTask, createTask, updateTask, removeTask,
  updateTaskStatus, duplicateTask, restoreTask, reorderTasks,
  listDeletedTasks, permanentDeleteTask,
  bulkUpdateTasks, bulkDeleteTasks, bulkCompleteTasks, bulkArchiveTasks,
} from '../controllers/task.controller';
import { authenticate, validate } from '../middlewares';
import {
  createTaskSchema, updateTaskSchema, updateStatusSchema,
  reorderSchema, bulkIdsSchema, bulkUpdateSchema,
} from '../validators/task.validator';

const router = Router();

router.get('/', authenticate as never, listTasks);
router.post('/', authenticate as never, validate(createTaskSchema), createTask);
router.get('/deleted', authenticate as never, listDeletedTasks);
router.patch('/reorder', authenticate as never, validate(reorderSchema), reorderTasks);
router.patch('/bulk/update', authenticate as never, validate(bulkUpdateSchema), bulkUpdateTasks);
router.delete('/bulk/delete', authenticate as never, validate(bulkIdsSchema), bulkDeleteTasks);
router.patch('/bulk/complete', authenticate as never, validate(bulkIdsSchema), bulkCompleteTasks);
router.patch('/bulk/archive', authenticate as never, validate(bulkIdsSchema), bulkArchiveTasks);
router.get('/:id', authenticate as never, getTask);
router.patch('/:id', authenticate as never, validate(updateTaskSchema), updateTask);
router.delete('/:id', authenticate as never, removeTask);
router.patch('/:id/status', authenticate as never, validate(updateStatusSchema), updateTaskStatus);
router.post('/:id/duplicate', authenticate as never, duplicateTask);
router.post('/:id/restore', authenticate as never, restoreTask);
router.delete('/:id/permanent', authenticate as never, permanentDeleteTask);

export default router;
