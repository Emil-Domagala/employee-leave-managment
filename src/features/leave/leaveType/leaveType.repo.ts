import { Pool } from 'pg';
import { LeaveType } from './leaveType.entity';

export class LeaveTypesRepository {
  constructor(private pool: Pool) {}
  async getById(id: string): Promise<LeaveType | null> {
    const { rows } = await this.pool.query(
      'SELECT * FROM leave_types WHERE id = $1',
      [id],
    );
    return rows[0] ?? null;
  }

  async create(l: {
    name: string;
    is_paid: boolean;
    annual_allowance: number;
  }): Promise<LeaveType> {
    const sql = `INSERT INTO leave_types (name, is_paid, annual_allowance)
                 VALUES ($1,$2,$3)
                 RETURNING *;`;

    const { rows } = await this.pool.query(sql, [
      l.name,
      l.is_paid,
      l.annual_allowance,
    ]);
    return rows[0];
  }
}
