"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const agent_controller_1 = require("../controllers/agent.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.post('/:id/agent/execute', (0, validate_middleware_1.validate)([
    (0, express_validator_1.param)('id').notEmpty().withMessage('Project ID is required'),
    (0, express_validator_1.body)('prompt').notEmpty().withMessage('Prompt string is required'),
]), agent_controller_1.executeTask);
router.get('/:id/agent/tasks', (0, validate_middleware_1.validate)([(0, express_validator_1.param)('id').notEmpty().withMessage('Project ID is required')]), agent_controller_1.getProjectTasks);
router.get('/:id/agent/tasks/:taskId', (0, validate_middleware_1.validate)([(0, express_validator_1.param)('taskId').notEmpty().withMessage('Task ID is required')]), agent_controller_1.getTaskById);
router.post('/:id/agent/tasks/:taskId/apply', (0, validate_middleware_1.validate)([
    (0, express_validator_1.param)('id').notEmpty().withMessage('Project ID is required'),
    (0, express_validator_1.param)('taskId').notEmpty().withMessage('Task ID is required'),
]), agent_controller_1.applyPatch);
exports.default = router;
