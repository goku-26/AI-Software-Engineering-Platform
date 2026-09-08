import { Response, NextFunction } from 'express';
import { securityService } from '../services/security.service';
import { ApiError } from '../utils/api-error';
import { sendSuccess } from '../utils/response-formatter';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const runSecurityScan = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw ApiError.unauthorized();

    const { id: projectId } = req.params;
    const report = await securityService.runSecurityScan(projectId);

    sendSuccess(res, report, 201);
  } catch (error) {
    next(error);
  }
};

export const getSecurityHistory = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw ApiError.unauthorized();

    const { id: projectId } = req.params;
    const history = await securityService.getSecurityHistory(projectId);

    sendSuccess(res, history, 200, { total: history.length });
  } catch (error) {
    next(error);
  }
};

export const autoRemediateVulnerability = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw ApiError.unauthorized();

    const { id: projectId } = req.params;
    const { vulnerabilityId, filePath } = req.body;

    const result = await securityService.autoRemediateVulnerability(projectId, {
      vulnerabilityId,
      filePath,
    });

    sendSuccess(res, result, 201);
  } catch (error) {
    next(error);
  }
};

export const applyRemediationPatch = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw ApiError.unauthorized();

    const { id: projectId } = req.params;
    const { vulnerabilityId } = req.body;

    const result = await securityService.applyRemediationPatch(projectId, vulnerabilityId);

    sendSuccess(res, result, 200);
  } catch (error) {
    next(error);
  }
};
