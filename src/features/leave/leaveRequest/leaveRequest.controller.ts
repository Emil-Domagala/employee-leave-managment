import { Request, Response, NextFunction } from 'express';
import { LeaveRequestsRepository } from './domain/leaveRequest.repo';
import { validateBody } from '../../../common/utils/validateBody';
import {
  CreateLeaveRequestBody,
  createLeaveRequestSchema,
} from './domain/dto/createLeaveRequestBody.dto';
import {
  UpdateLeaveRequestStatusBody,
  updateLeaveRequestStatusSchema,
} from './domain/dto/updateLeaveRequestBody.dto';

export class LeaveRequestsController {
  constructor(private leaveRequestsRepo: LeaveRequestsRepository) {}
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
      res.status(200).json();
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
      res.status(200).json();
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
      res.status(200).json();
    } catch (err) {
      next(err);
    }
  };
  updateLeaveRequest = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const { status } = validateBody<UpdateLeaveRequestStatusBody>(
        req.body,
        updateLeaveRequestStatusSchema,
      );
      res.status(200).json();
    } catch (err) {
      next(err);
    }
  };
  getLeaveRequestsManager = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      res.status(200).json();
    } catch (err) {
      next(err);
    }
  };
  getLeaveRequestByIdManager = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      res.status(200).json();
    } catch (err) {
      next(err);
    }
  };
}
