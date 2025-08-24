import { Pool } from 'pg';
import { LeaveBalance } from './leaveBalance.entity';

export class LeaveBalancesRepository {
  constructor(private pool: Pool) {}
  async getById(id: string): Promise<LeaveBalance | null> {
    const { rows } = await this.pool.query(
      'SELECT * FROM leave_balances WHERE id = $1',
      [id],
    );
    return rows[0] ?? null;
  }

  async create(lb: {
    employee_id: string;
    leave_type_id: string;
    year: number;
    days_allocated: number;
    days_taken: number;
    days_remaining: number;
  }): Promise<LeaveBalance> {
    const sql = `INSERT INTO leave_balances (employee_id, leave_type_id, year, days_allocated, days_taken, days_remaining)
                 VALUES ($1,$2,$3,$4,$5,$6)
                 RETURNING *;`;

    const { rows } = await this.pool.query(sql, [
      lb.employee_id,
      lb.leave_type_id,
      lb.year,
      lb.days_allocated,
      lb.days_taken,
      lb.days_remaining,
    ]);
    return rows[0];
  }
}
