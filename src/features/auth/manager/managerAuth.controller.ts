import { Request, Response, NextFunction } from 'express';
import { validateBody } from '../../../common/utils/validateBody';
import {
  CreateEmployeeBody,
  createEmployeeSchema,
} from './dto/createEmployee.dto';
import { ManagerAuthService } from './managerAuth.service';
import {
  CompensationHistoryBody,
  compensationHistoryBodySchema,
} from '../../compensation/compensationHistory/dto/CreateCompensationHistory.dto';

export class ManagerAuthController {
  constructor(private managerAuthService: ManagerAuthService) {}

  createEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = validateBody<CreateEmployeeBody>(
        req.body.user,
        createEmployeeSchema,
      );
      const compensation = validateBody<CompensationHistoryBody>(
        req.body.compensation,
        compensationHistoryBodySchema,
      );

      const password = await this.managerAuthService.createEmployee(
        user,
        compensation,
      );
      res.status(201).json({ password });
    } catch (err) {
      next(err);
    }
  };

  editEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // TODO
    } catch (err) {
      next(err);
    }
  };
}
