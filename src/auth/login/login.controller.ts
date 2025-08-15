import { Request, Response, NextFunction } from 'express';
import { validateBody } from '../../common/utils/validateBody';
import { CookieHelper } from '../../common/utils/cookieHelper';
import { AuthService } from './login.service';
import { LoginInput, loginSchema } from './domains/loginBody.dto';

const authService = new AuthService();

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = validateBody<LoginInput>(req.body, loginSchema);
    const { authToken, refreshToken } = await authService.login(
      email,
      password,
    );

    CookieHelper.setAuthCookie(res, authToken);
    CookieHelper.setRefreshCookie(res, refreshToken);

    res.status(200);
  } catch (err) {
    next(err);
  }
};
