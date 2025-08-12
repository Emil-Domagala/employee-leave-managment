import express from 'express';
import cookieParser from 'cookie-parser';
import { NotFoundError } from './common/errors/notFoundError';
import { errorHandler } from './common/middleware/errorHandler';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(cookieParser());

// Routes
const routes = express.Router();
app.use(routes);

// Error handling

app.use(/.*/, async (_req, _res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

export default app;
