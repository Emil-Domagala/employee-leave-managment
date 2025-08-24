import { NextFunction, Request, Response } from 'express';
import { SessionManager } from '../utils/sessionManager';
import { SessionInvalidError } from '../errors/sessionInvalidError';
import redisClient from '../../../config/redisClient';
import { RedisClientType } from 'redis';

const sessionManager = new SessionManager(redisClient as RedisClientType);

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      email: string;
      userId: string;
    };
  }
}

/**
 * Check if user has valid session
 *
 * @throws {SessionInvalidError} If user does not have valid session
 */
export const requireAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies[sessionManager.cookieName];
    if (!token) throw new SessionInvalidError();

    const sessionData = await sessionManager.verifyAndExtendSession(token);
    req.user = {
      email: sessionData.email,
      userId: sessionData.userId,
    };

    next();
  } catch (e) {
    next(e);
  }
};
