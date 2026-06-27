import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import { corsOptions } from './config';
import { requestLogger, errorHandler, notFound, rateLimiter } from './middlewares';

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);
app.use(requestLogger);

app.use(routes);

app.use(notFound);
app.use(errorHandler);

export default app;
