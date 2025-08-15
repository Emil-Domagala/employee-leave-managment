import { AppDataSource } from '../../data-source';
import { User } from '../../user/user.entity';
import { PasswordManager } from '../../common/utils/passwordManager';
import {
  createAuthToken,
  createRefreshToken,
} from '../../common/jwt/utils/jwtTokens';
import { LoginFailedError } from '../errors/loginFailedError';

export class AuthService {
  async login(email: string, password: string) {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { email } });
    if (!user) throw new LoginFailedError();

    const isPasswordValid = await PasswordManager.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) throw new LoginFailedError();

    const authToken = createAuthToken({ email: user.email, userId: user.id });
    const refreshToken = createRefreshToken({
      email: user.email,
      userId: user.id,
    });

    return { authToken, refreshToken };
  }
}
