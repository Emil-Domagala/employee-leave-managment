import jwt, { JwtPayload as DefaultJwtPayload } from 'jsonwebtoken';
import { getEnvNumber, getEnvString } from '../../utils/getEnv';
import { AuthTokenInvalidError } from '../../errors/authTokenInvalidError';
import { UnauthorizedError } from '../../../auth/errors/unauthorizedError';

interface JwtPayload extends DefaultJwtPayload {
  email: string;
  userId: number;
}

const {
  tokenExpiration,
  refreshTokenExpiration,
  jwtSecretKey,
  jwtRefreshSecret,
} = {
  tokenExpiration: getEnvNumber('AUTH_TOKEN_EXPIRATION'),
  refreshTokenExpiration: getEnvNumber('REFRESH_TOKEN_EXPIRATION'),
  jwtSecretKey: getEnvString('JWT_AUTH_SECRETKEY'),
  jwtRefreshSecret: getEnvString('JWT_REFRESH_SECRETKEY'),
};

const createToken = (
  payload: object,
  secret: string,
  expiresIn: number,
): string => jwt.sign(payload, secret, { expiresIn });

export const createAuthToken = ({
  email,
  userId,
}: {
  email: string;
  userId: number;
}): string => createToken({ email, userId }, jwtSecretKey, tokenExpiration);

export const createRefreshToken = ({
  email,
  userId,
}: {
  email: string;
  userId: number;
}): string =>
  createToken({ email, userId }, jwtRefreshSecret, refreshTokenExpiration);

const verifyToken = (token: string, secret: string): JwtPayload => {
  const decoded = jwt.verify(token, secret);
  if (typeof decoded === 'string') {
    throw new Error('Invalid token payload');
  }
  return decoded as JwtPayload;
};

export const verifyAuthToken = (token: string): JwtPayload => {
  try {
    return verifyToken(token, jwtSecretKey);
  } catch (e) {
    throw new AuthTokenInvalidError();
  }
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  try {
    return verifyToken(token, jwtRefreshSecret);
  } catch {
    throw new UnauthorizedError();
  }
};
