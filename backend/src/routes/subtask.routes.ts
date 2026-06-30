import { Router } from 'express';
import {
  createSubtask, updateSubtask, removeSubtask,
  reorderSubtasks, toggleSubtaskComplete,
} from '../controllers/subtask.controller';
import { authenticate, validate } from '../middlewares';
import { createSubtaskSchema, updateSubtaskSchema, reorderSubtasksSchema } from '../validators/subtask.validator';

const router = Router({ mergeParams: true });

router.post('/', authenticate as never, validate(createSubtaskSchema), createSubtask);
router.patch('/reorder', authenticate as never, validate(reorderSubtasksSchema), reorderSubtasks);
router.patch('/:id', authenticate as never, validate(updateSubtaskSchema), updateSubtask);
router.delete('/:id', authenticate as never, removeSubtask);
router.patch('/:id/toggle', authenticate as never, toggleSubtaskComplete);

export default router;
