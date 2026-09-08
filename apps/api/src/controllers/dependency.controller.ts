import { Response, NextFunction } from 'express';
import { dependencyService } from '../services/dependency.service';
import { ApiError } from '../utils/api-error';
import { sendSuccess } from '../utils/response-formatter';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const getDependencyGraph = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw ApiError.unauthorized();

    const { id: projectId } = req.params;
    const report = await dependencyService.getDependencyGraph(projectId);

    sendSuccess(res, report, 200);
  } catch (error) {
    next(error);
  }
};

export const analyzeSymbolImpact = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw ApiError.unauthorized();

    const { id: projectId } = req.params;
    const { symbolName } = req.body;

    const analysis = await dependencyService.analyzeSymbolImpact(projectId, symbolName);

    sendSuccess(res, analysis, 200);
  } catch (error) {
    next(error);
  }
};

export const refactorDependency = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw ApiError.unauthorized();

    const { id: projectId } = req.params;
    const { dependencyId, targetVersion } = req.body;

    const result = await dependencyService.refactorDependency(projectId, {
      dependencyId,
      targetVersion,
    });

    sendSuccess(res, result, 200);
  } catch (error) {
    next(error);
  }
};
