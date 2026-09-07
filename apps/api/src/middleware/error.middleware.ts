import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/api-error';
import { sendError } from '../utils/response-formatter';
import { env } from '../config/env';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  if (err instanceof ApiError) {
    return sendError(res, err.statusCode, err.code, err.message, err.details);
  }

  console.error('[Unhandled Error]', err);

  const message = env.NODE_ENV === 'production' 
    ? 'Internal Server Error' 
    : err.message || 'An unexpected error occurred';

  return sendError(res, 500, 'INTERNAL_SERVER_ERROR', message);
};
