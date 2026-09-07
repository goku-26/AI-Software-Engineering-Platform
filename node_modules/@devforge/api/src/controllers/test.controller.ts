import { Response, NextFunction } from 'express';
import { testRunnerService } from '../services/test-runner.service';
import { ApiError } from '../utils/api-error';
import { sendSuccess } from '../utils/response-formatter';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const runTests = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw ApiError.unauthorized();

    const { id: projectId } = req.params;
    const testRun = await testRunnerService.runProjectTests(projectId);

    sendSuccess(res, testRun, 201);
  } catch (error) {
    next(error);
  }
};

export const getTestHistory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw ApiError.unauthorized();

    const { id: projectId } = req.params;
    const history = await testRunnerService.getTestHistory(projectId);

    sendSuccess(res, history, 200, { total: history.length });
  } catch (error) {
    next(error);
  }
};

export const generateUnitTest = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw ApiError.unauthorized();

    const { id: projectId } = req.params;
    const { filePath, testType } = req.body;

    const result = await testRunnerService.generateUnitTest(projectId, { filePath, testType });

    sendSuccess(res, result, 201);
  } catch (error) {
    next(error);
  }
};

export const saveUnitTest = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw ApiError.unauthorized();

    const { id: projectId } = req.params;
    const { filePath, testCode } = req.body;

    const result = await testRunnerService.saveUnitTest(projectId, { filePath, testCode });

    sendSuccess(res, result, 200);
  } catch (error) {
    next(error);
  }
};
