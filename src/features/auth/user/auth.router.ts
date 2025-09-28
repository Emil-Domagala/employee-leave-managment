import { Router } from 'express';
import { AuthController } from './auth.controller';
import { UsersRepository } from '../../../common/domains/users/user/user.repo';
import { RolesRepository } from '../../../common/domains/users/role/role.repo';
import { SessionManager } from '../../../common/session/utils/sessionManager';
import { CookieHelper } from '../../../common/utils/cookieHelper';
import { AuthService } from './auth.service';
import { RedisClientType } from 'redis';
import { Pool } from 'pg';

/**
 * Factory function to create auth router with injected dependencies
 */
export const createAuthRouter = (
  pool: Pool,
  redisClient: RedisClientType<any>,
) => {
  const userRepo = new UsersRepository(pool);
  const roleRepo = new RolesRepository(pool);
  const sessionManager = new SessionManager(redisClient);
  const authService = new AuthService(userRepo, roleRepo, sessionManager);
  const authController = new AuthController(
    authService,
    new CookieHelper(),
    sessionManager,
  );

  const router = Router();
  router.post('/login', authController.login);
  router.post('/logout', authController.logout);

  return router;
};
