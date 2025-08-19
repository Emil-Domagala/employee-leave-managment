import * as bcrypt from 'bcrypt';

/**
 * Utility class for hashing and verifying passwords using bcrypt.
 */
export class PasswordManager {
  /**
   * Hashes a plain text password using bcrypt with a generated salt.
   */
  static async toHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  /**
   * Compares a plain text password against a stored bcrypt hash.
   */
  static async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
