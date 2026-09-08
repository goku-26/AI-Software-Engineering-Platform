"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refactorDependency = exports.analyzeSymbolImpact = exports.getDependencyGraph = void 0;
const dependency_service_1 = require("../services/dependency.service");
const api_error_1 = require("../utils/api-error");
const response_formatter_1 = require("../utils/response-formatter");
const getDependencyGraph = async (req, res, next) => {
    try {
        if (!req.user)
            throw api_error_1.ApiError.unauthorized();
        const { id: projectId } = req.params;
        const report = await dependency_service_1.dependencyService.getDependencyGraph(projectId);
        (0, response_formatter_1.sendSuccess)(res, report, 200);
    }
    catch (error) {
        next(error);
    }
};
exports.getDependencyGraph = getDependencyGraph;
const analyzeSymbolImpact = async (req, res, next) => {
    try {
        if (!req.user)
            throw api_error_1.ApiError.unauthorized();
        const { id: projectId } = req.params;
        const { symbolName } = req.body;
        const analysis = await dependency_service_1.dependencyService.analyzeSymbolImpact(projectId, symbolName);
        (0, response_formatter_1.sendSuccess)(res, analysis, 200);
    }
    catch (error) {
        next(error);
    }
};
exports.analyzeSymbolImpact = analyzeSymbolImpact;
const refactorDependency = async (req, res, next) => {
    try {
        if (!req.user)
            throw api_error_1.ApiError.unauthorized();
        const { id: projectId } = req.params;
        const { dependencyId, targetVersion } = req.body;
        const result = await dependency_service_1.dependencyService.refactorDependency(projectId, {
            dependencyId,
            targetVersion,
        });
        (0, response_formatter_1.sendSuccess)(res, result, 200);
    }
    catch (error) {
        next(error);
    }
};
exports.refactorDependency = refactorDependency;
