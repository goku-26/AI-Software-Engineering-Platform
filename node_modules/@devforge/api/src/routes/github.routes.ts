import { Router } from 'express';
import { body } from 'express-validator';
import {
  getAuthUrl,
  handleCallback,
  listRepositories,
  importRepository,
} from '../controllers/github.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

router.use(authenticate);

router.get('/auth-url', getAuthUrl);

router.post(
  '/callback',
  validate([body('code').notEmpty().withMessage('Authorization code is required')]),
  handleCallback
);

router.get('/repositories', listRepositories);

router.post(
  '/import',
  validate([
    body('name').trim().notEmpty().withMessage('Project name is required'),
    body('repositoryUrl').trim().notEmpty().withMessage('Repository URL is required'),
  ]),
  importRepository
);

export default router;
