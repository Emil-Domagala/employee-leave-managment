import { NextFunction, Request, Response } from 'express';
import { getEnvString } from '../../utils/getEnv';
import { AuthTokenInvalidError } from '../../errors/authTokenInvalidError';
import { verifyAuthToken } from '../utils/jwtTokens';

const AUTH_COOKIE_NAME = getEnvString('AUTH_COOKIE');

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      email: string;
      userId: number;
    };
  }
}

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies[AUTH_COOKIE_NAME];
    if (!token) throw new AuthTokenInvalidError();
    const payload = verifyAuthToken(token);
    if (!payload) throw new AuthTokenInvalidError();
    req.user = {
      email: payload.email,
      userId: payload.userId,
    };

    next();
  } catch (e) {
    next(e);
  }
};
