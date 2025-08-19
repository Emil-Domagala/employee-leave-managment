import { User } from '../../user/user.entity';
import { PasswordManager } from '../../common/utils/passwordManager';

import { LoginFailedError } from '../errors/loginFailedError';
import { Repository } from 'typeorm';
import { SessionManager } from '../../common/session/utils/sessionManager';

export class LoginService {
  constructor(private userRepo: Repository<User>) {}

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) throw new LoginFailedError();

    const isPasswordValid = await PasswordManager.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) throw new LoginFailedError();

    const sessionManager = new SessionManager();

    const sessionToken = await sessionManager.createSession(
      user.id,
      user.email,
    );

    return { sessionToken };
  }
}
