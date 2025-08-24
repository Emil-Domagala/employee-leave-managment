import { Pool } from 'pg';
import { Role } from './role.entity';

export class RolesRepository {
  constructor(private pool: Pool) {}
  async getById(id: string): Promise<Role | null> {
    const { rows } = await this.pool.query(
      'SELECT * FROM roles WHERE id = $1',
      [id],
    );
    return rows[0] ?? null;
  }

  async getByName(name: string): Promise<Role | null> {
    const { rows } = await this.pool.query(
      'SELECT * FROM roles WHERE name = $1',
      [name],
    );
    return rows[0] ?? null;
  }

  async create(r: { name: 'manager' | 'employee' }): Promise<Role> {
    const sql = `INSERT INTO roles (name)
                 VALUES ($1)
                 RETURNING *;`;

    const { rows } = await this.pool.query(sql, [r.name]);
    return rows[0];
  }
}
