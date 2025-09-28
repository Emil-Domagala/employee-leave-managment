import request from 'supertest';
import { app, containers } from '../vitest.setup';
import { RoleName } from '../../common/domains/users/role/role.entity';
import { UsersRepository } from '../../common/domains/users/user/user.repo';
import { RolesRepository } from '../../common/domains/users/role/role.repo';
import { PasswordManager } from '../../common/utils/passwordManager';
import { UserStatus } from '../../common/domains/users/user/user.entity';

/**
 * Signs in as a user with a specific role.
 *
 * This helper is primarily used in integration tests. It will:
 * 1. Look up the role in the database.
 * 2. Create a user with the given role and status if no `email` is provided or user doesn't exist.
 * 3. Attempt to log in via the API.
 *
 * @param {RoleName} role - The role the user should have (e.g., EMPLOYEE, MANAGER).
 * @param {string} [userEmail] - Optional. If provided, will attempt to sign in as this existing user.
 * @param {UserStatus} [status=UserStatus.ACTIVE] - The account status for a newly created user.
 * @param {boolean} [expectSuccess=true] - If true, expects the login to succeed (status 200) and returns a cookie.
 *                                         If false, returns the raw response to allow testing login failures.
 *
 * @returns {Promise<{ user: any; cookie?: string[]; res?: import('supertest').Response }>}
 * - If `expectSuccess` is true: returns the created/found `user` object and login `cookie`.
 * - If `expectSuccess` is false: returns the `user` object and the raw `res` from the login attempt.
 *
 * @throws {Error} If the specified role does not exist in the database or login succeeds but no cookie is returned.
 *
 * @example
 * // Successful login for an active employee
 * const { user, cookie } = await signinAs(RoleName.EMPLOYEE);
 *
 * @example
 * // Attempt login for inactive user (expected to fail)
 * const { user, res } = await signinAs(RoleName.EMPLOYEE, 'inactive@example.com', UserStatus.INACTIVE, false);
 * expect(res.status).toBe(400);
 */
export const signinAs = async (
  role: RoleName,
  userEmail?: string,
  status = UserStatus.ACTIVE,
  expectSuccess = true,
) => {
  const pool = containers.pgPool;
  const usersRepo = new UsersRepository(pool);
  const rolesRepo = new RolesRepository(pool);

  const roleEntity = await rolesRepo.getByName(role);
  if (!roleEntity) throw new Error(`Role ${role} not found in DB`);

  const password = 'Password123!';
  const hashed = await PasswordManager.toHash(password);

  const email = userEmail ?? `test-${role.toLowerCase()}@example.com`;

  let user = await usersRepo.getByEmail(email);
  if (!user) {
    user = await usersRepo.create({
      first_name: 'Test',
      last_name: role,
      email,
      salary: 1000,
      status,
      role_id: roleEntity.id,
      password: hashed,
    });
  }

  const req = request(app).post('/api/auth/login').send({ email, password });

  if (expectSuccess) {
    const res = await req.expect(200);
    const cookie = res.get('Set-Cookie');
    if (!cookie) throw new Error('No cookie returned from signin');
    return { user, cookie };
  }

  // return the raw response for tests expecting failure
  const res = await req;
  return { user, res };
};
