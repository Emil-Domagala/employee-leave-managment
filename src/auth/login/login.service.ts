import { NextFunction, Request, Response } from 'express';
import {
  ErrorsArr,
  validateBodyValue,
} from '../../common/utils/validateBodyValue';
import { MethodArgumentNotValidError } from '../../common/errors/MethodArgumentNotValidError';
import { AppDataSource } from '../../data-source';
import { User } from '../../user/user.entity';
import { PasswordManager } from '../../common/utils/passwordManager';
import { CookieHelper } from '../../common/utils/cookieHelper';
import {
  createAuthToken,
  createRefreshToken,
} from '../../common/jwt/utils/jwtTokens';
import { LoginFailedError } from '../errors/loginFailedError';

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const errors: ErrorsArr[] = [];
    validateBodyValue(email, 'string', errors);
    validateBodyValue(password, 'string', errors);
    if (errors.length > 0)
      throw new MethodArgumentNotValidError('Validation failed', errors);

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { email } });
    if (!user) throw new LoginFailedError();

    const isPasswordValid = await PasswordManager.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) throw new LoginFailedError();

    const authToken = createAuthToken({ email: user.email, userId: user.id });
    const refreshToken = createRefreshToken({
      email: user.email,
      userId: user.id,
    });

    CookieHelper.setAuthCookie(res, authToken);
    CookieHelper.setRefreshCookie(res, refreshToken);
    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    next(err);
  }
};
