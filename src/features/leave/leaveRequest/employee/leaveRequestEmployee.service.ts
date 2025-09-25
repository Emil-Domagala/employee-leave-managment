import { EntityNotFoundError } from '../../../../common/errors/entityNotFoundError';
import { CreateLeaveRequestBody } from '../domain/dto/createLeaveRequestBody.dto';
import { LeaveRequestsRepository } from '../domain/leaveRequest.repo';

export class LeaveRequestsEmployeeService {
  constructor(private leaveRequestsRepo: LeaveRequestsRepository) {}

  createLeaveRequest = async (data:CreateLeaveRequestBody, userId: string) => {

  };
  getLeaveRequests = async (userId: string) => {
    const lrs = await this.leaveRequestsRepo.getAllByUserId(userId);
    return lrs;
  };
  getLeaveRequestById = async (id: string) => {
    const lr = await this.leaveRequestsRepo.getById(id);
    if (!lr) throw new EntityNotFoundError('Leave request not found');
    return lr;
  };
}
