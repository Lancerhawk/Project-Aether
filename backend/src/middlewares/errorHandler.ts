import { Request, Response, NextFunction } from 'express';
import { AppError, sendError, logger } from '../utils';
import { Prisma } from '@prisma/client';
import { env } from '../config';

function mapPrismaError(error: Prisma.PrismaClientKnownRequestError): AppError {
  switch (error.code) {
    case 'P2002':
      return new AppError('A record with this value already exists.', 409, 'CONFLICT');
    case 'P2025':
      return new AppError('The requested record was not found.', 404, 'NOT_FOUND');
    case 'P2003':
      return new AppError('Invalid reference to a related record.', 400, 'INVALID_REFERENCE');
    default:
      return new AppError('A database error occurred.', 500, 'DATABASE_ERROR');
  }
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error(err.message, { code: err.code, stack: err.stack });
    }
    sendError(res, err.message, err.statusCode, err.code, err.details as { field: string; message: string }[] | undefined);
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const appError = mapPrismaError(err);
    sendError(res, appError.message, appError.statusCode, appError.code);
    return;
  }

  logger.error('Unhandled error', {
    message: err.message,
    stack: err.stack,
  });

  sendError(
    res,
    env.isProduction ? 'Internal Server Error' : err.message,
    500,
    'INTERNAL_ERROR'
  );
}
