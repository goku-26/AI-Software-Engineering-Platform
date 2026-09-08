"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const git_controller_1 = require("../controllers/git.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.get('/:id/git/branches', (0, validate_middleware_1.validate)([(0, express_validator_1.param)('id').notEmpty().withMessage('Project ID is required')]), git_controller_1.getProjectBranches);
router.post('/:id/git/branches', (0, validate_middleware_1.validate)([
    (0, express_validator_1.param)('id').notEmpty().withMessage('Project ID is required'),
    (0, express_validator_1.body)('name').notEmpty().withMessage('Branch name is required'),
]), git_controller_1.createTaskBranch);
router.post('/:id/git/pull-requests', (0, validate_middleware_1.validate)([
    (0, express_validator_1.param)('id').notEmpty().withMessage('Project ID is required'),
    (0, express_validator_1.body)('title').notEmpty().withMessage('Pull Request title is required'),
    (0, express_validator_1.body)('sourceBranch').notEmpty().withMessage('Source branch is required'),
]), git_controller_1.createPullRequest);
router.get('/:id/git/pipelines', (0, validate_middleware_1.validate)([(0, express_validator_1.param)('id').notEmpty().withMessage('Project ID is required')]), git_controller_1.getPipelineHistory);
router.post('/:id/git/pipelines/trigger', (0, validate_middleware_1.validate)([(0, express_validator_1.param)('id').notEmpty().withMessage('Project ID is required')]), git_controller_1.triggerDeliveryPipeline);
exports.default = router;
