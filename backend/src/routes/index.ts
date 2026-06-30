import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import settingsRoutes from './settings.routes';
import taskRoutes from './task.routes';
import subtaskRoutes from './subtask.routes';
import tagRoutes from './tag.routes';

const router = Router();

router.use('/api/v1/health', healthRoutes);
router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/users', userRoutes);
router.use('/api/v1/settings', settingsRoutes);
router.use('/api/v1/tasks', taskRoutes);
router.use('/api/v1/tasks/:taskId/subtasks', subtaskRoutes);
router.use('/api/v1/tags', tagRoutes);

export default router;

