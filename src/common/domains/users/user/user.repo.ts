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

  async create(u: Omit<User,'id'>): Promise<User> {
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
      u.password
    ]);
    return rows[0];
  }
}

