import { Router } from 'express';
import { pool } from '../../../../config/db';
import { SessionManager } from '../../../../common/session/utils/sessionManager';
import redisClient from '../../../../config/redisClient';
import { RedisClientType } from 'redis';
import { AuthMiddleware } from '../../../../common/session/middleware/auth.middleware';
import { LeaveTypesRepository } from './domain/leaveType.repo';
import { RoleName } from '../../../../common/domains/users/role/role.entity';
import { LeaveTypesService } from './leaveRequest.service';
import { LeaveTypesController } from './leaveRequest.controller';

// Instanciate all classes
const sessionManager = new SessionManager(redisClient as RedisClientType<any>);
const repo = new LeaveTypesRepository(pool);
const service = new LeaveTypesService(repo);
const controller = new LeaveTypesController(service);

const md = new AuthMiddleware(sessionManager);

const router = Router();

router.get('/', md.requireAuth, controller.getAllLeaveTypes);
router.get('/:id', md.requireAuth, controller.getLeaveTypeById);
router.post('/', md.requireRole(RoleName.MANAGER), controller.createLeaveType);

export default router;
