import { PasswordManager } from '../../../common/utils/passwordManager';
import { LoginFailedError } from './errors/loginFailedError';
import { UsersRepository } from '../../../common/domains/users/user/user.repo';
import { SessionManager } from '../../../common/session/utils/sessionManager';
import { RolesRepository } from '../../../common/domains/users/role/role.repo';

export class AuthService {
  constructor(
    private userRepo: UsersRepository,
    private roleRepo: RolesRepository,
    private sessionManager: SessionManager,
  ) {}

  /**
   * Attempts to log in a user.
   *
   * @throws {LoginFailedError} If user does not exist or password is invalid.
   */
  async login(email: string, password: string) {
    const user = await this.userRepo.getByEmail(email);

    if (!user) throw new LoginFailedError();
    const role = await this.roleRepo.getById(user.role_id);
    if (!role) throw new LoginFailedError();

    const isPasswordValid = await PasswordManager.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) throw new LoginFailedError();

    const sessionToken = await this.sessionManager.createSession({
      userId: user.id,
      email: user.email,
      role: role.name,
    });

    return { sessionToken };
  }
  /**
   *
   * Deletes session in redis if token availble in cookie
   */
  async logout(sessionToken?: string) {
    if (sessionToken) {
      await this.sessionManager.deleteSession(sessionToken);
    }
  }
}
