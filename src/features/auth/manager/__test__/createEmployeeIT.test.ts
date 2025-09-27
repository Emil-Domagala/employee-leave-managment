// tests/features/auth/manager/managerAuth.int.test.ts
import request from 'supertest';
import app from '../../../../app';
import { signinAs } from '../../../../test/utils/authHelper';
import { RoleName } from '../../../../common/domains/users/role/role.entity';
import { pool } from '../../../../config/db';
import { UsersRepository } from '../../../../common/domains/users/user/user.repo';
import { describe, it } from 'node:test';
import { afterAll, expect } from 'vitest';


describe('POST /api/auth/manager/create-employee', () => {
  const userRepo = new UsersRepository(pool);

  const employeeBody = {
    user: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      salary: 5000,
      status: 'active',
    },
    compensation: {
      effective_from: new Date().toISOString(),
      effective_to: null,
      base_salary: 5000,
      salary_period: 'monthly',
      currency: 'USD',
      created_at: new Date().toISOString(),
    },
  };

  it('✅ allows MANAGER to create an employee', async () => {
    const { cookie } = await signinAs(RoleName.MANAGER);

    const res = await request(app)
      .post('/api/auth/manager/create-employee')
      .set('Cookie', cookie)
      .send(employeeBody)
      .expect(201);

    expect(res.body).toMatchObject({
      first_name: employeeBody.user.first_name,
      last_name: employeeBody.user.last_name,
      email: employeeBody.user.email,
      salary: employeeBody.user.salary,
      status: employeeBody.user.status,
    });
    expect(res.body.password).toBeDefined(); // auto-generated password
  });

  it('🚫 rejects request if user is not authenticated', async () => {
    await request(app)
      .post('/api/auth/manager/create-employee')
      .send(employeeBody)
      .expect(401);
  });

  it('🚫 rejects request if role is EMPLOYEE', async () => {
    const { cookie } = await signinAs(RoleName.EMPLOYEE);

    await request(app)
      .post('/api/auth/manager/create-employee')
      .set('Cookie', cookie)
      .send(employeeBody)
      .expect(403);
  });

  it('🚫 rejects request if role is ADMIN', async () => {
    const { cookie } = await signinAs(RoleName.ADMIN);

    await request(app)
      .post('/api/auth/manager/create-employee')
      .set('Cookie', cookie)
      .send(employeeBody)
      .expect(403);
  });

  it('🚫 rejects request if email already exists', async () => {
    const { cookie } = await signinAs(RoleName.MANAGER);

    // First creation works
    await request(app)
      .post('/api/auth/manager/create-employee')
      .set('Cookie', cookie)
      .send(employeeBody)
      .expect(201);

    // Second creation with same email should fail
    await request(app)
      .post('/api/auth/manager/create-employee')
      .set('Cookie', cookie)
      .send(employeeBody)
      .expect(400);
  });

  afterAll(async () => {
    // cleanup created users
    await userRepo.deleteByEmail('john.doe@example.com');
    await pool.end();
  });
});
