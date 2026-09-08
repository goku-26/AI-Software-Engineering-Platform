"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerDeliveryPipeline = exports.getPipelineHistory = exports.createPullRequest = exports.createTaskBranch = exports.getProjectBranches = void 0;
const git_service_1 = require("../services/git.service");
const api_error_1 = require("../utils/api-error");
const response_formatter_1 = require("../utils/response-formatter");
const getProjectBranches = async (req, res, next) => {
    try {
        if (!req.user)
            throw api_error_1.ApiError.unauthorized();
        const { id: projectId } = req.params;
        const branches = await git_service_1.gitService.getProjectBranches(projectId);
        (0, response_formatter_1.sendSuccess)(res, branches, 200, { total: branches.length });
    }
    catch (error) {
        next(error);
    }
};
exports.getProjectBranches = getProjectBranches;
const createTaskBranch = async (req, res, next) => {
    try {
        if (!req.user)
            throw api_error_1.ApiError.unauthorized();
        const { id: projectId } = req.params;
        const { name, baseBranch, commitMessage, modifiedFiles } = req.body;
        const branch = await git_service_1.gitService.createTaskBranch(projectId, {
            name,
            baseBranch,
            commitMessage,
            modifiedFiles,
        });
        (0, response_formatter_1.sendSuccess)(res, branch, 201);
    }
    catch (error) {
        next(error);
    }
};
exports.createTaskBranch = createTaskBranch;
const createPullRequest = async (req, res, next) => {
    try {
        if (!req.user)
            throw api_error_1.ApiError.unauthorized();
        const { id: projectId } = req.params;
        const { title, body, sourceBranch, targetBranch } = req.body;
        const pr = await git_service_1.gitService.createPullRequest(projectId, {
            title,
            body,
            sourceBranch,
            targetBranch,
        });
        (0, response_formatter_1.sendSuccess)(res, pr, 201);
    }
    catch (error) {
        next(error);
    }
};
exports.createPullRequest = createPullRequest;
const getPipelineHistory = async (req, res, next) => {
    try {
        if (!req.user)
            throw api_error_1.ApiError.unauthorized();
        const { id: projectId } = req.params;
        const pipelines = await git_service_1.gitService.getPipelineHistory(projectId);
        (0, response_formatter_1.sendSuccess)(res, pipelines, 200, { total: pipelines.length });
    }
    catch (error) {
        next(error);
    }
};
exports.getPipelineHistory = getPipelineHistory;
const triggerDeliveryPipeline = async (req, res, next) => {
    try {
        if (!req.user)
            throw api_error_1.ApiError.unauthorized();
        const { id: projectId } = req.params;
        const { branch, commitHash, environment } = req.body;
        const pipelineRun = await git_service_1.gitService.triggerDeliveryPipeline(projectId, {
            branch,
            commitHash,
            environment,
        });
        (0, response_formatter_1.sendSuccess)(res, pipelineRun, 201);
    }
    catch (error) {
        next(error);
    }
};
exports.triggerDeliveryPipeline = triggerDeliveryPipeline;
