import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getTopology,
  triggerDockerBuild,
  scaleService,
  deployProductionRelease,
} from '../controllers/infrastructure.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

router.use(authenticate);

router.get(
  '/:id/infrastructure/topology',
  validate([param('id').notEmpty().withMessage('Project ID is required')]),
  getTopology
);

router.post(
  '/:id/infrastructure/build',
  validate([
    param('id').notEmpty().withMessage('Project ID is required'),
    body('repository').notEmpty().withMessage('Repository name is required'),
    body('tag').notEmpty().withMessage('Image tag is required'),
  ]),
  triggerDockerBuild
);

router.post(
  '/:id/infrastructure/scale',
  validate([
    param('id').notEmpty().withMessage('Project ID is required'),
    body('containerId').notEmpty().withMessage('Container ID is required'),
    body('targetReplicas').isNumeric().withMessage('Target replicas must be a number'),
  ]),
  scaleService
);

router.post(
  '/:id/infrastructure/release',
  validate([
    param('id').notEmpty().withMessage('Project ID is required'),
    body('versionTag').notEmpty().withMessage('Release version tag is required'),
  ]),
  deployProductionRelease
);

export default router;
