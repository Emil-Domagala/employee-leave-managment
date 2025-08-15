import './env';
import 'reflect-metadata';

import express from 'express';
import cookieParser from 'cookie-parser';
import { NotFoundError } from './common/errors/notFoundError';
import { errorHandler } from './errorHandler';
import authRouter from './auth/authRouter';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(cookieParser());

// Routes
const routes = express.Router();
app.use(routes);

app.use('/api', authRouter);

// Error handling

app.use(/.*/, async (_req, _res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

export default app;
