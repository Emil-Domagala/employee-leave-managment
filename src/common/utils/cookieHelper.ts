import { Response } from 'express';
import { getEnvNumber, getEnvString } from './getEnv';

export class CookieHelper {
  private static baseCookieOptions(maxAge: number) {
    const DOMAIN = getEnvString('FRONTEND_DOMAIN'); // moved here
    const NODE_ENV = getEnvString('NODE_ENV'); // moved here
    return {
      domain: DOMAIN,
      secure: NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax' as const,
      maxAge,
    };
  }

  static setAuthCookie(res: Response, token: string) {
    const maxAge = getEnvNumber('AUTH_TOKEN_EXPIRATION');
    const name = getEnvString('AUTH_COOKIE');
    res.cookie(name, token, { ...this.baseCookieOptions(maxAge), path: '/' });
  }

  static setRefreshCookie(res: Response, token: string) {
    const maxAge = getEnvNumber('REFRESH_TOKEN_EXPIRATION');
    const name = getEnvString('REFRESH_COOKIE');
    res.cookie(name, token, { ...this.baseCookieOptions(maxAge), path: '/' });
  }

  static clearAuthCookie(res: Response) {
    const name = getEnvString('AUTH_COOKIE');
    res.clearCookie(name);
  }

  static clearRefreshCookie(res: Response) {
    const name = getEnvString('REFRESH_COOKIE');
    res.clearCookie(name);
  }

  static clearCookies(res: Response, name: string) {
    res.clearCookie(name);
  }
  static setCookies(
    res: Response,
    name: string,
    value: string,
    path: string,
    maxAge: number,
  ) {
    res.cookie(name, value, { ...this.baseCookieOptions(maxAge), path });
  }
}
