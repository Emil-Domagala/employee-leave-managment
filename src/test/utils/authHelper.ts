import request from 'supertest';
import app from '../../app';
import { RoleName } from '../../common/domains/users/role/role.entity';
import { pool } from '../../config/db';
import { UsersRepository } from '../../common/domains/users/user/user.repo';
import { RolesRepository } from '../../common/domains/users/role/role.repo';
import { PasswordManager } from '../../common/utils/passwordManager';
import { UserStatus } from '../../common/domains/users/user/user.entity';

export const signinAs = async (role: RoleName) => {
  const usersRepo = new UsersRepository(pool);
  const rolesRepo = new RolesRepository(pool);

  const roleEntity = await rolesRepo.getByName(role);
  if (!roleEntity) {
    throw new Error(`Role ${role} not found in DB. Did you seed roles?`);
  }

  const password = 'Password123!';
  const hashed = await PasswordManager.toHash(password);

  const email = `test-${role.toLowerCase()}@example.com`;

  let user = await usersRepo.getByEmail(email);
  if (!user) {
    user = await usersRepo.create({
      first_name: 'Test',
      last_name: role,
      email,
      salary: 1000,
      status: UserStatus.ACTIVE,
      role_id: roleEntity.id,
      password: hashed,
    });
  }

  const res = await request(app)
    .post('/api/auth/signin')
    .send({ email: user.email, password })
    .expect(200);

  const cookie = res.get('Set-Cookie');
  if (!cookie) {
    throw new Error('No cookie returned from signin');
  }

  return { user, cookie };
};
