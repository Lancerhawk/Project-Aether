import { Request, Response } from 'express';
import { sendSuccess } from '../utils';
import prisma from '../config/prisma';
import { HealthCheckData } from '../types';

export async function getHealth(_req: Request, res: Response) {
  let dbStatus = 'connected';
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    dbStatus = 'disconnected';
  }

  const data: HealthCheckData = {
    status: 'healthy',
    version: '0.4.0',
    uptime: Math.floor(process.uptime()),
    database: dbStatus,
  };

  sendSuccess(res, data);
}
