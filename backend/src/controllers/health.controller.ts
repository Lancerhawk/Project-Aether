import { Request, Response } from 'express';
import { sendSuccess } from '../utils';
import { HealthCheckData } from '../types';

export function getHealth(_req: Request, res: Response) {
  const data: HealthCheckData = {
    status: 'ok',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };

  sendSuccess(res, data, 'Aether API is running');
}
