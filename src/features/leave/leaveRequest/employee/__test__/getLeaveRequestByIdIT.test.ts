import request from 'supertest';
import { describe, it, beforeAll, afterEach, expect } from 'vitest';
import { containers, app } from '../../../../../test/vitest.setup';
import { signinAs } from '../../../../../test/utils/authHelper';
import { RoleName } from '../../../../../common/domains/users/role/role.entity';
import { createUser } from '../../../../../test/factories/createUserFactory';
import { createLeaveType } from '../../../../../test/factories/createLeaveTypeFactory';
import { createLeaveRequest } from '../../../../../test/factories/createLeaveRequest';
import { randomUUID } from 'crypto';
import { LeaveRequestsRepository } from '../../domain/leaveRequest.repo';

describe('GET /api/leave-request/:id (Employee)', () => {
  let leaveRequestRepo: LeaveRequestsRepository;
  let employeeCookie: string[];
  let employeeId: string;
  let leaveTypeId: string;
  let leaveRequestId: string;
  const fakeId = randomUUID();

  beforeAll(async () => {
    leaveRequestRepo = new LeaveRequestsRepository(containers.pgPool);

    // Create employee and sign in
    const { user: employee, cookie } = await signinAs(RoleName.EMPLOYEE);
    employeeId = employee.id;
    employeeCookie = cookie;

    // Create leave type
    const leaveType = await createLeaveType(containers.pgPool);
    leaveTypeId = leaveType.id;
  });

  afterEach(async () => {
    if (leaveRequestId) {
      await leaveRequestRepo.deleteById(leaveRequestId);
      leaveRequestId = '';
    }
  });

  it('allows user to get their own leave request by ID', async () => {
    const leaveRequest = await createLeaveRequest(
      containers.pgPool,
      {},
      { employee_id: employeeId, leave_type_id: leaveTypeId },
    );
    leaveRequestId = leaveRequest.id;

    const res = await request(app)
      .get(`/api/leave-request/${leaveRequestId}`)
      .set('Cookie', employeeCookie);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', leaveRequestId);
    expect(res.body).toHaveProperty('employee_id', employeeId);
  });

  it('rejects if user tries to access another user’s leave request', async () => {
    const { user: otherUser } = await createUser(containers.pgPool);
    const otherLeaveRequest = await createLeaveRequest(
      containers.pgPool,
      {},
      { employee_id: otherUser.id, leave_type_id: leaveTypeId },
    );

    const res = await request(app)
      .get(`/api/leave-request/${otherLeaveRequest.id}`)
      .set('Cookie', employeeCookie);

    expect(res.status).toBe(404);
  });

  it('rejects if user is not authenticated', async () => {
    const res = await request(app).get(
      `/api/leave-request/${leaveRequestId || fakeId}`,
    );
    expect(res.status).toBe(401);
  });

  it('returns 404 if leave request does not exist', async () => {
    const nonExistentId = randomUUID();

    const res = await request(app)
      .get(`/api/leave-request/${nonExistentId}`)
      .set('Cookie', employeeCookie);

    expect(res.status).toBe(404);
  });
});
