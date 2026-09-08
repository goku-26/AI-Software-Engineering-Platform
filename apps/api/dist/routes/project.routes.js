"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const project_controller_1 = require("../controllers/project.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.get('/', project_controller_1.listProjects);
router.post('/', (0, validate_middleware_1.validate)([
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Project name is required'),
    (0, express_validator_1.body)('description').optional().isString(),
    (0, express_validator_1.body)('repositoryUrl').optional().isString(),
    (0, express_validator_1.body)('branch').optional().isString(),
    (0, express_validator_1.body)('framework').optional().isIn(['react', 'express', 'nextjs', 'node', 'python', 'unknown']),
]), project_controller_1.createProject);
router.get('/:id', (0, validate_middleware_1.validate)([(0, express_validator_1.param)('id').notEmpty().withMessage('Invalid project ID')]), project_controller_1.getProjectById);
router.put('/:id', (0, validate_middleware_1.validate)([
    (0, express_validator_1.param)('id').notEmpty().withMessage('Invalid project ID'),
    (0, express_validator_1.body)('name').optional().trim().notEmpty(),
    (0, express_validator_1.body)('status').optional().isIn(['active', 'archived', 'indexing', 'error']),
]), project_controller_1.updateProject);
router.delete('/:id', (0, validate_middleware_1.validate)([(0, express_validator_1.param)('id').notEmpty().withMessage('Invalid project ID')]), project_controller_1.deleteProject);
exports.default = router;
