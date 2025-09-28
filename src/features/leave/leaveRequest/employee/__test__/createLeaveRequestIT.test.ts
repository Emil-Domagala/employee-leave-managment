import request from 'supertest';
import { describe, it, beforeAll, afterEach, expect } from 'vitest';
import { containers, app } from '../../../../../test/vitest.setup';
import { signinAs } from '../../../../../test/utils/authHelper';
import { RoleName } from '../../../../../common/domains/users/role/role.entity';
import { createUser } from '../../../../../test/factories/createUserFactory';
import { createLeaveType } from '../../../../../test/factories/createLeaveTypeFactory';
import { randomUUID } from 'crypto';
import { LeaveRequestsRepository } from '../../domain/leaveRequest.repo';
import { UserStatus } from '../../../../../common/domains/users/user/user.entity';

describe('POST /api/leave-request/ (Employee)', () => {
  let leaveRequestRepo: LeaveRequestsRepository;
  let employeeCookie: string[];
  let employeeId: string;
  let leaveTypeId: string;
  let createdLeaveRequestId: string;

  beforeAll(async () => {
    leaveRequestRepo = new LeaveRequestsRepository(containers.pgPool);

    const { user: employee, cookie } = await signinAs(RoleName.EMPLOYEE);
    employeeId = employee.id;
    employeeCookie = cookie;

    const leaveType = await createLeaveType(containers.pgPool, {
      annual_allowance: 20,
    });
    leaveTypeId = leaveType.id;
  });

  afterEach(async () => {
    if (createdLeaveRequestId) {
      await leaveRequestRepo.deleteById(createdLeaveRequestId);
      createdLeaveRequestId = '';
    }
  });

  it('creates a new leave request successfully', async () => {
    const start_date = new Date('2025-10-01');
    const end_date = new Date('2025-10-03');

    const res = await request(app)
      .post('/api/leave-request/')
      .set('Cookie', employeeCookie)
      .send({ leave_type_id: leaveTypeId, start_date, end_date });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('employee_id', employeeId);
    expect(res.body).toHaveProperty('leave_type_id', leaveTypeId);
    createdLeaveRequestId = res.body.id;
  });

  it('rejects if user is not active', async () => {
    // Create inactive user
    const inactiveUser = await createUser(containers.pgPool, {
      status: UserStatus.INACTIVE,
    });

    // Sign in but expect failure
    const { res } = await signinAs(
      RoleName.EMPLOYEE,
      inactiveUser.user.email,
      UserStatus.INACTIVE,
      false, // expect login to fail
    );

    // Login itself should fail
    expect(res.status).toBe(400);

    // Optional: attempt to create leave request with this failed login cookie
    const cookie = res.get('Set-Cookie') ?? [];
    const start_date = new Date('2025-10-01');
    const end_date = new Date('2025-10-03');

    const leaveRes = await request(app)
      .post('/api/leave-request/')
      .set('Cookie', cookie)
      .send({ leave_type_id: leaveTypeId, start_date, end_date });

    expect(leaveRes.status).toBe(401); // unauthorized since login failed
  });

  it('rejects if leave request overlaps an existing one', async () => {
    const existingRequest = await leaveRequestRepo.create({
      employee_id: employeeId,
      leave_type_id: leaveTypeId,
      start_date: new Date('2025-10-05'),
      end_date: new Date('2025-10-07'),
      request_date: new Date(),
    });
    createdLeaveRequestId = existingRequest.id;

    const res = await request(app)
      .post('/api/leave-request/')
      .set('Cookie', employeeCookie)
      .send({
        leave_type_id: leaveTypeId,
        start_date: new Date('2025-10-06'),
        end_date: new Date('2025-10-08'),
      });

    expect(res.status).toBe(400);
  });

  it('rejects if leave type does not exist', async () => {
    const res = await request(app)
      .post('/api/leave-request/')
      .set('Cookie', employeeCookie)
      .send({
        leave_type_id: randomUUID(),
        start_date: new Date('2025-10-01'),
        end_date: new Date('2025-10-03'),
      });

    expect(res.status).toBe(404);
  });

  it('rejects if requested days exceed allowance', async () => {
    const res = await request(app)
      .post('/api/leave-request/')
      .set('Cookie', employeeCookie)
      .send({
        leave_type_id: leaveTypeId,
        start_date: new Date('2025-10-01'),
        end_date: new Date('2025-10-31'),
      });

    expect(res.status).toBe(400);
  });

  it('rejects if user is not authenticated', async () => {
    const res = await request(app)
      .post('/api/leave-request/')
      .send({
        leave_type_id: leaveTypeId,
        start_date: new Date('2025-10-01'),
        end_date: new Date('2025-10-03'),
      });

    expect(res.status).toBe(401);
  });
});
