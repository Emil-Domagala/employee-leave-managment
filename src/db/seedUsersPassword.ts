import { PasswordManager } from '../common/utils/passwordManager';
import { pool } from '../config/db';

export async function seedUsersPassword() {
  const users = [
    { email: 'alice@example.com', password: 'password' },
    { email: 'bob@example.com', password: 'password' },
    { email: 'charlie@example.com', password: 'password' },
    { email: 'test@test.test', password: 'password' },
  ];

  for (const u of users) {
    const hashed = await PasswordManager.toHash(u.password);
    await pool.query(`UPDATE users SET password = $1 WHERE email = $2`, [
      hashed,
      u.email,
    ]);
  }

  console.log('Users seeded with hashed passwords');
}
