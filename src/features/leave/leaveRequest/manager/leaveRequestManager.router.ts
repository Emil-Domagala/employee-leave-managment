import { Router } from 'express';
import { pool } from '../../../../config/db';
import { UsersRepository } from '../../../../common/domains/users/user/user.repo';
import { RolesRepository } from '../../../../common/domains/users/role/role.repo';
import { SessionManager } from '../../../../common/session/utils/sessionManager';
import redisClient from '../../../../config/redisClient';
import { RedisClientType } from 'redis';
import { AuthMiddleware } from '../../../../common/session/middleware/auth.middleware';
import { RoleName } from '../../../../common/domains/users/role/role.entity';
import { LeaveRequestsManagerController } from './leaveRequestManager.controller';
import { LeaveRequestsRepository } from '../domain/leaveRequest.repo';
import { LeaveRequestsManagerService } from './leaveRequestManager.service';

// Instanciate all classes
const sessionManager = new SessionManager(redisClient as RedisClientType<any>);
const repo = new LeaveRequestsRepository(pool);
const service = new LeaveRequestsManagerService(repo);
const controller = new LeaveRequestsManagerController(service);

const md = new AuthMiddleware(sessionManager);

const router = Router();

router.patch(
  '/:id',
  md.requireRole(RoleName.MANAGER),
  controller.getLeaveRequestByIdManager,
);
router.get(
  '/',
  md.requireRole(RoleName.MANAGER),
  controller.getLeaveRequestsManager,
);
router.get(
  '/:id',
  md.requireRole(RoleName.MANAGER),
  controller.updateLeaveRequest,
);

export default router;
