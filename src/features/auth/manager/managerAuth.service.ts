import { EntityNotFoundError } from '../../../common/errors/entityNotFoundError';
import { PasswordManager } from '../../../common/utils/passwordManager';
import { RoleName } from '../../../common/domains/users/role/role.entity';
import { RolesRepository } from '../../../common/domains/users/role/role.repo';
import { UsersRepository } from '../../../common/domains/users/user/user.repo';
import { CreateEmployeeBody } from './dto/createEmployee.dto';
import { CompensationHistoryBody } from '../../compensation/compensationHistory/dto/CreateCompensationHistory.dto';
import { CompensationHistoryService } from '../../compensation/compensationHistory/compensationHistory.service';
import { CouldNotSaveEntityError } from '../../../common/errors/couldNotSaveEntityError';
import { EmployeeEmailExistsError } from './errors/employeeEmailExistsError';

export class ManagerAuthService {
  constructor(
    private userRepo: UsersRepository,
    private roleRepo: RolesRepository,
    private compensationHistoryRepo: CompensationHistoryService,
  ) {}

  /**
   * Attempts to create new employee
   *
   * @throws {EntityNotFoundError} If role not found
   */
  createEmployee = async (
    user: CreateEmployeeBody,
    compensation: CompensationHistoryBody,
  ) => {
    const role = await this.roleRepo.getByName(RoleName.EMPLOYEE);
    if (!role) {
      console.log('Role not found');
      throw new EntityNotFoundError('Role not found');
    }
    const password = await PasswordManager.generate();
    const hashed = await PasswordManager.toHash(password);

    const existingUser = await this.userRepo.getByEmail(user.email);
    if (existingUser) {
      throw new EmployeeEmailExistsError('User already exists');
    }

    const newUser = await this.userRepo.create({
      ...user,
      role_id: role.id,
      password: hashed,
    });

    if (!newUser)
      throw new CouldNotSaveEntityError('User', 'Failed to save to database');

    const newCompensation = await this.compensationHistoryRepo.create({
      ...compensation,
      user_id: newUser.id,
    });

    if (!newCompensation)
      throw new CouldNotSaveEntityError(
        'CompensationHistory',
        'Failed to save to database',
      );

    return password;
  };
}
