import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import { requestLogger, errorHandler } from './middlewares';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use(routes);

app.use(errorHandler);

export default app;
