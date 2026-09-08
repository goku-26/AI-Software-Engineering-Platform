"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyPatch = exports.getTaskById = exports.getProjectTasks = exports.executeTask = void 0;
const agent_service_1 = require("../services/agent.service");
const api_error_1 = require("../utils/api-error");
const response_formatter_1 = require("../utils/response-formatter");
const executeTask = async (req, res, next) => {
    try {
        if (!req.user)
            throw api_error_1.ApiError.unauthorized();
        const { id: projectId } = req.params;
        const { prompt, role, targetFiles } = req.body;
        if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
            throw api_error_1.ApiError.badRequest('Prompt string is required to execute an AI agent task');
        }
        const task = await agent_service_1.agentService.executeTask(projectId, {
            prompt: prompt.trim(),
            role,
            targetFiles,
        });
        (0, response_formatter_1.sendSuccess)(res, task, 201);
    }
    catch (error) {
        next(error);
    }
};
exports.executeTask = executeTask;
const getProjectTasks = async (req, res, next) => {
    try {
        if (!req.user)
            throw api_error_1.ApiError.unauthorized();
        const { id: projectId } = req.params;
        const tasks = await agent_service_1.agentService.getProjectTasks(projectId);
        (0, response_formatter_1.sendSuccess)(res, tasks, 200, { total: tasks.length });
    }
    catch (error) {
        next(error);
    }
};
exports.getProjectTasks = getProjectTasks;
const getTaskById = async (req, res, next) => {
    try {
        if (!req.user)
            throw api_error_1.ApiError.unauthorized();
        const { taskId } = req.params;
        const task = await agent_service_1.agentService.getTaskById(taskId);
        (0, response_formatter_1.sendSuccess)(res, task);
    }
    catch (error) {
        next(error);
    }
};
exports.getTaskById = getTaskById;
const applyPatch = async (req, res, next) => {
    try {
        if (!req.user)
            throw api_error_1.ApiError.unauthorized();
        const { id: projectId, taskId } = req.params;
        const result = await agent_service_1.agentService.applyPatch(projectId, taskId);
        (0, response_formatter_1.sendSuccess)(res, result);
    }
    catch (error) {
        next(error);
    }
};
exports.applyPatch = applyPatch;
