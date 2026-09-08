import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  runSecurityScan,
  getSecurityHistory,
  autoRemediateVulnerability,
  applyRemediationPatch,
} from '../controllers/security.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

router.use(authenticate);

router.post(
  '/:id/security/scan',
  validate([param('id').notEmpty().withMessage('Project ID is required')]),
  runSecurityScan
);

router.get(
  '/:id/security/history',
  validate([param('id').notEmpty().withMessage('Project ID is required')]),
  getSecurityHistory
);

router.post(
  '/:id/security/remediate',
  validate([
    param('id').notEmpty().withMessage('Project ID is required'),
    body('vulnerabilityId').notEmpty().withMessage('Vulnerability ID is required'),
    body('filePath').notEmpty().withMessage('File path is required'),
  ]),
  autoRemediateVulnerability
);

router.post(
  '/:id/security/apply-remediation',
  validate([
    param('id').notEmpty().withMessage('Project ID is required'),
    body('vulnerabilityId').notEmpty().withMessage('Vulnerability ID is required'),
  ]),
  applyRemediationPatch
);

export default router;
