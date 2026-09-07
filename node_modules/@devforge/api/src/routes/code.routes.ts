import { Router } from 'express';
import { body, param, query } from 'express-validator';
import {
  getFileTree,
  getFileContent,
  saveFileContent,
  searchCode,
} from '../controllers/code.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

router.use(authenticate);

router.get('/:id/files', getFileTree);

router.get(
  '/:id/files/content',
  validate([query('path').notEmpty().withMessage('File path is required')]),
  getFileContent
);

router.post(
  '/:id/files',
  validate([
    body('path').notEmpty().withMessage('File path is required'),
    body('content').isString().withMessage('File content must be a string'),
  ]),
  saveFileContent
);

router.get('/:id/search', searchCode);

export default router;
