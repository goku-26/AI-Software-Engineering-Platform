import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getDependencyGraph,
  analyzeSymbolImpact,
  refactorDependency,
} from '../controllers/dependency.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

router.use(authenticate);

router.get(
  '/:id/dependencies/graph',
  validate([param('id').notEmpty().withMessage('Project ID is required')]),
  getDependencyGraph
);

router.post(
  '/:id/dependencies/impact-analysis',
  validate([
    param('id').notEmpty().withMessage('Project ID is required'),
    body('symbolName').notEmpty().withMessage('Symbol name is required'),
  ]),
  analyzeSymbolImpact
);

router.post(
  '/:id/dependencies/refactor',
  validate([
    param('id').notEmpty().withMessage('Project ID is required'),
    body('dependencyId').notEmpty().withMessage('Dependency ID is required'),
  ]),
  refactorDependency
);

export default router;
