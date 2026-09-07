import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  executeTask,
  getProjectTasks,
  getTaskById,
  applyPatch,
} from '../controllers/agent.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

router.use(authenticate);

router.post(
  '/:id/agent/execute',
  validate([
    param('id').notEmpty().withMessage('Project ID is required'),
    body('prompt').notEmpty().withMessage('Prompt string is required'),
  ]),
  executeTask
);

router.get(
  '/:id/agent/tasks',
  validate([param('id').notEmpty().withMessage('Project ID is required')]),
  getProjectTasks
);

router.get(
  '/:id/agent/tasks/:taskId',
  validate([param('taskId').notEmpty().withMessage('Task ID is required')]),
  getTaskById
);

router.post(
  '/:id/agent/tasks/:taskId/apply',
  validate([
    param('id').notEmpty().withMessage('Project ID is required'),
    param('taskId').notEmpty().withMessage('Task ID is required'),
  ]),
  applyPatch
);

export default router;
