import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../app';
import { createUser } from '../../test/factories/createUserFactory';
import {
  createAuthToken,
  createRefreshToken,
} from '../../common/jwt/utils/jwtTokens';
import { getEnvString } from '../../common/utils/getEnv';

const REFRESH_COOKIE_NAME = getEnvString('REFRESH_COOKIE');
const AUTH_COOKIE_NAME = getEnvString('AUTH_COOKIE');

describe('logout', () => {
  it('should clear auth and refresh cookies', async () => {
    const user = await createUser();

    const authToken = createAuthToken({ email: user.email, userId: user.id });
    const refreshToken = createRefreshToken({
      email: user.email,
      userId: user.id,
    });

    const cookies = [
      `${AUTH_COOKIE_NAME}=${authToken}; HttpOnly; Path=/; SameSite=Lax`,
      `${REFRESH_COOKIE_NAME}}=${refreshToken}; HttpOnly; Path=/; SameSite=Lax`,
    ];

    // Send logout request with the cookies
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', cookies)
      .expect(200);

    const logoutCookies = Array.isArray(res.headers['set-cookie'])
      ? res.headers['set-cookie']
      : [res.headers['set-cookie'] || ''];

    expect(
      logoutCookies.some(
        (c) =>
          c.startsWith(`${AUTH_COOKIE_NAME}=`) &&
          c.includes('Expires=Thu, 01 Jan 1970 00:00:00 GMT'),
      ),
    ).toBe(true);
    expect(
      logoutCookies.some(
        (c) =>
          c.startsWith(`${REFRESH_COOKIE_NAME}=`) &&
          c.includes('Expires=Thu, 01 Jan 1970 00:00:00 GMT'),
      ),
    ).toBe(true);
  });

  it('should return 200 even if no cookies are set', async () => {
    await request(app).post('/api/auth/logout').expect(200);
  });
});
