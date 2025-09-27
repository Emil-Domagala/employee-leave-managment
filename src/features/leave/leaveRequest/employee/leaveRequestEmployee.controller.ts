import { Request, Response, NextFunction } from 'express';
import { LeaveRequestsRepository } from '../domain/leaveRequest.repo';
import { validateBody } from '../../../../common/utils/validateBody';
import {
  CreateLeaveRequestBody,
  createLeaveRequestSchema,
} from '../domain/dto/createLeaveRequestBody.dto';
import { LeaveRequestsEmployeeService } from './leaveRequestEmployee.service';

export class LeaveRequestsEmployeeController {
  constructor(private service: LeaveRequestsEmployeeService) {}
  createLeaveRequest = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const body = validateBody<CreateLeaveRequestBody>(
        req.body,
        createLeaveRequestSchema,
      );
      const newRequest = await this.service.createLeaveRequest(
        body,
        req.user!.userId,
      );
      res.status(201).json(newRequest);
    } catch (err) {
      next(err);
    }
  };
  getLeaveRequests = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const response = await this.service.getLeaveRequests(req.user!.userId);

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };
  getLeaveRequestById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const response = await this.service.getLeaveRequestById(id, req.user!.userId);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };
}
