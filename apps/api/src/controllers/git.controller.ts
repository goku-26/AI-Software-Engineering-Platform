import { Response, NextFunction } from 'express';
import { gitService } from '../services/git.service';
import { ApiError } from '../utils/api-error';
import { sendSuccess } from '../utils/response-formatter';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const getProjectBranches = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw ApiError.unauthorized();

    const { id: projectId } = req.params;
    const branches = await gitService.getProjectBranches(projectId);

    sendSuccess(res, branches, 200, { total: branches.length });
  } catch (error) {
    next(error);
  }
};

export const createTaskBranch = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw ApiError.unauthorized();

    const { id: projectId } = req.params;
    const { name, baseBranch, commitMessage, modifiedFiles } = req.body;

    const branch = await gitService.createTaskBranch(projectId, {
      name,
      baseBranch,
      commitMessage,
      modifiedFiles,
    });

    sendSuccess(res, branch, 201);
  } catch (error) {
    next(error);
  }
};

export const createPullRequest = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw ApiError.unauthorized();

    const { id: projectId } = req.params;
    const { title, body, sourceBranch, targetBranch } = req.body;

    const pr = await gitService.createPullRequest(projectId, {
      title,
      body,
      sourceBranch,
      targetBranch,
    });

    sendSuccess(res, pr, 201);
  } catch (error) {
    next(error);
  }
};

export const getPipelineHistory = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw ApiError.unauthorized();

    const { id: projectId } = req.params;
    const pipelines = await gitService.getPipelineHistory(projectId);

    sendSuccess(res, pipelines, 200, { total: pipelines.length });
  } catch (error) {
    next(error);
  }
};

export const triggerDeliveryPipeline = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw ApiError.unauthorized();

    const { id: projectId } = req.params;
    const { branch, commitHash, environment } = req.body;

    const pipelineRun = await gitService.triggerDeliveryPipeline(projectId, {
      branch,
      commitHash,
      environment,
    });

    sendSuccess(res, pipelineRun, 201);
  } catch (error) {
    next(error);
  }
};
