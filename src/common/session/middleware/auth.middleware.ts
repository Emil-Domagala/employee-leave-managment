import { NextFunction, Request, Response } from 'express';
import { SessionManager } from '../utils/sessionManager';
import { SessionInvalidError } from '../errors/sessionInvalidError';
import { RedisClientType } from 'redis';
import { RoleName, RolePriority } from '../../domains/users/role/role.entity';
import { AccessDenied } from '../../errors/accessDenied';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      email: string;
      userId: string;
      role: string;
    };
  }
}

export class AuthMiddleware {
  constructor(private sessionManager: SessionManager) {}

  /**
   * Check if user has a valid session.
   */
  requireAuth = async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const token = req.cookies[this.sessionManager.cookieName];
      if (!token) throw new SessionInvalidError();

      const sessionData = await this.sessionManager.verifyAndExtendSession(
        token,
      );

      req.user = {
        email: sessionData.email,
        userId: sessionData.userId,
        role: sessionData.role,
      };

      next();
    } catch (e) {
      next(e);
    }
  };

  /**
   * Require a specific role.
   * Runs requireAuth first, then checks role.
   */
  requireRole(minRole: RoleName) {
    console.debug('requireRole:', minRole);
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await this.requireAuth(req, res, async (err?: any) => {
          if (err) return next(err);

          const userRole = req.user?.role as RoleName;
          if (!userRole) return next(new AccessDenied());

          if (RolePriority[userRole] < RolePriority[minRole]) {
            return next(new AccessDenied());
          }

          next();
        });
      } catch (e) {
        next(e);
      }
    };
  }
}
