import { Response, NextFunction } from 'express';
import { infrastructureService } from '../services/infrastructure.service';
import { ApiError } from '../utils/api-error';
import { sendSuccess } from '../utils/response-formatter';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const getTopology = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw ApiError.unauthorized();

    const { id: projectId } = req.params;
    const topology = await infrastructureService.getTopology(projectId);

    sendSuccess(res, topology, 200);
  } catch (error) {
    next(error);
  }
};

export const triggerDockerBuild = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw ApiError.unauthorized();

    const { id: projectId } = req.params;
    const { repository, tag } = req.body;

    const image = await infrastructureService.triggerDockerBuild(projectId, { repository, tag });

    sendSuccess(res, image, 201);
  } catch (error) {
    next(error);
  }
};

export const scaleService = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw ApiError.unauthorized();

    const { id: projectId } = req.params;
    const { containerId, targetReplicas } = req.body;

    const container = await infrastructureService.scaleService(projectId, {
      containerId,
      targetReplicas,
    });

    sendSuccess(res, container, 200);
  } catch (error) {
    next(error);
  }
};

export const deployProductionRelease = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw ApiError.unauthorized();

    const { id: projectId } = req.params;
    const { versionTag, strategy } = req.body;

    const rollout = await infrastructureService.deployProductionRelease(projectId, {
      versionTag,
      strategy,
    });

    sendSuccess(res, rollout, 200);
  } catch (error) {
    next(error);
  }
};
