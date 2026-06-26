import { Request, Response, NextFunction } from 'express';
import { env } from '../config';
import { sendError } from '../utils';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  if (env.isDevelopment) {
    // eslint-disable-next-line no-console
    console.error(`[Error] ${err.message}`, err.stack);
  }

  sendError(res, env.isProduction ? 'Internal Server Error' : err.message, statusCode);
}
