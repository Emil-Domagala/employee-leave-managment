// tests/features/auth/manager/managerAuth.int.test.ts
import request from 'supertest';
import { describe, it, beforeAll, afterEach, expect } from 'vitest';
import { RoleName } from '../../../../common/domains/users/role/role.entity';
import { UsersRepository } from '../../../../common/domains/users/user/user.repo';
import { containers, app } from '../../../../test/vitest.setup';
import { signinAs } from '../../../../test/utils/authHelper';
import { v4 as uuidv4 } from 'uuid';

describe('POST /api/auth/manager/create-employee', () => {
  let userRepo: UsersRepository;

  beforeAll(() => {
    userRepo = new UsersRepository(containers.pgPool);
  });

  function generateEmployeeBody() {
    return {
      user: {
        first_name: 'John',
        last_name: 'Doe',
        email: `john.doe+${uuidv4()}@example.com`, // unique per test
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
  }

  it('allows MANAGER to create an employee', async () => {
    const { cookie } = await signinAs(RoleName.MANAGER);
    const employeeBody = generateEmployeeBody();

    const res = await request(app)
      .post('/api/auth/manager/create-employee')
      .set('Cookie', cookie)
      .send(employeeBody);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('password');

    // clean up
    await userRepo.deleteByEmail(employeeBody.user.email);
  });

  it('rejects request if user is not authenticated', async () => {
    const employeeBody = generateEmployeeBody();

    const res = await request(app)
      .post('/api/auth/manager/create-employee')
      .send(employeeBody);

    expect(res.status).toBe(401);
  });

  it('rejects request if role is EMPLOYEE', async () => {
    const { cookie } = await signinAs(RoleName.EMPLOYEE);
    const employeeBody = generateEmployeeBody();

    const res = await request(app)
      .post('/api/auth/manager/create-employee')
      .set('Cookie', cookie)
      .send(employeeBody);

    expect(res.status).toBe(401);
  });

  it('rejects request if email already exists', async () => {
    const { cookie } = await signinAs(RoleName.MANAGER);
    const employeeBody = generateEmployeeBody();

    // First creation works
    await request(app)
      .post('/api/auth/manager/create-employee')
      .set('Cookie', cookie)
      .send(employeeBody)
      .expect(201);

    // Second creation with same email should fail
    const res = await request(app)
      .post('/api/auth/manager/create-employee')
      .set('Cookie', cookie)
      .send(employeeBody);

    expect(res.status).toBe(400);

    // clean up
    await userRepo.deleteByEmail(employeeBody.user.email);
  });
});
