import { PasswordManager } from '../common/utils/passwordManager';
import { getPool } from '../config/db';
import { getEnvString } from '../common/utils/getEnv';

export async function seedAdmin() {
  const admin = {
    firstName: process.env.ADMIN_FIRST_NAME || 'Admin',
    lastName: process.env.ADMIN_LAST_NAME || 'User',
    email: getEnvString('ADMIN_EMAIL'),
    password: getEnvString('ADMIN_PASSWORD'),
  };

  if (!admin.email || !admin.password) {
    throw new Error('Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env');
  }

  const hashed = await PasswordManager.toHash(admin.password);

  await getPool().query(
    `
    INSERT INTO users (first_name, last_name, email, salary, role_id, status, password)
    VALUES ($1, $2, $3, 0.00, (SELECT id FROM roles WHERE name = 'administrator'), 'active', $4)
    ON CONFLICT (email) DO UPDATE SET
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      role_id = (SELECT id FROM roles WHERE name = 'administrator'),
      status = 'active',
      password = EXCLUDED.password
    `,
    [admin.firstName, admin.lastName, admin.email, hashed],
  );

  console.log(`Administrator seeded: ${admin.email}`);
}
