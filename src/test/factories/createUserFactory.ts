import { PasswordManager } from '../../common/utils/passwordManager';
import { randomUUID } from 'crypto';
import { User, UserStatus } from '../../common/domains/users/user/user.entity';
import { Role, RoleName } from '../../common/domains/users/role/role.entity';
import { UsersRepository } from '../../common/domains/users/user/user.repo';
import { RolesRepository } from '../../common/domains/users/role/role.repo';
import { EntityNotFoundError } from '../../common/errors/entityNotFoundError';
import { pool } from '../../config/db';

export const createUser = async (
  overrides: Partial<User> = {},
  initRole: Omit<Role, 'id'> = { name: RoleName.EMPLOYEE },
): Promise<{ user: User; userPassword: string }> => {
  const userRepo = new UsersRepository(pool);
  const roleRepo = new RolesRepository(pool);

  let role = await roleRepo.getByName(initRole.name);
  if (!role) throw new EntityNotFoundError('Role not found');

  const id = randomUUID().substring(0, 8);

  let hashedPassword: string;
  let initPassword: string;
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
    email: `${id.substring(0, 6)}@example.com`,
    salary: 5000,
    role_id: role.id,
    status: UserStatus.ACTIVE,
    password: hashedPassword,
    ...overrides,
  };

  const newUser = await userRepo.create(user);
  return { user: newUser, userPassword: initPassword };
};
