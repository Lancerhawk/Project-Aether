import { Request, Response } from 'express';
import { sendError } from '../utils';

export function notFound(_req: Request, res: Response) {
  sendError(res, 'The requested resource was not found.', 404, 'NOT_FOUND');
}
