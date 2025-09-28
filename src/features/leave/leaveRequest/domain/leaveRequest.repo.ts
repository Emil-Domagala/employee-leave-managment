import { Pool } from 'pg';
import {
  LeaveRequestDto,
  LeaveRequestWithTypeAndEmployee,
  LeaveRequestStatus,
  CreateLeaveRequestDto,
} from './leaveRequest.entity';

export class LeaveRequestsRepository {
  constructor(private pool: Pool) {}

  async getById(id: string): Promise<LeaveRequestDto | null> {
    const sql = `SELECT * FROM leave_requests WHERE id = $1`;
    const { rows } = await this.pool.query(sql, [id]);
    return rows[0] ?? null;
  }

  async create(lr: CreateLeaveRequestDto): Promise<LeaveRequestDto> {
    const sql = `INSERT INTO leave_requests
                   (employee_id, leave_type_id, start_date, end_date, status, approver_id, request_date, decision_date)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
                 RETURNING *;`;

    const { rows } = await this.pool.query(sql, [
      lr.employee_id,
      lr.leave_type_id,
      lr.start_date,
      lr.end_date,
      lr.status ?? LeaveRequestStatus.Pending,
      lr.approver_id ?? null,
      lr.request_date ?? new Date(),
      lr.decision_date ?? null,
    ]);
    return rows[0];
  }

  async getByIdWithTypeAndEmployee(
    id: string,
  ): Promise<LeaveRequestWithTypeAndEmployee | null> {
    const sql = `
      SELECT 
        lr.id, lr.start_date, lr.end_date, lr.status, lr.request_date, lr.decision_date,
        json_build_object(
          'id', lt.id,
          'name', lt.name,
          'is_paid', lt.is_paid,
          'annual_allowance', lt.annual_allowance
        ) AS leave_type,
        json_build_object(
          'id', e.id,
          'first_name', e.first_name,
          'last_name', e.last_name,
          'email', e.email,
          'salary', e.salary,
          'role_id', e.role_id,
          'status', e.status,
          'password', e.password
        ) AS employee,
        CASE 
          WHEN a.id IS NOT NULL THEN json_build_object(
            'id', a.id,
            'first_name', a.first_name,
            'last_name', a.last_name,
            'email', a.email,
            'salary', a.salary,
            'role_id', a.role_id,
            'status', a.status,
            'password', a.password
          )
          ELSE NULL
        END AS approver
      FROM leave_requests lr
      JOIN leave_types lt ON lr.leave_type_id = lt.id
      JOIN users e ON lr.employee_id = e.id
      LEFT JOIN users a ON lr.approver_id = a.id
      WHERE lr.id = $1
    `;

    const { rows } = await this.pool.query(sql, [id]);
    return rows[0] ?? null;
  }

  async updateStatus(
    id: string,
    status: LeaveRequestStatus,
    approverId: string,
  ): Promise<LeaveRequestDto | null> {
    const sql = `
      UPDATE leave_requests
      SET status = $1,
          approver_id = $2,
          decision_date = NOW()
      WHERE id = $3
      RETURNING *;
    `;
    const { rows } = await this.pool.query(sql, [status, approverId, id]);
    return rows[0] ?? null;
  }

  async getAll(): Promise<LeaveRequestDto[]> {
    const sql = `SELECT * FROM leave_requests ORDER BY request_date DESC`;
    const { rows } = await this.pool.query(sql);
    return rows;
  }

  async getAllByUserId(employeeId: string): Promise<LeaveRequestDto[]> {
    const sql = `
      SELECT * 
      FROM leave_requests 
      WHERE employee_id = $1
      ORDER BY request_date DESC
    `;
    const { rows } = await this.pool.query(sql, [employeeId]);
    return rows;
  }

  async getUsedAllowance(userId: string, leaveTypeId: string): Promise<number> {
    const sql = `
      SELECT COUNT(*)::int AS used
      FROM leave_requests
      WHERE employee_id = $1
        AND leave_type_id = $2
        AND status = 'approved'
    `;
    const { rows } = await this.pool.query(sql, [userId, leaveTypeId]);
    return rows[0]?.used ?? 0;
  }

  async hasOverlappingRequest(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<boolean> {
    const sql = `
      SELECT 1
      FROM leave_requests
      WHERE employee_id = $1
        AND status IN ('pending', 'approved')
        AND (
          (start_date, end_date) OVERLAPS ($2, $3)
        )
      LIMIT 1
    `;
    const { rows } = await this.pool.query(sql, [userId, startDate, endDate]);
    return rows.length > 0;
  }

  async deleteById(id: string): Promise<void> {
    await this.pool.query('DELETE FROM leave_requests WHERE id = $1', [id]);
  }
}
