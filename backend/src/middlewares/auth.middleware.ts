import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { verifyAccessToken, AppError } from '../utils';

export function authenticate(req: AuthRequest, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      throw new AppError('Authentication required.', 401, 'UNAUTHORIZED');
    }

    const token = header.slice(7);
    const payload = verifyAccessToken(token);

    req.user = {
      userId: payload.userId,
      email: payload.email,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Invalid or expired token.', 401, 'UNAUTHORIZED'));
    }
  }
}
