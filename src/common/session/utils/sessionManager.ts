import crypto from 'crypto';
import redisClient from '../../../redisClient';
import { getEnvNumber, getEnvString } from '../../utils/getEnv';
import { SessionInvalidError } from '../errors/sessionInvalidError';

interface SessionData {
  userId: number;
  email: string;
}

export class SessionManager {
  private expirationSeconds: number;
  public cookieName: string;

  constructor() {
    this.expirationSeconds = getEnvNumber('SESSION_EXPIRATION_SEC');
    this.cookieName = getEnvString('SESSION_COOKIE_NAME');
  }

  /**
   * Create a new session in Redis with expiration
   */
  public async createSession(userId: number, email: string): Promise<string> {
    const token = this.generateToken();
    const sessionData: SessionData = { userId, email };

    await redisClient.setEx(
      token,
      this.expirationSeconds,
      JSON.stringify(sessionData),
    );
    return token;
  }

  /**
   * Verify session token and extend expiration TTL
   * @throws {SessionInvalidError} If user does not have valid session
   */
  public async verifyAndExtendSession(token: string): Promise<SessionData> {
    const sessionJson = await redisClient.getEx(token, {
      EX: this.expirationSeconds,
    });
    if (!sessionJson) throw new SessionInvalidError();

    const sessionData = JSON.parse(sessionJson) as SessionData;
    return sessionData;
  }

  /**
   * Delete session token (logout)
   */
  public async deleteSession(token: string): Promise<void> {
    await redisClient.del(token);
  }

  /**
   * Generate secure random token string
   */
  private generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}
