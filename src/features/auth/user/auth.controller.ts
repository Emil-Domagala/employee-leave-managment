import { Request, Response, NextFunction } from 'express';
import { validateBody } from '../../../common/utils/validateBody';
import { CookieHelper } from '../../../common/utils/cookieHelper';

import { LoginBody, loginSchema } from './domains/loginBody.dto';
import { SessionManager } from '../../../common/session/utils/sessionManager';
import { AuthService } from './auth.service';

export class AuthController {
  constructor(
    private authService: AuthService,
    private cookieHelper: CookieHelper,
    private sessionManager: SessionManager,
  ) {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = validateBody<LoginBody>(
        req.body,
        loginSchema,
      );
      const { sessionToken } = await this.authService.login(email, password);

      this.cookieHelper.setSessionCookie(res, sessionToken);

      res.status(200).json({ message: 'login successful' });
    } catch (err) {
      next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies[this.sessionManager.cookieName];

      await this.authService.logout(token);
      this.cookieHelper.clearSessionCookie(res);

      res.status(200).json({ message: 'logout successful' });
    } catch (err) {
      next(err);
    }
  }
}
