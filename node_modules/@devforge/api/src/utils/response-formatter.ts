import { Response } from 'express';
import { ApiResponse } from '@devforge/shared';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode = 200,
  meta?: any
): Response => {
  const payload: ApiResponse<T> = {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  };
  return res.status(statusCode).json(payload);
};

export const sendError = (
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: any
): Response => {
  const payload: ApiResponse<null> = {
    success: false,
    error: {
      code,
      message,
      details,
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  };
  return res.status(statusCode).json(payload);
};
