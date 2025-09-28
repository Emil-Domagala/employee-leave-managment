import './env';
import 'reflect-metadata';

import express from 'express';
import cookieParser from 'cookie-parser';
import redisClient from './config/redisClient';
import { getPool } from './config/db';
import { NotFoundError } from './common/errors/notFoundError';
import { errorHandler } from './errorHandler';

import { createManagerRouter } from './features/auth/manager/managerAuth.router';
import { createAuthRouter } from './features/auth/user/auth.router';
import { createLeaveRequestsManagerRouter } from './features/leave/leaveRequest/manager/leaveRequestManager.router';
import { createLeaveRequestsEmployeeRouter } from './features/leave/leaveRequest/employee/leaveRequestEmployee.router';
import { createLeaveTypesRouter } from './features/leave/leaveRequest/leaveType/leaveRequest.router';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(cookieParser());

// Routes
const routes = express.Router();
app.use(routes);

app.use('/api/auth', createAuthRouter(getPool(), redisClient as any));
app.use(
  '/api/auth/manager',
  createManagerRouter(getPool(), redisClient as any),
);
app.use(
  '/api/leave-request/manager/',
  createLeaveRequestsManagerRouter(getPool(), redisClient as any),
);
app.use(
  '/api/leave-request/',
  createLeaveRequestsEmployeeRouter(getPool(), redisClient as any),
);
app.use(
  '/api/leave-type/',
  createLeaveTypesRouter(getPool(), redisClient as any),
);

// Error handling

app.use(/.*/, async (_req, _res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

export default app;
