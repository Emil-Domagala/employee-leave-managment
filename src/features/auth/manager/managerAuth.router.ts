import { Router } from 'express';
import { pool } from '../../../config/db';
import { UsersRepository } from '../../../common/domains/users/user/user.repo';
import { RolesRepository } from '../../../common/domains/users/role/role.repo';
import { SessionManager } from '../../../common/session/utils/sessionManager';
import redisClient from '../../../config/redisClient';
import { RedisClientType } from 'redis';
import { ManagerAuthService } from './managerAuth.service';
import { ManagerAuthController } from './managerAuth.controller';
import { AuthMiddleware } from '../../../common/session/middleware/auth.middleware';
import { RoleName } from '../../../common/domains/users/role/role.entity';

// Instanciate all classes
const userRepo = new UsersRepository(pool);
const roleRepo = new RolesRepository(pool);
const sessionManager = new SessionManager(redisClient as RedisClientType<any>);
const authService = new ManagerAuthService(userRepo, roleRepo);
const authController = new ManagerAuthController(authService);
const md = new AuthMiddleware(sessionManager);

const router = Router();

router.post(
  '/create-employee',
  md.requireRole(RoleName.MANAGER),
  authController.createEmployee,
);
// router.patch('/edit-employee');

export default router;
