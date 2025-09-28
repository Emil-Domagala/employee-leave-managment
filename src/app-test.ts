// app-test.ts
import 'reflect-metadata';
import express from 'express';
import cookieParser from 'cookie-parser';
import {
  TestContainers,
  setupTestContainers,
  stopTestContainers,
} from './config/testDB';
import { createManagerRouter } from './features/auth/manager/managerAuth.router';
import { createAuthRouter } from './features/auth/user/auth.router';
import { NotFoundError } from './common/errors/notFoundError';
import { errorHandler } from './errorHandler';
import dotenv from 'dotenv';
import { createLeaveRequestsManagerRouter } from './features/leave/leaveRequest/manager/leaveRequestManager.router';
import { createLeaveRequestsEmployeeRouter } from './features/leave/leaveRequest/employee/leaveRequestEmployee.router';
import { createLeaveTypesRouter } from './features/leave/leaveRequest/leaveType/leaveRequest.router';

// Load test env
dotenv.config({ path: '.env.test' });

export let containers: TestContainers;
export let app: express.Express;

export const createTestApp = async (): Promise<express.Express> => {
  containers = await setupTestContainers();

  // override env vars for containerized DB
  process.env.DB_HOST = containers.pgContainer.getHost();
  process.env.DB_PORT = containers.pgContainer.getMappedPort(5432).toString();
  process.env.DB_DATABASE = 'testdb';
  process.env.DB_USERNAME = 'testuser';
  process.env.DB_PASSWORD = 'testpass';

  app = express();
  app.use(express.json());
  app.use(cookieParser());

  // Routes
  app.use(
    '/api/auth',
    createAuthRouter(containers.pgPool, containers.redisClient),
  );
  app.use(
    '/api/auth/manager',
    createManagerRouter(containers.pgPool, containers.redisClient),
  );
  app.use(
    '/api/leave-request/manager/',
    createLeaveRequestsManagerRouter(containers.pgPool, containers.redisClient),
  );
  app.use(
    '/api/leave-request/',
    createLeaveRequestsEmployeeRouter(
      containers.pgPool,
      containers.redisClient,
    ),
  );
  app.use(
    '/api/leave-type/',
    createLeaveTypesRouter(containers.pgPool, containers.redisClient),
  );

  // Catch-all 404
  app.use(/.*/, (_req, _res, next) => {
    next(new NotFoundError());
  });

  // Error handler
  app.use(errorHandler);

  return app;
};

export const stopTestApp = async () => {
  if (containers) await stopTestContainers(containers);
};
