import { Response } from 'express';
import { getEnvNumber, getEnvString } from './getEnv';

type CookieOptions = {
  domain: string;
  secure: boolean;
  httpOnly: boolean;
  sameSite: 'lax';
  maxAge: number;
};

/**
 * Utility class for setting and clearing cookies with consistent options.
 */
export class CookieHelper {
  /**
   * Builds base cookie options used for all cookies.
   *
   * @throws {ConfigError} If required environment variables are missing or invalid.
   */
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

  /**
   * Sets the session cookie with the given token.
   *
   * @throws {ConfigError} If `SESSION_EXPIRATION_SEC` or `SESSION_COOKIE_NAME` env vars are missing/invalid.
   */
  public setSessionCookie(res: Response, token: string) {
    const maxAge = getEnvNumber('SESSION_EXPIRATION_SEC');
    const name = getEnvString('SESSION_COOKIE_NAME');
    res.cookie(name, token, {
      ...this.baseCookieOptions(maxAge * 1000),
      path: '/',
    });
  }

  /**
   * Clears the session cookie.
   *
   * @throws {ConfigError} If `SESSION_COOKIE_NAME` env var is missing.
   */
  public clearSessionCookie(res: Response) {
    const name = getEnvString('SESSION_COOKIE_NAME');
    res.clearCookie(name, {
      path: '/',
      domain: getEnvString('FRONTEND_DOMAIN') || '',
    });
  }

  /**
   * Clears a specific cookie by name and optional path.
   *
   * @throws {ConfigError} If `FRONTEND_DOMAIN` env var is missing.
   */
  public clearCookies(res: Response, name: string, path = '/') {
    res.clearCookie(name, {
      path,
      domain: getEnvString('FRONTEND_DOMAIN'),
    });
  }

  /**
   * Sets a custom cookie with the given name, value, path, and maxAge.
   *
   * @throws {ConfigError} If `FRONTEND_DOMAIN` or `NODE_ENV` env vars are missing.
   */
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
