import is from 'zod/v4/locales/is.cjs';
import { UsersRepository } from '../../../../common/domains/users/user/user.repo';
import { EntityNotFoundError } from '../../../../common/errors/entityNotFoundError';
import { CreateLeaveRequestBody } from '../domain/dto/createLeaveRequestBody.dto';
import { LeaveRequestsRepository } from '../domain/leaveRequest.repo';
import { LeaveTypesRepository } from '../leaveType/domain/leaveType.repo';

export class LeaveRequestsEmployeeService {
  constructor(
    private repo: LeaveRequestsRepository,
    private leaveTypeRepo: LeaveTypesRepository,
    private userRepo: UsersRepository,
  ) {}

  createLeaveRequest = async (data: CreateLeaveRequestBody, userId: string) => {
    const [isActive, hasOverlappingRequest, leaveType] = await Promise.all([
      this.userRepo.isUserActive(userId),
      this.repo.hasOverlappingRequest(userId, data.start_date, data.end_date),
      await this.leaveTypeRepo.getById(data.leave_type_id),
    ]);

    if (!isActive) throw new Error('User is not active');

    if (hasOverlappingRequest)
      throw new Error('You have overlapping leave request');

    if (!leaveType) throw new EntityNotFoundError('Leave type not found');

    const usedAllowance = await this.repo.getUsedAllowance(
      userId,
      data.leave_type_id,
    );

    if (usedAllowance === null) throw new Error('Cannot get used allowance');

    const requestedDays =
      (new Date(data.end_date).getTime() -
        new Date(data.start_date).getTime()) /
        (1000 * 3600 * 24) +
      1;

    if (requestedDays > leaveType.annual_allowance - usedAllowance)
      throw new Error('You do not have enough allowance for this leave type');

    const lr = await this.repo.create({
      employee_id: userId,
      leave_type_id: data.leave_type_id,
      start_date: data.start_date,
      end_date: data.end_date,
      request_date: new Date(),
    });
    return lr;
  };
  getLeaveRequests = async (userId: string) => {
    const lrs = await this.repo.getAllByUserId(userId);
    return lrs;
  };

  getLeaveRequestById = async (id: string, userId: string) => {
    const lr = await this.repo.getById(id);
    if (!lr) throw new EntityNotFoundError('Leave request not found');
    if (lr.employee_id !== userId) throw new Error('Leave request not found');
    return lr;
  };
}
