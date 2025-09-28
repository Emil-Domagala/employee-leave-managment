// tests/features/leave/leaveTypes.int.test.ts
import request from 'supertest';
import { describe, it, beforeAll, afterEach, expect } from 'vitest';
import { LeaveTypesRepository } from '../domain/leaveType.repo';
import { UsersRepository } from '../../../../../common/domains/users/user/user.repo';
import { containers, app } from '../../../../../test/vitest.setup';
import { createLeaveType } from '../../../../../test/factories/createLeaveTypeFactory';
import { signinAs } from '../../../../../test/utils/authHelper';
import { RoleName } from '../../../../../common/domains/users/role/role.entity';

describe('GET /api/leave-type', () => {
  let leaveRepo: LeaveTypesRepository;
  let userRepo: UsersRepository;

  beforeAll(() => {
    leaveRepo = new LeaveTypesRepository(containers.pgPool);
    userRepo = new UsersRepository(containers.pgPool);
  });

  afterEach(async () => {
    // clean all leave types after each test
    const all = await leaveRepo.getAll();
    for (const lt of all) {
      await leaveRepo.deleteById(lt.id);
    }
  });

  it('allows authenticated users to fetch all leave types', async () => {
    // create some leave types
    await createLeaveType(containers.pgPool, {
      name: 'Vacation',
      is_paid: true,
      annual_allowance: 20,
    });
    await createLeaveType(containers.pgPool, {
      name: 'Sick',
      is_paid: true,
      annual_allowance: 10,
    });

    const { cookie } = await signinAs(RoleName.MANAGER);

    const res = await request(app)
      .get('/api/leave-type')
      .set('Cookie', cookie)
      .expect(200);

    expect(res.body).toHaveLength(2);
    expect(res.body.map((lt: any) => lt.name)).toEqual(
      expect.arrayContaining(['Vacation', 'Sick']),
    );
  });

  it('rejects unauthenticated requests', async () => {
    const res = await request(app).get('/api/leave-type');
    expect(res.status).toBe(401);
  });
});
