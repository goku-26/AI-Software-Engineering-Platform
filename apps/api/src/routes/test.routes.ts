import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  runTests,
  getTestHistory,
  generateUnitTest,
  saveUnitTest,
} from '../controllers/test.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

router.use(authenticate);

router.post(
  '/:id/tests/run',
  validate([param('id').notEmpty().withMessage('Project ID is required')]),
  runTests
);

router.get(
  '/:id/tests/history',
  validate([param('id').notEmpty().withMessage('Project ID is required')]),
  getTestHistory
);

router.post(
  '/:id/tests/generate',
  validate([
    param('id').notEmpty().withMessage('Project ID is required'),
    body('filePath').notEmpty().withMessage('File path is required'),
  ]),
  generateUnitTest
);

router.post(
  '/:id/tests/save',
  validate([
    param('id').notEmpty().withMessage('Project ID is required'),
    body('filePath').notEmpty().withMessage('File path is required'),
    body('testCode').isString().withMessage('Test code must be a string'),
  ]),
  saveUnitTest
);

export default router;
