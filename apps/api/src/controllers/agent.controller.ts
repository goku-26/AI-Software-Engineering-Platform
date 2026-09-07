import { Response, NextFunction } from 'express';
import { agentService } from '../services/agent.service';
import { ApiError } from '../utils/api-error';
import { sendSuccess } from '../utils/response-formatter';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const executeTask = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw ApiError.unauthorized();

    const { id: projectId } = req.params;
    const { prompt, role, targetFiles } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      throw ApiError.badRequest('Prompt string is required to execute an AI agent task');
    }

    const task = await agentService.executeTask(projectId, {
      prompt: prompt.trim(),
      role,
      targetFiles,
    });

    sendSuccess(res, task, 201);
  } catch (error) {
    next(error);
  }
};

export const getProjectTasks = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw ApiError.unauthorized();

    const { id: projectId } = req.params;
    const tasks = await agentService.getProjectTasks(projectId);

    sendSuccess(res, tasks, 200, { total: tasks.length });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw ApiError.unauthorized();

    const { taskId } = req.params;
    const task = await agentService.getTaskById(taskId);

    sendSuccess(res, task);
  } catch (error) {
    next(error);
  }
};

export const applyPatch = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw ApiError.unauthorized();

    const { id: projectId, taskId } = req.params;
    const result = await agentService.applyPatch(projectId, taskId);

    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};
