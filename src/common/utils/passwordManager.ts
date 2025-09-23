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

  /**
   * Generates a random secure password.
   * @param length Desired password length (default 12).
   */
  static generate(length: number = 12): string {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const symbols = '!@#$%^&*()-_=+[]{};:,.<>?';
    const allChars = upper + lower + digits + symbols;

    if (length < 8) {
      throw new Error('Password length should be at least 8 characters');
    }

    // Ensure at least one of each type
    const getRandom = (str: string) =>
      str[Math.floor(Math.random() * str.length)];

    let password = [
      getRandom(upper),
      getRandom(lower),
      getRandom(digits),
      getRandom(symbols),
    ];

    // Fill the rest
    for (let i = password.length; i < length; i++) {
      password.push(getRandom(allChars));
    }

    // Shuffle the password to avoid predictable pattern
    return password.sort(() => Math.random() - 0.5).join('');
  }
}
