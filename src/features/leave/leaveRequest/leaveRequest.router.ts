import { Router } from 'express';
import { pool } from '../../../config/db';
import { UsersRepository } from '../../../common/domains/users/user/user.repo';
import { RolesRepository } from '../../../common/domains/users/role/role.repo';
import { SessionManager } from '../../../common/session/utils/sessionManager';
import redisClient from '../../../config/redisClient';
import { RedisClientType } from 'redis';
import { AuthMiddleware } from '../../../common/session/middleware/auth.middleware';
import { RoleName } from '../../../common/domains/users/role/role.entity';

// Instanciate all classes
const userRepo = new UsersRepository(pool);
const roleRepo = new RolesRepository(pool);
const sessionManager = new SessionManager(redisClient as RedisClientType<any>);

const md = new AuthMiddleware(sessionManager);

const router = Router();

// Employee route to create leave request
router.post(
  '/leave-request',
);
router.get('/leave-request/:id');
router.get('/leave-requests');
// Manager route to approve/reject/cancel
router.patch('/leave-request/:id',md.requireRole(RoleName.MANAGER));
router.get('/leave-requests',md.requireRole(RoleName.MANAGER));
router.get('/leave-requests/:id',md.requireRole(RoleName.MANAGER));


export default router;
