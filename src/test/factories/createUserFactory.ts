import { PasswordManager } from '../../common/utils/passwordManager';
import { Role, UserRole } from '../../user/role.entity';
import { User } from '../../user/user.entity';
import { TestDataSource } from '../setupTestDB';
import { randomUUID } from 'crypto';

export const createUser = async (
  overrides: Partial<User> = {},
  roleName = UserRole.EMPLOYEE,
): Promise<User> => {
  const UserRepo = TestDataSource.getRepository(User);
  const RoleRepo = TestDataSource.getRepository(Role);
  let role = await RoleRepo.findOne({ where: { name: roleName } });

  const id = randomUUID().substring(0, 8);

  if (!role) {
    role = RoleRepo.create({ name: roleName });
    await RoleRepo.save(role);
  }

  let hashedPassword: string;
  if (overrides.password) {
    hashedPassword = await PasswordManager.toHash(overrides.password);
  } else {
    hashedPassword = await PasswordManager.toHash(id);
  }

  const user = UserRepo.create({
    email: id + '@test.com',
    name: id,
    lastname: id,
    password: hashedPassword,
    role,
    ...overrides,
  });
  const savedUser = await UserRepo.save(user);
  return savedUser;
};
