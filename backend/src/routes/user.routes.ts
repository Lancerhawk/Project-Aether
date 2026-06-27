import { Router } from 'express';
import { getMe, updateMe, deleteMe } from '../controllers';
import { authenticate, validate } from '../middlewares';
import { updateProfileSchema } from '../validators/user.validator';

const router = Router();

router.get('/me', authenticate as never, getMe);
router.patch('/me', authenticate as never, validate(updateProfileSchema), updateMe);
router.delete('/me', authenticate as never, deleteMe);

export default router;
