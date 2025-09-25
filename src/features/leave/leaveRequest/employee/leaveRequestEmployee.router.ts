import { Router } from 'express';
import { pool } from '../../../../config/db';
import { SessionManager } from '../../../../common/session/utils/sessionManager';
import redisClient from '../../../../config/redisClient';
import { RedisClientType } from 'redis';
import { AuthMiddleware } from '../../../../common/session/middleware/auth.middleware';
import { LeaveRequestsEmployeeController } from './leaveRequestEmployee.controller';
import { LeaveRequestsRepository } from '../domain/leaveRequest.repo';
import { LeaveRequestsEmployeeService } from './leaveRequestEmployee.service';

// Instanciate all classes
const sessionManager = new SessionManager(redisClient as RedisClientType<any>);
const repo = new LeaveRequestsRepository(pool);
const service = new LeaveRequestsEmployeeService(repo);
const controller = new LeaveRequestsEmployeeController(service);
const md = new AuthMiddleware(sessionManager);

const router = Router();

// Employee route to create leave request
router.post('/leave-request', md.requireAuth, controller.createLeaveRequest);
router.get(
  '/leave-request/:id',
  md.requireAuth,
  controller.getLeaveRequestById,
);
router.get('/leave-requests', md.requireAuth, controller.getLeaveRequests);

export default router;
