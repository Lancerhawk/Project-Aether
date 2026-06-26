import { Response } from 'express';
import { ApiResponse } from '../types';

export function sendSuccess<T>(res: Response, data: T, message = 'Success', statusCode = 200) {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(response);
}

export function sendError(res: Response, message = 'Internal Server Error', statusCode = 500) {
  const response: ApiResponse = {
    success: false,
    message,
  };
  return res.status(statusCode).json(response);
}
