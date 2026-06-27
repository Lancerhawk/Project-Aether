import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import settingsRoutes from './settings.routes';

const router = Router();

router.use('/api/v1/health', healthRoutes);
router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/users', userRoutes);
router.use('/api/v1/settings', settingsRoutes);

export default router;
