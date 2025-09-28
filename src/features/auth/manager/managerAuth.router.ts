import { Router } from 'express';
import { UsersRepository } from '../../../common/domains/users/user/user.repo';
import { RolesRepository } from '../../../common/domains/users/role/role.repo';
import { SessionManager } from '../../../common/session/utils/sessionManager';
import { RedisClientType } from 'redis';
import { ManagerAuthService } from './managerAuth.service';
import { ManagerAuthController } from './managerAuth.controller';
import { AuthMiddleware } from '../../../common/session/middleware/auth.middleware';
import { RoleName } from '../../../common/domains/users/role/role.entity';
import { CompensationHistoryRepository } from '../../compensation/compensationHistory/domain/compenstaionHistory.repo';
import { CompensationHistoryService } from '../../compensation/compensationHistory/compensationHistory.service';

export const createManagerRouter = (
  pool: any,
  redisClient: RedisClientType<any>,
) => {
  const userRepo = new UsersRepository(pool);
  const roleRepo = new RolesRepository(pool);
  const compensationHistoryRepo = new CompensationHistoryRepository(pool);
  const compensationHistoryService = new CompensationHistoryService(
    compensationHistoryRepo,
  );
  const sessionManager = new SessionManager(redisClient);
  const authService = new ManagerAuthService(
    userRepo,
    roleRepo,
    compensationHistoryService,
  );
  const authController = new ManagerAuthController(authService);
  const md = new AuthMiddleware(sessionManager);

  const router = Router();

  router.post(
    '/create-employee',
    md.requireRole(RoleName.MANAGER),
    authController.createEmployee,
  );

  return router;
};
