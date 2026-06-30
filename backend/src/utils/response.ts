import { Response } from 'express';

interface SuccessResponse<T> {
  success: true;
  data: T;
}

interface ErrorDetail {
  field: string;
  message: string;
}

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ErrorDetail[];
  };
}

interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

interface PaginatedResponse<T> {
  success: true;
  data: {
    data: T[];
    pagination: PaginationMeta;
  };
}

export function sendSuccess<T>(res: Response, data: T, statusCode: number = 200) {
  const response: SuccessResponse<T> = {
    success: true,
    data,
  };
  return res.status(statusCode).json(response);
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  pagination: PaginationMeta,
  statusCode: number = 200
) {
  const response: PaginatedResponse<T> = {
    success: true,
    data: {
      data,
      pagination,
    },
  };
  return res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  message: string,
  statusCode: number = 500,
  code: string = 'INTERNAL_ERROR',
  details?: ErrorDetail[]
) {
  const response: ErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
    },
  };
  return res.status(statusCode).json(response);
}
