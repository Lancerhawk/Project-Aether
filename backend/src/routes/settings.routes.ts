import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers';
import { authenticate, validate } from '../middlewares';
import { updateSettingsSchema } from '../validators/settings.validator';

const router = Router();

router.get('/', authenticate as never, getSettings);
router.patch('/', authenticate as never, validate(updateSettingsSchema), updateSettings);

export default router;
