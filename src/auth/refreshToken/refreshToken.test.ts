import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../app';
import { createUser } from '../../test/factories/createUserFactory';
import { createRefreshToken } from '../../common/jwt/utils/jwtTokens';
import { getEnvString } from '../../common/utils/getEnv';

const REFRESH_COOKIE_NAME = getEnvString('REFRESH_COOKIE');

describe('refreshToken', () => {
  it('should return new auth token when valid refresh token is provided', async () => {
    const user = await createUser();

    const refreshToken = createRefreshToken({
      email: user.email,
      userId: user.id,
    });

    const cookies = [
      `${REFRESH_COOKIE_NAME}=${refreshToken}; HttpOnly; Path=/; SameSite=Lax`,
    ];

    const res = await request(app)
      .post('/api/auth/refresh-token')
      .set('Cookie', cookies)
      .expect(200);

    const setCookies = Array.isArray(res.headers['set-cookie'])
      ? res.headers['set-cookie']
      : [res.headers['set-cookie'] || ''];

    // Ensure new auth cookie is set
    expect(setCookies.some((c) => c.startsWith('auth='))).toBe(true);
    expect(res.body.message).toBe('Refresh token successful');
  });

  it('should throw 401 if no refresh token cookie is provided', async () => {
    await request(app).post('/api/auth/refresh-token').expect(401);
  });

  it('should throw 401 if refresh token is invalid', async () => {
    const cookies = [
      `${REFRESH_COOKIE_NAME}=invalidtoken; HttpOnly; Path=/; SameSite=Lax`,
    ];

    await request(app)
      .post('/api/auth/refresh-token')
      .set('Cookie', cookies)
      .expect(401);
  });
});
