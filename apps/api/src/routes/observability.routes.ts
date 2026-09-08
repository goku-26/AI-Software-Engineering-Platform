import { Router } from 'express';
import { param } from 'express-validator';
import {
  getObservabilityReport,
  getToolCallLogs,
  runEvaluationBenchmark,
} from '../controllers/observability.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

router.use(authenticate);

router.get(
  '/:id/observability/report',
  validate([param('id').notEmpty().withMessage('Project ID is required')]),
  getObservabilityReport
);

router.get(
  '/:id/observability/logs',
  validate([param('id').notEmpty().withMessage('Project ID is required')]),
  getToolCallLogs
);

router.post(
  '/:id/observability/benchmark',
  validate([param('id').notEmpty().withMessage('Project ID is required')]),
  runEvaluationBenchmark
);

export default router;
