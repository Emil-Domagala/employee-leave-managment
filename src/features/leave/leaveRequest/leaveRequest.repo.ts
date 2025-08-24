import { Pool } from 'pg';
import { LeaveRequest } from './leaveRequest.entity';

export class LeaveRequestsRepository {
  constructor(private pool: Pool) {}
  async getById(id: string): Promise<LeaveRequest | null> {
    const { rows } = await this.pool.query(
      'SELECT * FROM leave_request WHERE id = $1',
      [id],
    );
    return rows[0] ?? null;
  }

  async create(lr: {
    employee_id: string;
    leave_type_id: string;
    start_date: Date;
    end_date: Date;
    total_days: number;
    status: 'pending' | 'approved' | 'rejected' | 'cancelled';
    approver_id: string;
    request_date: Date;
    decision_date: Date | null;
  }): Promise<LeaveRequest> {
    const sql = `INSERT INTO leave_request
                   (employee_id, leave_type_id, start_date, end_date, total_days, status, approver_id, request_date, decision_date)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
                 RETURNING *;`;

    const { rows } = await this.pool.query(sql, [
      lr.employee_id,
      lr.leave_type_id,
      lr.start_date,
      lr.end_date,
      lr.total_days,
      lr.status,
      lr.approver_id,
      lr.request_date,
      lr.decision_date,
    ]);
    return rows[0];
  }
}
