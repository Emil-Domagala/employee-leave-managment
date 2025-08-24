import { PasswordManager } from '../../common/utils/passwordManager';
import { LoginFailedError } from './errors/loginFailedError';
import { UsersRepository } from '../users/user/user.repo';
import { SessionManager } from '../../common/session/utils/sessionManager';

export class AuthService {
  constructor(
    private userRepo: UsersRepository,
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

    const isPasswordValid = await PasswordManager.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) throw new LoginFailedError();

    const sessionToken = await this.sessionManager.createSession(
      user.id,
      user.email,
    );

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
