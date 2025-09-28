import request from 'supertest';
import { describe, it, beforeAll, afterEach, expect } from 'vitest';
import { containers, app } from '../../../../../test/vitest.setup';
import { signinAs } from '../../../../../test/utils/authHelper';
import { RoleName } from '../../../../../common/domains/users/role/role.entity';
import { LeaveRequestsRepository } from '../../domain/leaveRequest.repo';
import { createUser } from '../../../../../test/factories/createUserFactory';
import { createLeaveType } from '../../../../../test/factories/createLeaveTypeFactory';
import { createLeaveRequest } from '../../../../../test/factories/createLeaveRequest';
import { LeaveRequestStatus } from '../../domain/leaveRequest.entity';

describe('PATCH /api/leave-request/manager/:id (Manager)', () => {
  let leaveRequestRepo: LeaveRequestsRepository;
  let managerCookie: string[];
  let employeeId: string;
  let leaveTypeId: string;
  let leaveRequestId: string;

  beforeAll(async () => {
    leaveRequestRepo = new LeaveRequestsRepository(containers.pgPool);

    // Sign in as a manager
    const { cookie } = await signinAs(RoleName.MANAGER);
    managerCookie = cookie;

    // Create an employee
    const { user: employee } = await createUser(containers.pgPool);
    employeeId = employee.id;

    // Create a leave type
    const leaveType = await createLeaveType(containers.pgPool);
    leaveTypeId = leaveType.id;
  });

  afterEach(async () => {
    if (leaveRequestId) {
      await leaveRequestRepo.deleteById(leaveRequestId);
      leaveRequestId = '';
    }
  });

  it('allows MANAGER to update a pending leave request status', async () => {
    const leaveRequest = await createLeaveRequest(
      containers.pgPool,
      { status: LeaveRequestStatus.Pending },
      { employee_id: employeeId, leave_type_id: leaveTypeId },
    );
    leaveRequestId = leaveRequest.id;

    const res = await request(app)
      .patch(`/api/leave-request/manager/${leaveRequestId}`)
      .set('Cookie', managerCookie)
      .send({ status: LeaveRequestStatus.Approved });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', leaveRequestId);
    expect(res.body).toHaveProperty('status', LeaveRequestStatus.Approved);
  });

  it('rejects if leave request is not pending', async () => {
    const leaveRequest = await createLeaveRequest(
      containers.pgPool,
      { status: LeaveRequestStatus.Approved },
      { employee_id: employeeId, leave_type_id: leaveTypeId },
    );
    leaveRequestId = leaveRequest.id;

    const res = await request(app)
      .patch(`/api/leave-request/manager/${leaveRequestId}`)
      .set('Cookie', managerCookie)
      .send({ status: LeaveRequestStatus.Rejected });

    expect(res.status).toBe(400);
  });

  it('rejects if leave request does not exist', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';

    const res = await request(app)
      .patch(`/api/leave-request/manager/${fakeId}`)
      .set('Cookie', managerCookie)
      .send({ status: LeaveRequestStatus.Approved });

    expect(res.status).toBe(404);
  });

  it('rejects if user is not authenticated', async () => {
    const res = await request(app)
      .patch(`/api/leave-request/manager/${leaveRequestId || 'fake-id'}`)
      .send({ status: LeaveRequestStatus.Approved });

    expect(res.status).toBe(401);
  });

  it('rejects if user is not MANAGER', async () => {
    const { cookie: employeeCookie } = await signinAs(RoleName.EMPLOYEE);

    const res = await request(app)
      .patch(`/api/leave-request/manager/${leaveRequestId || 'fake-id'}`)
      .set('Cookie', employeeCookie)
      .send({ status: LeaveRequestStatus.Approved });

    expect(res.status).toBe(401);
  });
});
