import { EntityNotFoundError } from '../../../../common/errors/entityNotFoundError';
import { LeaveType } from './domain/leaveType.entity';
import { LeaveTypesRepository } from './domain/leaveType.repo';
import { CreateLeaveTypeBodyDto } from './dto/createLeaveTypeBody.dto';

export class LeaveTypesService {
  constructor(private leaveTypesRepo: LeaveTypesRepository) {}

  getAllLeaveTypes = async (): Promise<LeaveType[]> => {
    return this.leaveTypesRepo.getAll();
  };

  getLeaveTypeById = async (id: string): Promise<LeaveType | null> => {
    const res = await this.leaveTypesRepo.getById(id);
    if (!res) throw new EntityNotFoundError('Leave type not found');
    return res;
  };
  createLeaveType = async (
    data: CreateLeaveTypeBodyDto,
  ): Promise<LeaveType> => {
    const existing = await this.leaveTypesRepo.getByName(data.name);
    if (existing) throw new Error('Leave type already exists');
    return this.leaveTypesRepo.create(data);
  };
}
