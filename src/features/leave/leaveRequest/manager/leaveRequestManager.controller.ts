import { Request, Response, NextFunction } from 'express';
import { validateBody } from '../../../../common/utils/validateBody';
import {
  UpdateLeaveRequestStatusBody,
  updateLeaveRequestStatusSchema,
} from '../domain/dto/updateLeaveRequestBody.dto';
import { LeaveRequestsManagerService } from './leaveRequestManager.service';

export class LeaveRequestsManagerController {
  constructor(private service: LeaveRequestsManagerService) {}

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

      const lr = await this.service.updateLeaveRequest(
        id,
        status,
        req.user!.userId,
      );
      res.status(200).json(lr);
    } catch (err) {
      next(err);
    }
  };
  getLeaveRequestsManager = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const lrs = await this.service.getLeaveRequestsManager();
      res.status(200).json(lrs);
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
      const lr = await this.service.getLeaveRequestByIdManager(id);
      res.status(200).json(lr);
    } catch (err) {
      next(err);
    }
  };
}
