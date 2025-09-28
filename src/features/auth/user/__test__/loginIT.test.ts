import request from 'supertest';
import { describe, it, beforeEach, expect } from 'vitest';
import { createUser } from '../../../../test/factories/createUserFactory';
import { app, containers } from '../../../../test/vitest.setup';

describe('Auth - login', () => {
  let testUser: { userId: string; email: string; password: string };

  beforeEach(async () => {
    // Create a test user in the testContainer Postgres DB
    const { user, userPassword } = await createUser(containers.pgPool, {
      password: 'Test1234!',
    });
    testUser = { userId: user.id, email: user.email, password: userPassword };
  });

  it('should login successfully with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'login successful');
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('should fail if user does not exist', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nonexistent@example.com', password: 'anything123' });

    expect(res.status).toBe(404);
  });

  it('should fail if password is incorrect', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'WrongPassword123!' });

    expect(res.status).toBe(404);
  });
});
