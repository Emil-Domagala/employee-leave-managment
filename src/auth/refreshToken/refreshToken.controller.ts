import { Request, Response, NextFunction } from 'express';

import { CookieHelper } from '../../common/utils/cookieHelper';
import { getEnvString } from '../../common/utils/getEnv';
import { AuthService } from './refreshToken.service';

const authService = new AuthService();
const REFRESH_COOKIE_NAME = getEnvString('REFRESH_COOKIE');

export const refreshToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const tokenFromCookie = req.cookies[REFRESH_COOKIE_NAME];
    const authToken = authService.refreshToken(tokenFromCookie);

    CookieHelper.setAuthCookie(res, authToken);

    res.status(200).json({ message: 'Refresh token successful' });
  } catch (err) {
    next(err);
  }
};
