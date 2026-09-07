"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const github_controller_1 = require("../controllers/github.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.get('/auth-url', github_controller_1.getAuthUrl);
router.post('/callback', (0, validate_middleware_1.validate)([(0, express_validator_1.body)('code').notEmpty().withMessage('Authorization code is required')]), github_controller_1.handleCallback);
router.get('/repositories', github_controller_1.listRepositories);
router.post('/import', (0, validate_middleware_1.validate)([
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Project name is required'),
    (0, express_validator_1.body)('repositoryUrl').trim().notEmpty().withMessage('Repository URL is required'),
]), github_controller_1.importRepository);
exports.default = router;
