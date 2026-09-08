"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployProductionRelease = exports.scaleService = exports.triggerDockerBuild = exports.getTopology = void 0;
const infrastructure_service_1 = require("../services/infrastructure.service");
const api_error_1 = require("../utils/api-error");
const response_formatter_1 = require("../utils/response-formatter");
const getTopology = async (req, res, next) => {
    try {
        if (!req.user)
            throw api_error_1.ApiError.unauthorized();
        const { id: projectId } = req.params;
        const topology = await infrastructure_service_1.infrastructureService.getTopology(projectId);
        (0, response_formatter_1.sendSuccess)(res, topology, 200);
    }
    catch (error) {
        next(error);
    }
};
exports.getTopology = getTopology;
const triggerDockerBuild = async (req, res, next) => {
    try {
        if (!req.user)
            throw api_error_1.ApiError.unauthorized();
        const { id: projectId } = req.params;
        const { repository, tag } = req.body;
        const image = await infrastructure_service_1.infrastructureService.triggerDockerBuild(projectId, { repository, tag });
        (0, response_formatter_1.sendSuccess)(res, image, 201);
    }
    catch (error) {
        next(error);
    }
};
exports.triggerDockerBuild = triggerDockerBuild;
const scaleService = async (req, res, next) => {
    try {
        if (!req.user)
            throw api_error_1.ApiError.unauthorized();
        const { id: projectId } = req.params;
        const { containerId, targetReplicas } = req.body;
        const container = await infrastructure_service_1.infrastructureService.scaleService(projectId, {
            containerId,
            targetReplicas,
        });
        (0, response_formatter_1.sendSuccess)(res, container, 200);
    }
    catch (error) {
        next(error);
    }
};
exports.scaleService = scaleService;
const deployProductionRelease = async (req, res, next) => {
    try {
        if (!req.user)
            throw api_error_1.ApiError.unauthorized();
        const { id: projectId } = req.params;
        const { versionTag, strategy } = req.body;
        const rollout = await infrastructure_service_1.infrastructureService.deployProductionRelease(projectId, {
            versionTag,
            strategy,
        });
        (0, response_formatter_1.sendSuccess)(res, rollout, 200);
    }
    catch (error) {
        next(error);
    }
};
exports.deployProductionRelease = deployProductionRelease;
