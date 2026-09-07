import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  listProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
} from '../controllers/project.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

router.use(authenticate);

router.get('/', listProjects);

router.post(
  '/',
  validate([
    body('name').trim().notEmpty().withMessage('Project name is required'),
    body('description').optional().isString(),
    body('repositoryUrl').optional().isString(),
    body('branch').optional().isString(),
    body('framework').optional().isIn(['react', 'express', 'nextjs', 'node', 'python', 'unknown']),
  ]),
  createProject
);

router.get(
  '/:id',
  validate([param('id').notEmpty().withMessage('Invalid project ID')]),
  getProjectById
);

router.put(
  '/:id',
  validate([
    param('id').notEmpty().withMessage('Invalid project ID'),
    body('name').optional().trim().notEmpty(),
    body('status').optional().isIn(['active', 'archived', 'indexing', 'error']),
  ]),
  updateProject
);

router.delete(
  '/:id',
  validate([param('id').notEmpty().withMessage('Invalid project ID')]),
  deleteProject
);

export default router;
