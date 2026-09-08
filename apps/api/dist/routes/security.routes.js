"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const security_controller_1 = require("../controllers/security.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.post('/:id/security/scan', (0, validate_middleware_1.validate)([(0, express_validator_1.param)('id').notEmpty().withMessage('Project ID is required')]), security_controller_1.runSecurityScan);
router.get('/:id/security/history', (0, validate_middleware_1.validate)([(0, express_validator_1.param)('id').notEmpty().withMessage('Project ID is required')]), security_controller_1.getSecurityHistory);
router.post('/:id/security/remediate', (0, validate_middleware_1.validate)([
    (0, express_validator_1.param)('id').notEmpty().withMessage('Project ID is required'),
    (0, express_validator_1.body)('vulnerabilityId').notEmpty().withMessage('Vulnerability ID is required'),
    (0, express_validator_1.body)('filePath').notEmpty().withMessage('File path is required'),
]), security_controller_1.autoRemediateVulnerability);
router.post('/:id/security/apply-remediation', (0, validate_middleware_1.validate)([
    (0, express_validator_1.param)('id').notEmpty().withMessage('Project ID is required'),
    (0, express_validator_1.body)('vulnerabilityId').notEmpty().withMessage('Vulnerability ID is required'),
]), security_controller_1.applyRemediationPatch);
exports.default = router;
