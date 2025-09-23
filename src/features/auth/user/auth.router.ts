import { Router } from 'express';
import { AuthController } from './auth.controller';
import { pool } from '../../../config/db';
import redisClient from '../../../config/redisClient';
import { RedisClientType } from 'redis';
import { UsersRepository } from '../../../common/domains/users/user/user.repo';
import { SessionManager } from '../../../common/session/utils/sessionManager';
import { AuthService } from './auth.service';
import { CookieHelper } from '../../../common/utils/cookieHelper';
import { RolesRepository } from '../../../common/domains/users/role/role.repo';
import { PasswordManager } from '../../../common/utils/passwordManager';

// Instanciate all classes
const userRepo = new UsersRepository(pool);
const roleRepo = new RolesRepository(pool);
const sessionManager = new SessionManager(redisClient as RedisClientType<any>);
const passwordManager = new PasswordManager();
const authService = new AuthService(userRepo, roleRepo, sessionManager);
const authController = new AuthController(
  authService,
  new CookieHelper(),
  sessionManager,
);

const router = Router();

router.post('/login', authController.login);
router.post('/logout', authController.logout);

export default router;
