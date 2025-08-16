import {
  createAuthToken,
  verifyRefreshToken,
} from '../../common/jwt/utils/jwtTokens';
import { UnauthorizedError } from '../errors/unauthorizedError';

export class RefreshTokenService {
  refreshToken(refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedError();

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) throw new UnauthorizedError();

    const authToken = createAuthToken({
      email: payload.email,
      userId: payload.userId,
    });

    return authToken;
  }
}
