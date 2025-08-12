import * as jwt from 'jsonwebtoken';
import { getEnvNumber, getEnvString } from './getEnv';

const config = {
  tokenExpiration: getEnvNumber('AUTH_TOKEN_EXPIRATION'),
  refreshTokenExpiration: getEnvNumber('REFRESH_TOKEN_EXPIRATION'),
  jwtSecretKey: getEnvString('JWT_AUTH_SECRETKEY'),
  jwtRefreshSecret: getEnvString('JWT_REFRESH_SECRETKEY'),
};

const createToken = (payload: object, secret: string, expiresIn: number): string => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const createAuthToken = (email: string, userId: string): string => {
  return createToken({ email, userId }, config.jwtSecretKey, config.tokenExpiration);
};

export const createRefreshToken = (email: string, userId: string): string => {
  return createToken({ email, userId }, config.jwtRefreshSecret, config.refreshTokenExpiration);
};
