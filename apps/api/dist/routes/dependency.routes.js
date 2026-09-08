"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const dependency_controller_1 = require("../controllers/dependency.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.get('/:id/dependencies/graph', (0, validate_middleware_1.validate)([(0, express_validator_1.param)('id').notEmpty().withMessage('Project ID is required')]), dependency_controller_1.getDependencyGraph);
router.post('/:id/dependencies/impact-analysis', (0, validate_middleware_1.validate)([
    (0, express_validator_1.param)('id').notEmpty().withMessage('Project ID is required'),
    (0, express_validator_1.body)('symbolName').notEmpty().withMessage('Symbol name is required'),
]), dependency_controller_1.analyzeSymbolImpact);
router.post('/:id/dependencies/refactor', (0, validate_middleware_1.validate)([
    (0, express_validator_1.param)('id').notEmpty().withMessage('Project ID is required'),
    (0, express_validator_1.body)('dependencyId').notEmpty().withMessage('Dependency ID is required'),
]), dependency_controller_1.refactorDependency);
exports.default = router;
