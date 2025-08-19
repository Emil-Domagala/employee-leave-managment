import { Response } from 'express';
import { getEnvNumber, getEnvString } from './getEnv';

type CookieOptions = {
  domain: string;
  secure: boolean;
  httpOnly: boolean;
  sameSite: 'lax';
  maxAge: number;
};

export class CookieHelper {
  private baseCookieOptions(maxAge: number): CookieOptions {
    const DOMAIN = getEnvString('FRONTEND_DOMAIN') || '';
    const NODE_ENV = getEnvString('NODE_ENV') || 'development';
    return {
      domain: DOMAIN,
      secure: NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge,
    };
  }

  public setSessionCookie(res: Response, token: string) {
    const maxAge = getEnvNumber('SESSION_EXPIRATION_SEC');
    const name = getEnvString('SESSION_COOKIE_NAME');
    res.cookie(name, token, {
      ...this.baseCookieOptions(maxAge * 1000),
      path: '/',
    });
  }

  public clearSessionCookie(res: Response) {
    const name = getEnvString('SESSION_COOKIE_NAME');
    res.clearCookie(name, {
      path: '/',
      domain: getEnvString('FRONTEND_DOMAIN') || '',
    });
  }

  public clearCookies(res: Response, name: string, path = '/') {
    res.clearCookie(name, {
      path,
      domain: getEnvString('FRONTEND_DOMAIN'),
    });
  }

  public setCookies(
    res: Response,
    name: string,
    value: string,
    path: string,
    maxAge: number,
  ) {
    res.cookie(name, value, { ...this.baseCookieOptions(maxAge), path });
  }
}
