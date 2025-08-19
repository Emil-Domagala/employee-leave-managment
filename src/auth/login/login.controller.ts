import { Request, Response, NextFunction } from 'express';
import { validateBody } from '../../common/utils/validateBody';
import { CookieHelper } from '../../common/utils/cookieHelper';
import { LoginService } from './login.service';
import { LoginInput, loginSchema } from './domains/loginBody.dto';
import { AppDataSource } from '../../data-source';
import { User } from '../../user/user.entity';

const loginService = new LoginService(AppDataSource.getRepository(User));

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = validateBody<LoginInput>(req.body, loginSchema);
    const { sessionToken } = await loginService.login(email, password);

    const cookieHelper = new CookieHelper();
    cookieHelper.setSessionCookie(res, sessionToken);

    res.status(200).json({ message: 'login successful' });
  } catch (err) {
    next(err);
  }
};
