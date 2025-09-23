import { EntityNotFoundError } from '../../../common/errors/entityNotFoundError';
import { PasswordManager } from '../../../common/utils/passwordManager';
import { RoleName } from '../../../common/domains/users/role/role.entity';
import { RolesRepository } from '../../../common/domains/users/role/role.repo';
import { UsersRepository } from '../../../common/domains/users/user/user.repo';
import { CreateEmployeeBody } from './dto/createEmployee.dto';

export class ManagerAuthService {
  constructor(
    private userRepo: UsersRepository,
    private roleRepo: RolesRepository,
  ) {}

  /**
   * Attempts to create new employee
   *
   * @throws {EntityNotFoundError} If role not found
   */
  createEmployee = async (data: CreateEmployeeBody) => {
    const role = await this.roleRepo.getByName(RoleName.EMPLOYEE);
    if (!role) throw new EntityNotFoundError('Role not found');
    const password = await PasswordManager.generate();
    const hashed = await PasswordManager.toHash(password);

    const newUser = await this.userRepo.create({
      ...data,
      role_id: role.id,
      password: hashed,
    });
    if (!newUser) throw new Error();

    return password;
  };
}
