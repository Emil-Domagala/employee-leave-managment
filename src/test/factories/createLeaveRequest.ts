import { randomUUID } from 'crypto';
import { Pool } from 'pg';
import {
  LeaveRequestDto,
  LeaveRequestStatus,
} from '../../features/leave/leaveRequest/domain/leaveRequest.entity';
import { LeaveRequestsRepository } from '../../features/leave/leaveRequest/domain/leaveRequest.repo';

/**
 * Creates a test leave request with optional overrides.
 * Requires employeeId and leaveTypeId.
 * Returns the created LeaveRequest.
 */
export const createLeaveRequest = async (
  pool: Pool,
  overrides: Partial<LeaveRequestDto> = {},
  requiredIds: { employee_id: string; leave_type_id: string },
): Promise<LeaveRequestDto> => {
  const leaveRequestsRepo = new LeaveRequestsRepository(pool);

  const leaveRequestData: Omit<LeaveRequestDto, 'id'> = {
    employee_id: requiredIds.employee_id,
    leave_type_id: requiredIds.leave_type_id,
    start_date: new Date(),
    end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    status: LeaveRequestStatus.Pending,
    approver_id: overrides.approver_id || null,
    request_date: new Date(),
    decision_date: overrides.decision_date || null,
    ...overrides,
  };

  const newLeaveRequest = await leaveRequestsRepo.create(leaveRequestData);
  return newLeaveRequest;
};
