import { Router } from 'express';
import { githubAuth, refresh, logout } from '../controllers';
import { authenticate, validate } from '../middlewares';
import { githubAuthSchema, refreshTokenSchema } from '../validators/auth.validator';
import { authRateLimiter } from '../middlewares';

const router = Router();

router.post('/github', authRateLimiter, validate(githubAuthSchema), githubAuth);
router.post('/refresh', authRateLimiter, validate(refreshTokenSchema), refresh);
router.post('/logout', authenticate as never, logout);

export default router;
