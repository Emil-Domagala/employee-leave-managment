import crypto from 'crypto';
import { getEnvNumber, getEnvString } from '../../utils/getEnv';
import { SessionInvalidError } from '../errors/sessionInvalidError';
import { RedisClientType } from 'redis';
import { CreateUserSesion } from './createSession.interface';


function isSessionData(data: unknown): data is CreateUserSesion {
  return (
    typeof data === 'object' &&
    data !== null &&
    'userId' in data &&
    'email' in data &&
    'role' in data
  );
}

export class SessionManager {
  private expirationSeconds: number;
  public cookieName: string;

  constructor(private redisClient: RedisClientType<any>) {
    this.expirationSeconds = getEnvNumber('SESSION_EXPIRATION_SEC');
    this.cookieName = getEnvString('SESSION_COOKIE_NAME');
  }

  /**
   * Create a new session in Redis with expiration
   */
  public async createSession(data: CreateUserSesion): Promise<string> {
    const token = this.generateToken();

    await this.redisClient.setEx(
      token,
      this.expirationSeconds,
      JSON.stringify(data),
    );
    return token;
  }

  /**
   * Verify session token and extend expiration TTL
   * @throws {SessionInvalidError} If user does not have valid session
   */
  public async verifyAndExtendSession(token: string): Promise<CreateUserSesion> {
    const sessionJson = await this.redisClient.getEx(token, {
      EX: this.expirationSeconds,
    });
    if (!sessionJson) throw new SessionInvalidError();

    const parsedData: unknown = JSON.parse(sessionJson);

    if (!isSessionData(parsedData)) throw new SessionInvalidError();

    return parsedData;
  }

  /**
   * Delete session token (logout)
   */
  public async deleteSession(token: string): Promise<void> {
    await this.redisClient.del(token);
  }

  /**
   * Generate secure random token string
   */
  private generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}
