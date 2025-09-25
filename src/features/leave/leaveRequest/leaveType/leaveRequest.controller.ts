import { Request, Response, NextFunction } from 'express';
import { LeaveTypesService } from './leaveRequest.service';
import { EntityNotFoundError } from '../../../../common/errors/entityNotFoundError';

export class LeaveTypesController {
  constructor(private leaveTypesService: LeaveTypesService) {}

  getAllLeaveTypes = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const leaveTypes = await this.leaveTypesService.getAllLeaveTypes();
      res.status(200).json(leaveTypes);
    } catch (err) {
      next(err);
    }
  };

  getLeaveTypeById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const leaveType = await this.leaveTypesService.getLeaveTypeById(id);
      if (!leaveType) throw new EntityNotFoundError('Leave type not found');
      res.status(200).json(leaveType);
    } catch (err) {
      next(err);
    }
  };
  createLeaveType = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json();
    } catch (err) {
      next(err);
    }
  };
}
