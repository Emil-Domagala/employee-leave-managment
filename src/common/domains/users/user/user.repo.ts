import { Pool } from 'pg';
import { User } from './user.entity';

export class UsersRepository {
  constructor(private pool: Pool) {}

  async getById(id: string): Promise<User | null> {
    const { rows } = await this.pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id],
    );
    return rows[0] ?? null;
  }

  async getByEmail(email: string): Promise<User | null> {
    const { rows } = await this.pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email],
    );
    return rows[0] ?? null;
  }

  async deleteByEmail(email: string): Promise<void> {
    const { rows } = await this.pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email],
    );
    const userId = rows[0]?.id;
    if (!userId) return;

    await this.pool.query(
      'DELETE FROM compensations_history WHERE user_id = $1',
      [userId],
    );

    await this.pool.query('DELETE FROM users WHERE id = $1', [userId]);
  }

  async create(u: Omit<User, 'id'>): Promise<User> {
    const sql = `INSERT INTO users (first_name, last_name, email, salary, role_id, status, password)
                 VALUES ($1,$2,$3,$4,$5,$6,$7)
                 RETURNING *;`;

    const { rows } = await this.pool.query(sql, [
      u.first_name,
      u.last_name,
      u.email,
      u.salary,
      u.role_id,
      u.status,
      u.password,
    ]);
    return rows[0];
  }

  async isUserActive(userId: string): Promise<boolean> {
    const sql = `SELECT status FROM users WHERE id = $1`;
    const { rows } = await this.pool.query(sql, [userId]);
    return rows[0]?.status === 'active';
  }
}
