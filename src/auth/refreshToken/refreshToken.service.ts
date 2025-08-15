import { NextFunction, Request, Response } from 'express';

import {
  createAuthToken,
  verifyRefreshToken,
} from '../../common/jwt/utils/jwtTokens';
import { CookieHelper } from '../../common/utils/cookieHelper';
import { getEnvString } from '../../common/utils/getEnv';
import { UnauthorizedError } from '../errors/unauthorizedError';

const REFRESH_COOKIE_NAME = getEnvString('REFRESH_COOKIE');

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies[REFRESH_COOKIE_NAME];
    if (!refreshToken) throw new UnauthorizedError();
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) throw new UnauthorizedError();

    const authToken = createAuthToken({
      email: payload.email,
      userId: payload.userId,
    });
    CookieHelper.setAuthCookie(res, authToken);

    res.status(200).json({ message: 'Refresh token successful' });
  } catch (err) {
    next(err);
  }
};
