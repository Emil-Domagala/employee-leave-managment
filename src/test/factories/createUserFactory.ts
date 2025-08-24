import { PasswordManager } from '../../common/utils/passwordManager';
import { randomUUID } from 'crypto';
import { User } from '../../features/users/user/user.entity';
import { Role } from '../../features/users/role/role.entity';
import { UsersRepository } from '../../features/users/user/user.repo';
import { RolesRepository } from '../../features/users/role/role.repo';
import { EntityNotFoundError } from '../../common/errors/entityNotFoundError';

export const createUser = async (
  overrides: Partial<User> = {},
  initRole: Omit<Role, 'id'> = { name: 'employee' },
): Promise<{ user: User; userPassword: string }> => {
  const UserRepo = new UsersRepository();
  const RoleRepo = new RolesRepository();
  let role = await RoleRepo.getByName(initRole.name);
  if (!role) throw new EntityNotFoundError('Role not found');

  const id = randomUUID().substring(0, 8);

  let hashedPassword: string;
  let initPassword;
  if (overrides.password) {
    initPassword = overrides.password;
    hashedPassword = await PasswordManager.toHash(overrides.password);
  } else {
    initPassword = 'password';
    hashedPassword = await PasswordManager.toHash('password');
  }
  const user: Omit<User, 'id'> = {
    first_name: id.substring(0, 6),
    last_name: id.substring(6, 12),
    email: id.substring(0, 6) + '@example.com',
    salary: 5000,
    role_id: role.id,
    status: 'active',
    password: hashedPassword,
    ...overrides,
  };

  const newUser = await UserRepo.create(user);
  return { user: newUser, userPassword: initPassword };
};
