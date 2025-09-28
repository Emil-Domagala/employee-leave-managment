import request from 'supertest';
import { describe, it, beforeAll, afterEach, expect } from 'vitest';
import { containers, app } from '../../../../../test/vitest.setup';
import { signinAs } from '../../../../../test/utils/authHelper';
import { RoleName } from '../../../../../common/domains/users/role/role.entity';
import { LeaveRequestsRepository } from '../../domain/leaveRequest.repo';
import { createUser } from '../../../../../test/factories/createUserFactory';
import { createLeaveType } from '../../../../../test/factories/createLeaveTypeFactory';
import { createLeaveRequest } from '../../../../../test/factories/createLeaveRequest';

describe('GET /api/leave-request/manager (Manager)', () => {
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

  it('allows MANAGER to get all leave requests', async () => {
    const leaveRequest = await createLeaveRequest(
      containers.pgPool,
      {},
      { employee_id: employeeId, leave_type_id: leaveTypeId },
    );
    leaveRequestId = leaveRequest.id;

    const res = await request(app)
      .get('/api/leave-request/manager')
      .set('Cookie', managerCookie);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);

    const fetchedRequest = res.body.find((lr: any) => lr.id === leaveRequestId);
    expect(fetchedRequest).toBeDefined();
    expect(fetchedRequest).toHaveProperty('employee_id', employeeId);
    expect(fetchedRequest).toHaveProperty('leave_type_id', leaveTypeId);
  });

  it('rejects if user is not authenticated', async () => {
    const res = await request(app).get('/api/leave-request/manager');
    expect(res.status).toBe(401);
  });

  it('rejects if user is not MANAGER', async () => {
    const { cookie: employeeCookie } = await signinAs(RoleName.EMPLOYEE);

    const res = await request(app)
      .get('/api/leave-request/manager')
      .set('Cookie', employeeCookie);

    expect(res.status).toBe(401);
  });
});
