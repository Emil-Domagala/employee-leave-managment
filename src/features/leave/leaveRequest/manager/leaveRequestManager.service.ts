import { EntityNotFoundError } from '../../../../common/errors/entityNotFoundError';
import { UpdateLeaveRequestStatusBody } from '../domain/dto/updateLeaveRequestBody.dto';
import { LeaveRequestStatus } from '../domain/leaveRequest.entity';
import { LeaveRequestsRepository } from '../domain/leaveRequest.repo';

export class LeaveRequestsManagerService {
  constructor(private leaveRequestsRepo: LeaveRequestsRepository) {}
  updateLeaveRequest = async (
    id: string,
    status: LeaveRequestStatus,
    approverId: string,
  ) => {
    const lr = await this.leaveRequestsRepo.getById(id);
    if (!lr) throw new EntityNotFoundError('Leave request not found');

    if (lr.status !== LeaveRequestStatus.Pending)
      throw new Error('Only pending leave requests can be updated');

    const updated = await this.leaveRequestsRepo.updateStatus(
      id,
      status,
      approverId,
    );
    return updated;
  };

  getLeaveRequestsManager = async () => {
    // Fetch all leave requests with their types and employees it is just a demo implementation
    // In real application you might want to add pagination, filtering, etc.
    // Also you might want to restrict the data based on the manager's team
    // For simplicity we are returning all leave requests here
    const lrs = await this.leaveRequestsRepo.getAll();
    return lrs;
  };

  getLeaveRequestByIdManager = async (id: string) => {
    const lr = await this.leaveRequestsRepo.getById(id);
    if (!lr) throw new EntityNotFoundError('Leave request not found');

    return lr;
  };
}
