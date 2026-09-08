import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getProjectBranches,
  createTaskBranch,
  createPullRequest,
  getPipelineHistory,
  triggerDeliveryPipeline,
} from '../controllers/git.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

router.use(authenticate);

router.get(
  '/:id/git/branches',
  validate([param('id').notEmpty().withMessage('Project ID is required')]),
  getProjectBranches
);

router.post(
  '/:id/git/branches',
  validate([
    param('id').notEmpty().withMessage('Project ID is required'),
    body('name').notEmpty().withMessage('Branch name is required'),
  ]),
  createTaskBranch
);

router.post(
  '/:id/git/pull-requests',
  validate([
    param('id').notEmpty().withMessage('Project ID is required'),
    body('title').notEmpty().withMessage('Pull Request title is required'),
    body('sourceBranch').notEmpty().withMessage('Source branch is required'),
  ]),
  createPullRequest
);

router.get(
  '/:id/git/pipelines',
  validate([param('id').notEmpty().withMessage('Project ID is required')]),
  getPipelineHistory
);

router.post(
  '/:id/git/pipelines/trigger',
  validate([param('id').notEmpty().withMessage('Project ID is required')]),
  triggerDeliveryPipeline
);

export default router;
