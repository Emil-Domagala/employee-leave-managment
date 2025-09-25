import { User } from '../../../../common/domains/users/user/user.entity';
import { LeaveType } from '../leaveType/domain/leaveType.entity';

export enum LeaveRequestStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
  Cancelled = 'cancelled',
}

export interface LeaveRequestDto {
  id: string;
  employee_id: string;
  leave_type_id: string;
  start_date: Date;
  end_date: Date;
  status: LeaveRequestStatus;
  approver_id: string | null;
  request_date: Date;
  decision_date: Date | null;
}

export interface CreateLeaveRequestDto
  extends Omit<LeaveRequestDto, 'id' | 'status' | 'decision_date'> {}

export interface LeaveRequestWithTypeAndEmployee
  extends Omit<
    LeaveRequestDto,
    'leave_type_id' | 'employee_id' | 'approver_id'
  > {
  leave_type: LeaveType;
  employee: User;
  approver: User;
}
