import { Request, Response, NextFunction } from 'express';
import { LeaveTypesService } from './leaveRequest.service';
import { EntityNotFoundError } from '../../../../common/errors/entityNotFoundError';
import { validateBody } from '../../../../common/utils/validateBody';
import {
  CreateLeaveTypeBodyDto,
  createLeaveTypeBodySchema,
} from './dto/createLeaveTypeBody.dto';

export class LeaveTypesController {
  constructor(private service: LeaveTypesService) {}

  getAllLeaveTypes = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const leaveTypes = await this.service.getAllLeaveTypes();
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
      const leaveType = await this.service.getLeaveTypeById(id);
      if (!leaveType) throw new EntityNotFoundError('Leave type not found');
      res.status(200).json(leaveType);
    } catch (err) {
      next(err);
    }
  };
  createLeaveType = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = validateBody<CreateLeaveTypeBodyDto>(
        req.body,
        createLeaveTypeBodySchema,
      );
      const newLT = await this.service.createLeaveType(body);
      res.status(201).json(newLT);
    } catch (err) {
      next(err);
    }
  };
}
