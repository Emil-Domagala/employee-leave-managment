import { NextFunction, Request, Response } from 'express';
import { CookieHelper } from '../../common/utils/cookieHelper';

export const logout = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cookieHelper = new CookieHelper();
    cookieHelper.clearSessionCookie(res);

    res.status(200).json({ message: 'logout successful' });
  } catch (err) {
    next(err);
  }
};
