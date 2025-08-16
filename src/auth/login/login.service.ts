import { User } from '../../user/user.entity';
import { PasswordManager } from '../../common/utils/passwordManager';
import {
  createAuthToken,
  createRefreshToken,
} from '../../common/jwt/utils/jwtTokens';
import { LoginFailedError } from '../errors/loginFailedError';
import { Repository } from 'typeorm';

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

    const authToken = createAuthToken({
      email: user.email,
      userId: user.id,
    });
    const refreshToken = createRefreshToken({
      email: user.email,
      userId: user.id,
    });

    return { authToken, refreshToken };
  }
}
