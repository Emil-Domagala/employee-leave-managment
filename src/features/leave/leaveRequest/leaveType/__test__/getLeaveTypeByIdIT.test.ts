// tests/features/leave/leaveTypeById.int.test.ts
import request from 'supertest';
import { describe, it, beforeAll, afterEach, expect } from 'vitest';
import { LeaveTypesRepository } from '../domain/leaveType.repo';
import { containers, app } from '../../../../../test/vitest.setup';
import { createLeaveType } from '../../../../../test/factories/createLeaveTypeFactory';
import { signinAs } from '../../../../../test/utils/authHelper';
import { RoleName } from '../../../../../common/domains/users/role/role.entity';
import { randomUUID } from 'crypto';

describe('GET /api/leave-type/:id', () => {
  let leaveRepo: LeaveTypesRepository;
  let leaveTypeId: string;

  beforeAll(() => {
    leaveRepo = new LeaveTypesRepository(containers.pgPool);
  });

  afterEach(async () => {
    // clean all leave types after each test
    const all = await leaveRepo.getAll();
    for (const lt of all) {
      await leaveRepo.deleteById(lt.id);
    }
  });

  it('allows authenticated users to fetch a leave type by ID', async () => {
    const leaveType = await createLeaveType(containers.pgPool, {
      name: 'Vacation',
      is_paid: true,
      annual_allowance: 20,
    });
    leaveTypeId = leaveType.id;

    const { cookie } = await signinAs(RoleName.MANAGER);

    const res = await request(app)
      .get(`/api/leave-type/${leaveTypeId}`)
      .set('Cookie', cookie)
      .expect(200);

    expect(res.body).toHaveProperty('id', leaveTypeId);
    expect(res.body).toHaveProperty('name', 'Vacation');
  });

  it('returns 404 if leave type does not exist', async () => {
    const { cookie } = await signinAs(RoleName.MANAGER);

    const nonExistentId = randomUUID();

    const res = await request(app)
      .get(`/api/leave-types/${nonExistentId}`)
      .set('Cookie', cookie);

    expect(res.status).toBe(404);
  });

  it('rejects unauthenticated requests', async () => {
    const leaveType = await createLeaveType(containers.pgPool, {
      name: 'Sick',
      is_paid: true,
      annual_allowance: 10,
    });

    const res = await request(app).get(`/api/leave-type/${leaveType.id}`);
    expect(res.status).toBe(401);
  });
});
