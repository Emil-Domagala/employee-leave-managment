import './env';
import 'reflect-metadata';

import express from 'express';
import cookieParser from 'cookie-parser';
import { NotFoundError } from './common/errors/notFoundError';
import { errorHandler } from './errorHandler';
import authRouter from './features/auth/user/auth.router';
import managerAuthRouter from './features/auth/manager/managerAuth.router';
import managerLeaveRequestRouter from './features/leave/leaveRequest/manager/leaveRequestManager.router';
import leaveRequestRouter from './features/leave/leaveRequest/employee/leaveRequestEmployee.router';
import leaveTypeRouter from './features/leave/leaveRequest/leaveType/leaveRequest.router';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(cookieParser());

// Routes
const routes = express.Router();
app.use(routes);

app.use('/api/auth/', authRouter);
app.use('/api/auth/manager/', managerAuthRouter);
app.use('/api/leave-request/manager/', managerLeaveRequestRouter);
app.use('/api/leave-request/', leaveRequestRouter);
app.use('/api/leave-type/', leaveTypeRouter);

// Error handling

app.use(/.*/, async (_req, _res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

export default app;
