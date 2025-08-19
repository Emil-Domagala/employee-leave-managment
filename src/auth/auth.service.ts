import { User } from '../user/user.entity';
import { PasswordManager } from '../common/utils/passwordManager';

import { LoginFailedError } from './errors/loginFailedError';
import { Repository } from 'typeorm';
import { SessionManager } from '../common/session/utils/sessionManager';

export class AuthService {
  constructor(
    private userRepo: Repository<User>,
    private sessionManager: SessionManager = new SessionManager(),
  ) {}

  /**
   * Attempts to log in a user.
   *
   * @throws {LoginFailedError} If user does not exist or password is invalid.
   */
  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } });

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
}
