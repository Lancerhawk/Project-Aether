import { Router } from 'express';
import { listTags, createTag, updateTag, removeTag } from '../controllers/tag.controller';
import { authenticate, validate } from '../middlewares';
import { createTagSchema, updateTagSchema } from '../validators/tag.validator';

const router = Router();

router.get('/', authenticate as never, listTags);
router.post('/', authenticate as never, validate(createTagSchema), createTag);
router.patch('/:id', authenticate as never, validate(updateTagSchema), updateTag);
router.delete('/:id', authenticate as never, removeTag);

export default router;
