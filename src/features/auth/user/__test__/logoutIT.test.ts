import request from 'supertest';
import { describe, it, beforeEach, expect } from 'vitest';
import { createUser } from '../../../../test/factories/createUserFactory';
import { app, containers } from '../../../../test/vitest.setup';

describe('Auth - logout', () => {
  let testUser: { userId: string; email: string; password: string };
  let authCookie: string;

  beforeEach(async () => {
    // Create a test user in the testContainer DB
    const { user, userPassword } = await createUser(containers.pgPool, {
      password: 'Test1234!',
    });
    testUser = { userId: user.id, email: user.email, password: userPassword };

    // Login first to get the cookie
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(loginRes.status).toBe(200);
    authCookie = loginRes.headers['set-cookie'][0];
  });

  it('should logout successfully and clear the session cookie', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', authCookie)
      .send();

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'logout successful');
    expect(res.headers['set-cookie'][0]).toContain('sessionId=;'); // cookie cleared
  });

  it('should allow logout even if user is not logged in', async () => {
    const res = await request(app).post('/api/auth/logout').send();

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'logout successful');
  });
});
