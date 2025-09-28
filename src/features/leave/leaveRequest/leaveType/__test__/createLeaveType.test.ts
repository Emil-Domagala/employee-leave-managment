import request from 'supertest';
import { describe, it, beforeAll, afterEach, expect } from 'vitest';
import { LeaveTypesRepository } from '../domain/leaveType.repo';
import { containers, app } from '../../../../../test/vitest.setup';
import { signinAs } from '../../../../../test/utils/authHelper';
import { RoleName } from '../../../../../common/domains/users/role/role.entity';
import { randomUUID } from 'crypto';

describe('POST /api/leave-type', () => {
  let repo: LeaveTypesRepository;

  beforeAll(() => {
    repo = new LeaveTypesRepository(containers.pgPool);
  });

  const leaveTypeBody = {
    name: `Annual-${randomUUID().substring(0, 8)}`,
    is_paid: true,
    annual_allowance: 20,
  };

  afterEach(async () => {
    // Clean up by deleting any created leave types
    if (leaveTypeBody.name) {
      await repo.deleteByName(leaveTypeBody.name);
    }
  });

  it('allows MANAGER to create a leave type', async () => {
    const { cookie } = await signinAs(RoleName.MANAGER);

    const res = await request(app)
      .post('/api/leave-type')
      .set('Cookie', cookie)
      .send(leaveTypeBody);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(leaveTypeBody.name);
    expect(res.body.is_paid).toBe(leaveTypeBody.is_paid);
    expect(res.body.annual_allowance).toBe(leaveTypeBody.annual_allowance);
  });

  it('rejects creation if user is not authenticated', async () => {
    const res = await request(app).post('/api/leave-type').send(leaveTypeBody);

    expect(res.status).toBe(401);
  });

  it('rejects creation if user is not MANAGER', async () => {
    const { cookie } = await signinAs(RoleName.EMPLOYEE);

    const res = await request(app)
      .post('/api/leave-type')
      .set('Cookie', cookie)
      .send(leaveTypeBody);

    expect(res.status).toBe(401);
  });

  it('rejects creation if leave type already exists', async () => {
    const { cookie } = await signinAs(RoleName.MANAGER);

    // First creation
    await request(app)
      .post('/api/leave-type')
      .set('Cookie', cookie)
      .send(leaveTypeBody)
      .expect(201);

    // Second creation with same name
    const res = await request(app)
      .post('/api/leave-type')
      .set('Cookie', cookie)
      .send(leaveTypeBody);

    expect(res.status).toBe(400);
  });
});
