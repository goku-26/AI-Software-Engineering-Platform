"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const test_controller_1 = require("../controllers/test.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.post('/:id/tests/run', (0, validate_middleware_1.validate)([(0, express_validator_1.param)('id').notEmpty().withMessage('Project ID is required')]), test_controller_1.runTests);
router.get('/:id/tests/history', (0, validate_middleware_1.validate)([(0, express_validator_1.param)('id').notEmpty().withMessage('Project ID is required')]), test_controller_1.getTestHistory);
router.post('/:id/tests/generate', (0, validate_middleware_1.validate)([
    (0, express_validator_1.param)('id').notEmpty().withMessage('Project ID is required'),
    (0, express_validator_1.body)('filePath').notEmpty().withMessage('File path is required'),
]), test_controller_1.generateUnitTest);
router.post('/:id/tests/save', (0, validate_middleware_1.validate)([
    (0, express_validator_1.param)('id').notEmpty().withMessage('Project ID is required'),
    (0, express_validator_1.body)('filePath').notEmpty().withMessage('File path is required'),
    (0, express_validator_1.body)('testCode').isString().withMessage('Test code must be a string'),
]), test_controller_1.saveUnitTest);
exports.default = router;
