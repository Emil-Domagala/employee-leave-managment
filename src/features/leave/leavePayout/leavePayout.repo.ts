import { Pool } from 'pg';
import { LeavePayout } from './leavePayout.entity';

export class LeavePayoutsRepository {
  constructor(private pool: Pool) {}
  async getById(id: string): Promise<LeavePayout | null> {
    const { rows } = await this.pool.query(
      'SELECT * FROM leave_payouts WHERE id = $1',
      [id],
    );
    return rows[0] ?? null;
  }

  async create(lp: {
    leave_request_id: string;
    employee_id: string;
    calculated_on: Date;
    amount: number;
    currency: string;
    compensation_history_id: string;
  }): Promise<LeavePayout> {
    const sql = `INSERT INTO leave_payouts
                   (leave_request_id, employee_id, calculated_on, amount, currency, compensation_history_id)
                 VALUES ($1,$2,$3,$4,$5,$6)
                 RETURNING *;`;

    const { rows } = await this.pool.query(sql, [
      lp.leave_request_id,
      lp.employee_id,
      lp.calculated_on,
      lp.amount,
      lp.currency,
      lp.compensation_history_id,
    ]);
    return rows[0];
  }
}
