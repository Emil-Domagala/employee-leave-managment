import { Router } from 'express';
import { LeaveRequestsRepository } from '../domain/leaveRequest.repo';
import { LeaveRequestsManagerService } from './leaveRequestManager.service';
import { LeaveRequestsManagerController } from './leaveRequestManager.controller';
import { SessionManager } from '../../../../common/session/utils/sessionManager';
import { RedisClientType } from 'redis';
import { AuthMiddleware } from '../../../../common/session/middleware/auth.middleware';
import { RoleName } from '../../../../common/domains/users/role/role.entity';

export const createLeaveRequestsManagerRouter = (
  pool: any,
  redisClient: RedisClientType<any>,
) => {
  const leaveRequestRepo = new LeaveRequestsRepository(pool);
  const service = new LeaveRequestsManagerService(leaveRequestRepo);
  const controller = new LeaveRequestsManagerController(service);

  const sessionManager = new SessionManager(redisClient);
  const md = new AuthMiddleware(sessionManager);

  const router = Router();

  router.patch(
    '/:id',
    md.requireRole(RoleName.MANAGER),
    controller.updateLeaveRequest,
  );
  router.get(
    '/',
    md.requireRole(RoleName.MANAGER),
    controller.getLeaveRequestsManager,
  );
  router.get(
    '/:id',
    md.requireRole(RoleName.MANAGER),
    controller.getLeaveRequestByIdManager,
  );

  return router;
};
