"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyRemediationPatch = exports.autoRemediateVulnerability = exports.getSecurityHistory = exports.runSecurityScan = void 0;
const security_service_1 = require("../services/security.service");
const api_error_1 = require("../utils/api-error");
const response_formatter_1 = require("../utils/response-formatter");
const runSecurityScan = async (req, res, next) => {
    try {
        if (!req.user)
            throw api_error_1.ApiError.unauthorized();
        const { id: projectId } = req.params;
        const report = await security_service_1.securityService.runSecurityScan(projectId);
        (0, response_formatter_1.sendSuccess)(res, report, 201);
    }
    catch (error) {
        next(error);
    }
};
exports.runSecurityScan = runSecurityScan;
const getSecurityHistory = async (req, res, next) => {
    try {
        if (!req.user)
            throw api_error_1.ApiError.unauthorized();
        const { id: projectId } = req.params;
        const history = await security_service_1.securityService.getSecurityHistory(projectId);
        (0, response_formatter_1.sendSuccess)(res, history, 200, { total: history.length });
    }
    catch (error) {
        next(error);
    }
};
exports.getSecurityHistory = getSecurityHistory;
const autoRemediateVulnerability = async (req, res, next) => {
    try {
        if (!req.user)
            throw api_error_1.ApiError.unauthorized();
        const { id: projectId } = req.params;
        const { vulnerabilityId, filePath } = req.body;
        const result = await security_service_1.securityService.autoRemediateVulnerability(projectId, {
            vulnerabilityId,
            filePath,
        });
        (0, response_formatter_1.sendSuccess)(res, result, 201);
    }
    catch (error) {
        next(error);
    }
};
exports.autoRemediateVulnerability = autoRemediateVulnerability;
const applyRemediationPatch = async (req, res, next) => {
    try {
        if (!req.user)
            throw api_error_1.ApiError.unauthorized();
        const { id: projectId } = req.params;
        const { vulnerabilityId } = req.body;
        const result = await security_service_1.securityService.applyRemediationPatch(projectId, vulnerabilityId);
        (0, response_formatter_1.sendSuccess)(res, result, 200);
    }
    catch (error) {
        next(error);
    }
};
exports.applyRemediationPatch = applyRemediationPatch;
