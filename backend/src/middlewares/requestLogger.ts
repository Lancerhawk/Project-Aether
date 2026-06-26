import morgan from 'morgan';
import { env } from '../config';

export const requestLogger = morgan(env.isProduction ? 'combined' : 'dev');
