import { Router } from 'express';
import { pool } from '../../../../config/db';
import { SessionManager } from '../../../../common/session/utils/sessionManager';
import redisClient from '../../../../config/redisClient';
import { RedisClientType } from 'redis';
import { AuthMiddleware } from '../../../../common/session/middleware/auth.middleware';
import { LeaveRequestsEmployeeController } from './leaveRequestEmployee.controller';
import { LeaveRequestsRepository } from '../domain/leaveRequest.repo';
import { LeaveRequestsEmployeeService } from './leaveRequestEmployee.service';
import { LeaveTypesRepository } from '../leaveType/domain/leaveType.repo';
import { UsersRepository } from '../../../../common/domains/users/user/user.repo';

// Instanciate all classes
const sessionManager = new SessionManager(redisClient as RedisClientType<any>);
const repo = new LeaveRequestsRepository(pool);
const leaveTypeRepo = new LeaveTypesRepository(pool);
const userRepo=new UsersRepository(pool);
const service = new LeaveRequestsEmployeeService(repo, leaveTypeRepo,userRepo);
const controller = new LeaveRequestsEmployeeController(service);
const md = new AuthMiddleware(sessionManager);

const router = Router();

// Employee route to create leave request
router.post('/', md.requireAuth, controller.createLeaveRequest);
router.get('/:id', md.requireAuth, controller.getLeaveRequestById);
router.get('/', md.requireAuth, controller.getLeaveRequests);

export default router;
