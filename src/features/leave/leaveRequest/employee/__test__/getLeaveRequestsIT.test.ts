import request from 'supertest';
import { describe, it, beforeAll, afterEach, expect } from 'vitest';
import { containers, app } from '../../../../../test/vitest.setup';
import { signinAs } from '../../../../../test/utils/authHelper';
import { RoleName } from '../../../../../common/domains/users/role/role.entity';
import { createUser } from '../../../../../test/factories/createUserFactory';
import { createLeaveType } from '../../../../../test/factories/createLeaveTypeFactory';
import { createLeaveRequest } from '../../../../../test/factories/createLeaveRequest';
import { LeaveRequestsRepository } from '../../domain/leaveRequest.repo';

describe('GET /api/leave-request (Employee)', () => {
  let leaveRequestRepo: LeaveRequestsRepository;
  let employeeCookie: string[];
  let employeeId: string;
  let leaveTypeId: string;
  let leaveRequestId: string;

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

  it('returns all leave requests for the authenticated user', async () => {
    const leaveRequest = await createLeaveRequest(
      containers.pgPool,
      {},
      { employee_id: employeeId, leave_type_id: leaveTypeId },
    );
    leaveRequestId = leaveRequest.id;

    const res = await request(app)
      .get('/api/leave-request')
      .set('Cookie', employeeCookie);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((lr: any) => lr.id === leaveRequestId)).toBe(true);
  });

  it('does not return leave requests of other users', async () => {
    const { user: otherUser } = await createUser(containers.pgPool);
    const otherLeaveRequest = await createLeaveRequest(
      containers.pgPool,
      {},
      { employee_id: otherUser.id, leave_type_id: leaveTypeId },
    );

    const res = await request(app)
      .get('/api/leave-request')
      .set('Cookie', employeeCookie);

    expect(res.status).toBe(200);
    expect(res.body.some((lr: any) => lr.employee_id === otherUser.id)).toBe(
      false,
    );
  });

  it('rejects if user is not authenticated', async () => {
    const res = await request(app).get('/api/leave-request');
    expect(res.status).toBe(401);
  });
});
