import { PasswordManager } from '../common/utils/passwordManager';
import { AppDataSource } from '../dataSource';
import { Role, UserRole } from '../user/role.entity';
import { User } from '../user/user.entity';

export const seedRoles = async () => {
  const roleRepo = AppDataSource.getRepository(Role);

  for (const roleName of Object.values(UserRole)) {
    const exists = await roleRepo.findOne({ where: { name: roleName } });
    if (!exists) {
      const role = roleRepo.create({ name: roleName });
      await roleRepo.save(role);
    } else {
      console.log(`Role ${roleName} already exists`);
    }
  }
  console.log('Roles seeded');
};

export const seedAdmin = async () => {
  const roleRepository = AppDataSource.getRepository(Role);
  const userRepository = AppDataSource.getRepository(User);

  let adminRole = await roleRepository.findOne({
    where: { name: UserRole.ADMIN },
  });
  if (!adminRole) {
    adminRole = roleRepository.create({ name: UserRole.ADMIN });
    await roleRepository.save(adminRole);
    console.log('Created admin role');
  }

  const existingAdmin = await userRepository.findOne({
    where: { email: 'test@test.test' },
  });
  if (existingAdmin) {
    console.log('Admin user already exists');
    return;
  }

  const hashedPassword = await PasswordManager.toHash('password');

  const adminUser = userRepository.create({
    email: 'test@test.test',
    name: 'Admin',
    lastname: 'User',
    password: hashedPassword,
    role: adminRole,
  });

  await userRepository.save(adminUser);
  console.log('Admin user created successfully');
};
