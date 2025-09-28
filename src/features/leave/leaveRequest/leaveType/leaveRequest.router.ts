import { Router } from 'express';
import { LeaveTypesRepository } from './domain/leaveType.repo';
import { LeaveTypesService } from './leaveRequest.service';
import { LeaveTypesController } from './leaveRequest.controller';
import { SessionManager } from '../../../../common/session/utils/sessionManager';
import { RedisClientType } from 'redis';
import { AuthMiddleware } from '../../../../common/session/middleware/auth.middleware';
import { RoleName } from '../../../../common/domains/users/role/role.entity';

export const createLeaveTypesRouter = (
  pool: any,
  redisClient: RedisClientType<any>,
) => {
  const repo = new LeaveTypesRepository(pool);
  const service = new LeaveTypesService(repo);
  const controller = new LeaveTypesController(service);

  const sessionManager = new SessionManager(redisClient);
  const md = new AuthMiddleware(sessionManager);

  const router = Router();

  router.get('/', md.requireAuth, controller.getAllLeaveTypes);
  router.get('/:id', md.requireAuth, controller.getLeaveTypeById);
  router.post(
    '/',
    md.requireRole(RoleName.MANAGER),
    controller.createLeaveType,
  );

  return router;
};
