"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveUnitTest = exports.generateUnitTest = exports.getTestHistory = exports.runTests = void 0;
const test_runner_service_1 = require("../services/test-runner.service");
const api_error_1 = require("../utils/api-error");
const response_formatter_1 = require("../utils/response-formatter");
const runTests = async (req, res, next) => {
    try {
        if (!req.user)
            throw api_error_1.ApiError.unauthorized();
        const { id: projectId } = req.params;
        const testRun = await test_runner_service_1.testRunnerService.runProjectTests(projectId);
        (0, response_formatter_1.sendSuccess)(res, testRun, 201);
    }
    catch (error) {
        next(error);
    }
};
exports.runTests = runTests;
const getTestHistory = async (req, res, next) => {
    try {
        if (!req.user)
            throw api_error_1.ApiError.unauthorized();
        const { id: projectId } = req.params;
        const history = await test_runner_service_1.testRunnerService.getTestHistory(projectId);
        (0, response_formatter_1.sendSuccess)(res, history, 200, { total: history.length });
    }
    catch (error) {
        next(error);
    }
};
exports.getTestHistory = getTestHistory;
const generateUnitTest = async (req, res, next) => {
    try {
        if (!req.user)
            throw api_error_1.ApiError.unauthorized();
        const { id: projectId } = req.params;
        const { filePath, testType } = req.body;
        const result = await test_runner_service_1.testRunnerService.generateUnitTest(projectId, { filePath, testType });
        (0, response_formatter_1.sendSuccess)(res, result, 201);
    }
    catch (error) {
        next(error);
    }
};
exports.generateUnitTest = generateUnitTest;
const saveUnitTest = async (req, res, next) => {
    try {
        if (!req.user)
            throw api_error_1.ApiError.unauthorized();
        const { id: projectId } = req.params;
        const { filePath, testCode } = req.body;
        const result = await test_runner_service_1.testRunnerService.saveUnitTest(projectId, { filePath, testCode });
        (0, response_formatter_1.sendSuccess)(res, result, 200);
    }
    catch (error) {
        next(error);
    }
};
exports.saveUnitTest = saveUnitTest;
