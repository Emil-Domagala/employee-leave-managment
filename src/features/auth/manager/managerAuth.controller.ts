import { Request, Response, NextFunction } from 'express';
import { validateBody } from '../../../common/utils/validateBody';
import {
  CreateEmployeeBody,
  createEmployeeSchema,
} from './dto/createEmployee.dto';
import { ManagerAuthService } from './managerAuth.service';

export class ManagerAuthController {
  constructor(private managerAuthService: ManagerAuthService) {}

  createEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = validateBody<CreateEmployeeBody>(
        req.body,
        createEmployeeSchema,
      );
      const password = await this.managerAuthService.createEmployee(data);
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
