import { Response, NextFunction } from 'express';
import { observabilityService } from '../services/observability.service';
import { ApiError } from '../utils/api-error';
import { sendSuccess } from '../utils/response-formatter';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const getObservabilityReport = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw ApiError.unauthorized();

    const { id: projectId } = req.params;
    const report = await observabilityService.getObservabilityReport(projectId);

    sendSuccess(res, report, 200);
  } catch (error) {
    next(error);
  }
};

export const getToolCallLogs = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw ApiError.unauthorized();

    const { id: projectId } = req.params;
    const logs = await observabilityService.getToolCallLogs(projectId);

    sendSuccess(res, logs, 200, { total: logs.length });
  } catch (error) {
    next(error);
  }
};

export const runEvaluationBenchmark = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw ApiError.unauthorized();

    const { id: projectId } = req.params;
    const result = await observabilityService.runEvaluationBenchmark(projectId);

    sendSuccess(res, result, 201);
  } catch (error) {
    next(error);
  }
};
