"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runEvaluationBenchmark = exports.getToolCallLogs = exports.getObservabilityReport = void 0;
const observability_service_1 = require("../services/observability.service");
const api_error_1 = require("../utils/api-error");
const response_formatter_1 = require("../utils/response-formatter");
const getObservabilityReport = async (req, res, next) => {
    try {
        if (!req.user)
            throw api_error_1.ApiError.unauthorized();
        const { id: projectId } = req.params;
        const report = await observability_service_1.observabilityService.getObservabilityReport(projectId);
        (0, response_formatter_1.sendSuccess)(res, report, 200);
    }
    catch (error) {
        next(error);
    }
};
exports.getObservabilityReport = getObservabilityReport;
const getToolCallLogs = async (req, res, next) => {
    try {
        if (!req.user)
            throw api_error_1.ApiError.unauthorized();
        const { id: projectId } = req.params;
        const logs = await observability_service_1.observabilityService.getToolCallLogs(projectId);
        (0, response_formatter_1.sendSuccess)(res, logs, 200, { total: logs.length });
    }
    catch (error) {
        next(error);
    }
};
exports.getToolCallLogs = getToolCallLogs;
const runEvaluationBenchmark = async (req, res, next) => {
    try {
        if (!req.user)
            throw api_error_1.ApiError.unauthorized();
        const { id: projectId } = req.params;
        const result = await observability_service_1.observabilityService.runEvaluationBenchmark(projectId);
        (0, response_formatter_1.sendSuccess)(res, result, 201);
    }
    catch (error) {
        next(error);
    }
};
exports.runEvaluationBenchmark = runEvaluationBenchmark;
