"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const infrastructure_controller_1 = require("../controllers/infrastructure.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.get('/:id/infrastructure/topology', (0, validate_middleware_1.validate)([(0, express_validator_1.param)('id').notEmpty().withMessage('Project ID is required')]), infrastructure_controller_1.getTopology);
router.post('/:id/infrastructure/build', (0, validate_middleware_1.validate)([
    (0, express_validator_1.param)('id').notEmpty().withMessage('Project ID is required'),
    (0, express_validator_1.body)('repository').notEmpty().withMessage('Repository name is required'),
    (0, express_validator_1.body)('tag').notEmpty().withMessage('Image tag is required'),
]), infrastructure_controller_1.triggerDockerBuild);
router.post('/:id/infrastructure/scale', (0, validate_middleware_1.validate)([
    (0, express_validator_1.param)('id').notEmpty().withMessage('Project ID is required'),
    (0, express_validator_1.body)('containerId').notEmpty().withMessage('Container ID is required'),
    (0, express_validator_1.body)('targetReplicas').isNumeric().withMessage('Target replicas must be a number'),
]), infrastructure_controller_1.scaleService);
router.post('/:id/infrastructure/release', (0, validate_middleware_1.validate)([
    (0, express_validator_1.param)('id').notEmpty().withMessage('Project ID is required'),
    (0, express_validator_1.body)('versionTag').notEmpty().withMessage('Release version tag is required'),
]), infrastructure_controller_1.deployProductionRelease);
exports.default = router;
