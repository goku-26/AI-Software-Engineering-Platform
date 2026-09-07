"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const code_controller_1 = require("../controllers/code.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.get('/:id/files', code_controller_1.getFileTree);
router.get('/:id/files/content', (0, validate_middleware_1.validate)([(0, express_validator_1.query)('path').notEmpty().withMessage('File path is required')]), code_controller_1.getFileContent);
router.post('/:id/files', (0, validate_middleware_1.validate)([
    (0, express_validator_1.body)('path').notEmpty().withMessage('File path is required'),
    (0, express_validator_1.body)('content').isString().withMessage('File content must be a string'),
]), code_controller_1.saveFileContent);
router.get('/:id/search', code_controller_1.searchCode);
exports.default = router;
