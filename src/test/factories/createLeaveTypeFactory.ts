import { randomUUID } from 'crypto';
import { Pool } from 'pg';
import { LeaveType } from '../../features/leave/leaveRequest/leaveType/domain/leaveType.entity';
import { LeaveTypesRepository } from '../../features/leave/leaveRequest/leaveType/domain/leaveType.repo';

/**
 * Creates a test leave type with optional overrides.
 * Returns the created LeaveType.
 */
export const createLeaveType = async (
  pool: Pool,
  overrides: Partial<LeaveType> = {},
): Promise<LeaveType> => {
  const leaveTypesRepo = new LeaveTypesRepository(pool);

  const id = randomUUID().substring(0, 8);

  const leaveTypeData: Omit<LeaveType, 'id'> = {
    name: `Leave-${id}`,
    is_paid: true,
    annual_allowance: 20,
    ...overrides,
  };

  const newLeaveType = await leaveTypesRepo.create(leaveTypeData);
  return newLeaveType;
};
