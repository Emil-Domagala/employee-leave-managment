import { Router } from 'express';
import { UsersRepository } from '../../../../common/domains/users/user/user.repo';
import { LeaveRequestsRepository } from '../domain/leaveRequest.repo';
import { LeaveTypesRepository } from '../leaveType/domain/leaveType.repo';
import { LeaveRequestsEmployeeService } from './leaveRequestEmployee.service';
import { LeaveRequestsEmployeeController } from './leaveRequestEmployee.controller';
import { SessionManager } from '../../../../common/session/utils/sessionManager';
import { RedisClientType } from 'redis';
import { AuthMiddleware } from '../../../../common/session/middleware/auth.middleware';

export const createLeaveRequestsEmployeeRouter = (
  pool: any,
  redisClient: RedisClientType<any>,
) => {
  const userRepo = new UsersRepository(pool);
  const leaveRequestRepo = new LeaveRequestsRepository(pool);
  const leaveTypeRepo = new LeaveTypesRepository(pool);

  const sessionManager = new SessionManager(redisClient);
  const service = new LeaveRequestsEmployeeService(
    leaveRequestRepo,
    leaveTypeRepo,
    userRepo,
  );
  const controller = new LeaveRequestsEmployeeController(service);
  const md = new AuthMiddleware(sessionManager);

  const router = Router();

  router.post('/', md.requireAuth, controller.createLeaveRequest);
  router.get('/:id', md.requireAuth, controller.getLeaveRequestById);
  router.get('/', md.requireAuth, controller.getLeaveRequests);

  return router;
};
