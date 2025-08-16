import { describe, expect, it } from 'vitest';
import { createUser } from '../../test/factories/createUserFactory';
import request from 'supertest';
import app from '../../app';
import { getEnvString } from '../../common/utils/getEnv';

const REFRESH_COOKIE_NAME = getEnvString('REFRESH_COOKIE');
const AUTH_COOKIE_NAME = getEnvString('AUTH_COOKIE');

describe('login', () => {
  it('should login user successfully', async () => {
    const user = await createUser();
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: user.email,
        password: user.name, // name === password
      })
      .expect(200);

    const cookies = Array.isArray(res.headers['set-cookie'])
      ? res.headers['set-cookie']
      : [res.headers['set-cookie'] || ''];

    expect(cookies.some((c) => c.startsWith(`${AUTH_COOKIE_NAME}=`))).toBe(
      true,
    );
    expect(cookies.some((c) => c.startsWith(`${REFRESH_COOKIE_NAME}=`))).toBe(
      true,
    );
  });

  it('should throw 404 when no user found', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@test.test',
        password: 'password',
      })
      .expect(404);
  });

  it('shoulld throw 404 when wrong password', async () => {
    const user = await createUser();
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: user.email,
        password: 'wrongpassword',
      })
      .expect(404);
  });

  it('should throw 404 when no email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        password: 'password',
      })
      .expect(400);
  });
});
